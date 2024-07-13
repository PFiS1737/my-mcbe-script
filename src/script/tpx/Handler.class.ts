import { asyncRun } from "@/util/game"

import type { PlayerOption } from "@/src/lib/option-manager/PlayerOption.class"
import type { Player } from "@minecraft/server"
import { ALL_PLAYER_DATABASES, type TpxDB } from "./db"
import { option } from "./option"

export class Handler {
  player: Player
  playerOption: PlayerOption
  playerDB: TpxDB

  constructor(player: Player) {
    this.player = player
    this.playerOption = option.getPlayer(player)

    const playerDB = ALL_PLAYER_DATABASES.get(player)

    if (!playerDB) throw new Error("Can't get player database.")

    this.playerDB = playerDB
  }

  async set({
    name = "default",
    option = {},
  }: {
    name?: string
    option?: {
      disposable?: boolean
      force?: boolean
    }
  }) {
    const info = await this.playerDB.set(Object.assign({ name }, option))
    if (name !== "__back__" && name !== "__death__") return { info }
  }
  async remove({ name = "default" }) {
    return await this.playerDB.remove(name)
  }
  async teleport({ name = "default" }) {
    const info = await this.playerDB.get(name)
    if (info) {
      if (
        this.playerOption.getItemVal("auto_back_point") &&
        name !== "__death__"
      ) {
        await this.set({
          name: "__back__",
          option: {
            disposable: true,
            force: true,
          },
        })
      }
      await asyncRun(() =>
        this.player.teleport(info.location, {
          dimension: info.dimension,
          checkForBlocks: false,
          keepVelocity: false,
        })
      )
      return { info }
    }
  }
  async tryTeleport({
    names = [],
  }: {
    names: string[]
  }) {
    for (const name of names) {
      const result = await this.teleport({ name })
      if (result) return result
    }
  }
  list() {
    const datas = this.playerDB.getAll().map(({ text }) => text)
    if (datas.length) return { msg: datas }
  }
}
