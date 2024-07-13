import type { Player } from "@minecraft/server"

import { waitForFirstPlayerInitialSpawn } from "../util/game"
import type { IOptionItemRange } from "./OptionItemRange.class"
import type { IOptionItemSelection } from "./OptionItemSelection.class"
import { PlayerOption } from "./PlayerOption.class"

export class OptionNamespace {
  name: string

  constructor(name: string) {
    this.name = name
  }

  players = new Map<Player, PlayerOption>()
  _items = new Set<IOptionItemSelection<any> | IOptionItemRange>()

  addItem(opts: IOptionItemSelection<any> | IOptionItemRange) {
    this._items.add(opts)
    return this
  }
  applyPlayer(player: Player) {
    if (this.players.has(player)) return this.players.get(player)
    const playerOpt = new PlayerOption(player, this.name)
    for (const item of this._items) {
      //@ts-ignore
      item._player = player
      //@ts-ignore
      playerOpt.addItem(item)
    }

    this.players.set(player, playerOpt)
    return playerOpt
  }
  async applyMainPlayer() {
    const player = await waitForFirstPlayerInitialSpawn()
    return this.applyPlayer(player)
  }
  async init() {
    const valueMap = new Map<Player, any>()
    for (const [player, playerOpt] of this.players) {
      const result = await playerOpt.init()
      valueMap.set(player, result)
    }
    this.applyPlayer = () => {
      throw new Error("Can't apply player after initialization.")
    }
    return valueMap
  }
  getPlayer(player: Player) {
    const playerOption = this.players.get(player)

    if (!playerOption) throw new Error("Can't get player  options.")

    return playerOption
  }
}
