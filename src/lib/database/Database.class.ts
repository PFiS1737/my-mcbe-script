import type {
  Player,
  ScoreboardIdentity,
  ScoreboardObjective,
} from "@minecraft/server"

import md5 from "md5"

import { asyncRun, getOrAddObjective } from "../util/game"
import { type Serializable, deserialize, serialize } from "../util/index"
import type { WrappedPlayer } from "../wrapper/entity"

export const ALL_DATABASES = new Map<string, Database<any>>()

export class Database<V extends Serializable> {
  id: string
  objective: ScoreboardObjective

  static open<T extends Serializable>(
    player: Player | WrappedPlayer,
    dbName: string
  ) {
    return new Database<T>(player, dbName)
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

  store = new Map<string, { value: V; participant: ScoreboardIdentity }>()

  _syncDataFromScoreboard() {
    this.store.clear()
    for (const participant of this.objective.getParticipants()) {
      const data = deserialize(participant.displayName) as Record<string, V>
      const key = Object.keys(data)[0]
      const value = data[key]
      this.store.set(key, { value, participant })
    }
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
    for (const [, { participant }] of this.store)
      await asyncRun(() => this.objective.removeParticipant(participant))

    this.store.clear()
  }
  get(key: string) {
    return this.store.get(key)?.value
  }
  async set(key: string, value: V) {
    await this.delete(key)
    const data = serialize({ [key]: value }).replaceAll('"', "'")
    if (data.length > 32767)
      throw new RangeError("Database: Value is too long.")
    await asyncRun(() => this.objective.setScore(data, 1))

    this._syncDataFromScoreboard()
  }
  getAll() {
    const output: Record<string, V> = {}
    for (const [key, value] of this) output[key] = value
    return output
  }
  *entries(): Generator<[string, V]> {
    for (const [key, { value }] of this.store.entries()) yield [key, value]
  }
  *keys(): Generator<string> {
    for (const key of this.store.keys()) yield key
  }
  *values(): Generator<V> {
    for (const { value } of this.store.values()) yield value
  }
  [Symbol.iterator]() {
    return this.entries()
  }
}

export default Database
