import { world } from "@minecraft/server"

import { serialize } from "serialize-javascript"
import md5 from "md5"

import { each, eachAsync, deserialize } from "../util/index.js"
import { asyncRun } from "../util/game.js"
import { Commands } from "../commands/index.js"

const ALL_DBS = new Map()

export class Database {
    static open(player, dbName) {
        return new Database(player, dbName)
    }
    constructor(player, dbName) {
        const id = md5("db:" + dbName + "_" + player.id).slice(8, 24)
        this.id = id
        this.objective = world.scoreboard.getObjective(id)
            ?? world.scoreboard.addObjective(id, "db:" + dbName)
        this.targetPlayer = player
        this.store = new Map()
        
        this._syncDataFromScoreboard()
        
        ALL_DBS.set(id, this)
    }
    _syncDataFromScoreboard() {
        this.store.clear()
        each(this.objective.getParticipants(), participant => {
            const data = deserialize(`${participant.displayName}`)
            const key = Object.keys(data)[0]
            const value = data[key]
            this.store.set(key, { value, participant })
        })
    }
    has(key) {
        return this.store.has(key)
    }
    async delete(key) {
        if (this.has(key)) {
            const { participant } = this.store.get(key)
            await asyncRun(() => this.objective.removeParticipant(participant))
            this.store.delete(key)
            return true
        } else return false
    }
    async clear() {
        await eachAsync(this.store, async ([, { participant }]) => await asyncRun(() => this.objective.removeParticipant(participant)))
        this.store.clear()
    }
    get(key) {
        if (this.has(key)) return this.store.get(key).value
    }
    async set(key, value) {
        await this.delete(key)
        const data = serialize({ [key]: value }).replaceAll("\"", "'")
        if (data.length > 32767) throw new RangeError("Database: Only accepts a string value less than 32767 characters.");
        await asyncRun(() => this.objective.setScore(data, 1))
        // await Commands.asyncRun(`scoreboard players set "${data}" ${this.objective.id} 1`)
        this._syncDataFromScoreboard()
    }
    *entries() {
        for (const [ key, { value } ] of this.store.entries()) yield [ key, value ]
    }
    *keys() {
        for (const key of this.store.keys()) yield key
    }
    *values() {
        for (const { value } of this.store.values()) yield value
    }
    [Symbol.iterator]() {
        return this.entries()
    }
}

export default Database
