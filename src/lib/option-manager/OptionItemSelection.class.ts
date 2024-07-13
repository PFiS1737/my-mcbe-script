import { each } from "../util/index"

import type { Player } from "@minecraft/server"
import { EventEmitter } from "../EventEmitter.class"

export interface IOptionItemSelection<T extends string | number | boolean> {
  name: string
  description: string
  values: Array<[T, string?]>
  defaultValue?: T
  reload?: boolean
  events?: {
    inited?: (selected: T, player: Player) => void
    changed?: (selected: T, original: T, player: Player) => void
    selected?: (selected: T, original: T, player: Player) => void
  }
}

export class OptionItemSelection<T extends string | number | boolean> {
  name: string
  description: string
  values: Map<T, string>
  reload?: boolean
  events: EventEmitter
  _player: Player

  original: T | undefined
  selected: T | undefined

  constructor({
    name,
    description,
    values = [],
    defaultValue,
    events,
    reload,
    _player,
  }: { _player: Player } & IOptionItemSelection<T>) {
    this.name = name
    this.description = description
    this.values = new Map(
      //@ts-ignore
      values.map((value) => {
        if (value[0] === true && !value[1]) value[1] = "开启"
        else if (value[0] === false && !value[1]) value[1] = "关闭"
        return value
      })
    )
    this.events = new EventEmitter()
    this.reload = reload
    this._player = _player

    if (events)
      each(events, (listener, eventName) => this.events.on(eventName, listener))

    if (defaultValue !== undefined && this.hasVal(defaultValue))
      this.selected = defaultValue
    else if (values[0]) this.selected = values[0][0]

    this.events.emit("inited", this.selected, _player)
    this.events.emit("changed", this.selected, undefined, _player)
  }
  select(value: T) {
    if (this.selected !== value && this.hasVal(value)) {
      this.original = this.selected
      this.selected = value
      this.events.emit("selected", this.selected, this.original, this._player)
      this.events.emit("changed", this.selected, this.original, this._player)
      return true
    }
    return false
  }
  hasVal(value: T) {
    return this.values.has(value) || !this.values.size
  }
}
