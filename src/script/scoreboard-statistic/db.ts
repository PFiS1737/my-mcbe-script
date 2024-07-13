import type { Player } from "@minecraft/server"

import { Database } from "@/lib/database/index"

import type { Criteria } from "./criteria/types"

export const globalDB = new Database<string>(
  { id: "global" } as Player,
  "scoreboard-statistic-global"
)

export const ALL_PLAYER_DATABASES = new Map<Player, EventDB>()

export class EventDB {
  player: Player
  db: Database<Set<string>>

  constructor(player: Player) {
    this.player = player
    this.db = Database.open(player, "scoreboard-statistic-player")
  }

  events = new Map<string, ReturnType<Criteria>["events"]>()

  // 此次因为有 events 这个运行时存储项，
  // 而不能多次 construct，
  // 故使用此方法将实例储存到 ALL_PLAYER_DATABASES 中
  static init(player: Player) {
    const db = new EventDB(player)
    ALL_PLAYER_DATABASES.set(player, db)
    return db
  }

  async addParticipated(objectiveId: string) {
    const participated = this.getParticipated()
    participated.add(objectiveId)
    await this.db.set("__participated__", participated)
  }
  getParticipated() {
    return new Set(this.db.get("__participated__") ?? [])
  }

  setEvents(objectiveId: string, events: ReturnType<Criteria>["events"]) {
    this.events.set(objectiveId, events)
  }
  getEvents(objectiveId: string) {
    return this.events.get(objectiveId)
  }

  async add(objectiveId: string, events: ReturnType<Criteria>["events"]) {
    await this.addParticipated(objectiveId)
    this.setEvents(objectiveId, events)
  }
  has(objectiveId: string) {
    return (
      this.events.has(objectiveId) && this.getParticipated().has(objectiveId)
    )
  }
  async delete(objectiveId: string) {
    const participated = this.getParticipated()
    if (participated.has(objectiveId)) {
      participated.delete(objectiveId)
      await this.db.set("__participated__", participated)
      this.events.delete(objectiveId)
      return true
    }
  }
  async clear() {
    await this.db.clear()
    this.events.clear()
  }
}
