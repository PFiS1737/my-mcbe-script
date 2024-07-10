import { Database } from "@/lib/database/index"

export const globalDB = new Database(
  { id: "global" },
  "scoreboard-statistic-global"
)

export const ALL_PLAYER_DATABASES = new Map()

export class EventDB {
  constructor(player) {
    this.db = new Database(player, "scoreboard-statistic-player")
    this.player = player
  }

  events = new Map()

  // 此次因为有 events 这个运行时存储项，
  // 而不能多次 construct，
  // 故使用此方法将实例储存到 ALL_PLAYER_DATABASES 中
  static init(player) {
    const db = new EventDB(player)
    ALL_PLAYER_DATABASES.set(player, db)
    return db
  }

  async addParticipated(objectiveId) {
    const participated = this.getParticipated()
    participated.add(objectiveId)
    await this.db.set("__participated__", participated)
  }
  getParticipated() {
    return new Set(this.db.get("__participated__") ?? [])
  }

  setEvents(objectiveId, events) {
    this.events.set(objectiveId, events)
  }
  getEvents(objectiveId) {
    return this.events.get(objectiveId)
  }

  async add(objectiveId, events) {
    await this.addParticipated(objectiveId)
    this.setEvents(objectiveId, events)
  }
  has(objectiveId) {
    return (
      this.events.has(objectiveId) && this.getParticipated().has(objectiveId)
    )
  }
  async delete(objectiveId) {
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
