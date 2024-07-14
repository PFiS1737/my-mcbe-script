import type { Player } from "@minecraft/server"

import { waitForFirstPlayerInitialSpawn } from "../util/game"
import type { IOptionItemRange } from "./OptionItemRange.class"
import type { IOptionItemSelection } from "./OptionItemSelection.class"
import { PlayerOption } from "./PlayerOption.class"

export class OptionNamespace {
  id: string
  name: string

  constructor(id: string, name?: string) {
    this.id = id
    this.name = name ?? id
  }

  players = new Map<Player, PlayerOption>()

  _items = {
    range: new Set<IOptionItemRange>(),
    selection: new Set<IOptionItemSelection<any>>(),
  }

  addSelectionItem(opts: IOptionItemSelection<any>) {
    this._items.selection.add(opts)
    return this
  }
  addRangeItem(opts: IOptionItemRange) {
    this._items.range.add(opts)
    return this
  }
  addToggleItem<T extends IOptionItemSelection<boolean>>(
    opts: {
      [P in keyof T as Exclude<P, "values">]: T[P]
    }
  ) {
    this._items.selection.add({
      ...opts,
      values: [
        [false, "关闭"],
        [true, "开启"],
      ],
    })
    return this
  }

  applyPlayer(player: Player) {
    if (this.players.has(player)) return this.players.get(player)

    const playerOpt = new PlayerOption(player, this.id)
    for (const item of this._items.selection) {
      playerOpt.addSelectionItem({
        ...item,
        _player: player,
      })
    }
    for (const item of this._items.range) {
      playerOpt.addRangeItem({
        ...item,
        _player: player,
      })
    }

    this.players.set(player, playerOpt)

    return playerOpt
  }
  async applyMainPlayer() {
    const player = await waitForFirstPlayerInitialSpawn()
    return this.applyPlayer(player)
  }
  async init() {
    const valueMap = new Map<
      Player,
      Awaited<ReturnType<PlayerOption["init"]>>
    >()
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
