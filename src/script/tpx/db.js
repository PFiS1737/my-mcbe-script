import { each } from "@/util/index.js"

import { Database } from "@/lib/database/index.js"
import { Dialog } from "@/lib/dialog/index.js"
import { LocationInfo } from "@/lib/location/index.js"

export const ALL_PLAYER_DATABASES = new Map()

export class TpxDB {
  constructor(player) {
    this.db = Database.open(player, "tpx")
    this.player = player
  }

  static init(player) {
    const db = new TpxDB(player)
    ALL_PLAYER_DATABASES.set(player, db)
    return db
  }

  async set({ name, disposable, force }) {
    const info = new LocationInfo(this.player)
    const handleSet = async () => {
      await this.db.set(name, {
        info: info.textify(),
        disposable,
      })
      return info
    }
    if (!force && this.db.has(name)) {
      return await Dialog.confirm({
        body: `名称 ${name} 已被占用，是否覆盖？`,
        target: this.player,
        // @ts-ignore
        onConfirm: async () => await handleSet(),
      })
    }
    return await handleSet()
  }
  async get(name) {
    if (!this.db.has(name)) return
    const { info: data, disposable } = this.db.get(name)
    if (disposable) await this.db.delete(name)
    if (data) return new LocationInfo(data)
  }
  async remove(name) {
    if (!this.db.has(name)) return false
    return await Dialog.confirm({
      body: `是否删除 ${name} `,
      target: this.player,
      // @ts-ignore
      onConfirm: async () => await this.db.delete(name),
    })
  }
  getAll() {
    const output = []
    each(this.db, ([name, { info: data, disposable }]) => {
      const info = new LocationInfo(data)
      output.push({
        name,
        info,
        disposable,
        text: `${name} (${info})${disposable ? " [一次性]" : ""}`,
      })
    })
    return output
  }
}
