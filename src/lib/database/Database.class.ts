import type {
  Player,
  ScoreboardIdentity,
  ScoreboardObjective,
} from "@minecraft/server"

import md5 from "md5"

import { asyncRun, getOrAddObjective } from "../util/game"
import {
  type Serializable,
  deserialize,
  each,
  eachAsync,
  serialize,
} from "../util/index"
import type { WrappedPlayer } from "../wrapper/entity"

export const ALL_DATABASES = new Map<string, Database<any>>()

export class Database<T extends Serializable> {
  id: string
  objective: ScoreboardObjective

  static open<U extends Serializable>(
    player: Player | WrappedPlayer,
    dbName: string
  ) {
    return new Database<U>(player, dbName)
  }
  constructor(player: Player | WrappedPlayer, dbName: string) {
    const id = md5(`db:${dbName}_${player.id}`).slice(8, 24)
    this.id = id
    this.objective = getOrAddObjective(id, `db:${dbName}`)
    // this.player = player

    // if (!(player instanceof Player)) this.fakePlayer = true

    this._syncDataFromScoreboard()

    ALL_DATABASES.set(id, this)
  }

  store = new Map<string, { value: T; participant: ScoreboardIdentity }>()

  _syncDataFromScoreboard() {
    this.store.clear()
    each(this.objective.getParticipants(), (participant) => {
      const data = deserialize(participant.displayName) as Record<string, T>
      const key = Object.keys(data)[0]
      const value = data[key]
      this.store.set(key, { value, participant })
    })
  }
  has(key: string) {
    return this.store.has(key)
  }
  async delete(key: string) {
    if (this.has(key)) {
      const { participant } = this.store.get(key)!
      await asyncRun(() => this.objective.removeParticipant(participant))
      this.store.delete(key)
      return true
    }
    return false
  }
  async clear() {
    await eachAsync(
      this.store,
      async ([, { participant }]) =>
        await asyncRun(() => this.objective.removeParticipant(participant))
    )
    this.store.clear()
  }
  get(key: string) {
    return this.store.get(key)?.value
  }
  async set(key: string, value: T) {
    await this.delete(key)
    const data = serialize({ [key]: value }).replaceAll('"', "'")
    // FIXME: has ambiguity
    if (data.length > 32767)
      throw new RangeError(
        "Database: Only accepts a string value less than 32767 characters."
      )
    await asyncRun(() => this.objective.setScore(data, 1))

    this._syncDataFromScoreboard()
  }
  getAll() {
    const output: Record<string, T> = {}
    for (const [key, value] of this) output[key] = value
    return output
  }
  *entries(): Generator<[string, T]> {
    for (const [key, { value }] of this.store.entries()) yield [key, value]
  }
  *keys(): Generator<string> {
    for (const key of this.store.keys()) yield key
  }
  *values(): Generator<T> {
    for (const { value } of this.store.values()) yield value
  }
  [Symbol.iterator]() {
    return this.entries()
  }
}

export default Database
