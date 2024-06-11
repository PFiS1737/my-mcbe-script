import { serialize } from "serialize-javascript"

import { each } from "../util/index.js"

import { EventEmitter } from "../EventEmitter.class.js"

export class OptionItemSelection {
  constructor({
    name,
    description,
    values = [],
    defaultValue,
    events,
    reload,
    _player,
  }) {
    this.name = name
    this.description = description
    this.values = new Map(
      values.map((value) => {
        if (typeof value[0] === "object" || value[0] === undefined)
          value[0] = serialize(value[0])
        if (value[0] === true && !value[1]) value[1] = "开启"
        else if (value[0] === false && !value[1]) value[1] = "关闭"
        return value
      })
    )
    this.events = new EventEmitter()
    this.reload = reload
    this._defaultValue = defaultValue
    this._player = _player

    if (events)
      each(events, (listener, eventName) => this.events.on(eventName, listener))

    if (defaultValue !== undefined && this.hasVal(defaultValue))
      this.selected = defaultValue
    else if (values[0]) this.selected = values[0][0]

    this.events.emit("inited", this.selected, _player)
    this.events.emit("changed", this.selected, undefined, _player)
  }
  select(value) {
    if (this.selected !== value && this.hasVal(value)) {
      this.original = this.selected
      this.selected = value
      this.events.emit("selected", this.selected, this.original, this._player)
      this.events.emit("changed", this.selected, this.original, this._player)
      return true
    }
    return false
  }
  hasVal(name) {
    return this.values.has(name) || !this.values.size
  }
}
