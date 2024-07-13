import type { Player } from "@minecraft/server"

import { Database } from "@/lib/database/index"
import { Dialog } from "@/lib/dialog/index"
import { LocationInfo } from "@/lib/location/index"
import { each } from "@/util/index"

export const ALL_PLAYER_DATABASES = new Map<Player, TpxDB>()

export class TpxDB {
  player: Player
  db: Database<{
    info: ReturnType<LocationInfo["textify"]>
    disposable: boolean
  }>

  constructor(player: Player) {
    this.player = player
    this.db = Database.open(player, "tpx")
  }

  static init(player: Player) {
    const db = new TpxDB(player)
    ALL_PLAYER_DATABASES.set(player, db)
    return db
  }

  async set({
    name,
    disposable = false,
    force = false,
  }: {
    name: string
    disposable?: boolean
    force?: boolean
  }) {
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
        onConfirm: async () => await handleSet(),
      })
    }
    return await handleSet()
  }
  async get(name: string) {
    if (!this.db.has(name)) return
    const data = this.db.get(name)

    if (!data) return

    if (data.disposable) await this.db.delete(name)
    if (data.info) return new LocationInfo(data.info)
  }
  async remove(name: string) {
    if (!this.db.has(name)) return false

    return await Dialog.confirm({
      body: `是否删除 ${name} `,
      target: this.player,
      onConfirm: async () => await this.db.delete(name),
    })
  }
  getAll() {
    const output: Array<{
      name: string
      info: LocationInfo
      disposable: boolean
      text: string
    }> = []
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
