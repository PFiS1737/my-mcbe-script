import type { Player } from "@minecraft/server"

import { EventEmitter } from "../EventEmitter.class"
import { NumberRange } from "../NumberRange.class"
import { each } from "../util/index"

export interface IOptionItemRange {
  name: string
  description: string
  range?: [number, number, number?]
  defaultValue?: number
  reload?: boolean
  events?: {
    inited?: (selected: number, player: Player) => void
    changed?: (selected: number, original: number, player: Player) => void
    selected?: (selected: number, original: number, player: Player) => void
  }
}

export class OptionItemRange {
  name: string
  description: string
  range: NumberRange
  reload?: boolean
  events: EventEmitter
  _player: Player

  original: number | undefined
  selected: number | undefined

  constructor({
    name,
    description,
    range = [0, 1, 1],
    defaultValue,
    events,
    reload,
    _player,
  }: {
    _player: Player
  } & IOptionItemRange) {
    this.name = name
    this.description = description
    this.range = new NumberRange(...range)
    this.events = new EventEmitter()
    this.reload = reload
    this._player = _player

    if (events)
      each(events, (listener, eventName) => this.events.on(eventName, listener))

    if (defaultValue !== undefined && this._includes(defaultValue))
      this.selected = defaultValue
    else this.selected = this.range.min

    this.events.emit("inited", this.selected, _player)
    this.events.emit("changed", this.selected, undefined, _player)
  }
  select(value: number) {
    if (this.selected !== value && this._includes(value)) {
      this.original = this.selected
      this.selected = value
      this.events.emit("selected", this.selected, this.original, this._player)
      this.events.emit("changed", this.selected, this.original, this._player)
      return true
    }
    return false
  }
  _includes(value: number) {
    return this.range.includes(value)
  }
}
