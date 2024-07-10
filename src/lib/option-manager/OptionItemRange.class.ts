import { each } from "../util/index"

import { EventEmitter } from "../EventEmitter.class"
import { NumberRange } from "../NumberRange.class"

export class OptionItemRange {
  constructor({
    name,
    description,
    range = [0, 1, 1],
    defaultValue,
    events,
    reload,
    _player,
  }) {
    this.name = name
    this.description = description
    this.range = new NumberRange(...range)
    this.events = new EventEmitter()
    this.reload = reload
    this._defaultValue = defaultValue
    this._player = _player

    if (events)
      each(events, (listener, eventName) => this.events.on(eventName, listener))

    if (defaultValue !== undefined && this._includes(defaultValue))
      this.selected = defaultValue
    else this.selected = this.range.min

    this.events.emit("inited", this.selected, _player)
    this.events.emit("changed", this.selected, undefined, _player)
  }
  select(value) {
    if (this.selected !== value && this._includes(value)) {
      this.original = this.selected
      this.selected = value
      this.events.emit("selected", this.selected, this.original, this._player)
      this.events.emit("changed", this.selected, this.original, this._player)
      return true
    }
    return false
  }
  _includes(n) {
    return this.range.includes(n)
  }
}
