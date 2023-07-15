import { each } from "@/util/index.js"

import { Database } from "@/lib/database/index.js"

export const ALL_DATABASES = new Map()

export class DB extends Database {
    constructor(player) {
        super(player, "scoreboard-statistic")
    }
    
    events = new Map()
    
    // 此次因为有 events 这个运行时存储项，
    // 而不能多次 construct，
    // 故使用此方法将实例储存到 ALL_DATABASES 中
    static init(player) {
        const db = new this(player)
        ALL_DATABASES.set(player, db)
        return db
    }
    
    async set(objectiveId, criteria, events) {
        await super.set(objectiveId, criteria)
        this.events.set(objectiveId, events)
    }
    async clear() {
        await super.clear()
        this.events.clear()
    }
    async delete(objectiveId) {
        await super.delete(objectiveId)
        this.events.delete(objectiveId)
    }
    get(objectiveId) {
        const criteria = super.get(objectiveId)
        const events = this.events.get(objectiveId)
        return {
            criteria,
            events
        }
    }
    getAll() {
        const output = {}
        each(this, ([ objectiveId, criteria ]) => {
            const events = this.events.get(objectiveId)
            output[objectiveId] = { criteria, events }
        })
        return output
    }
}

