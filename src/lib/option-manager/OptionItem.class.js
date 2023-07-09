import { serialize } from "serialize-javascript"

import { each } from "../util/index.js"

import { EventEmitter } from "../EventEmitter.class.js"

export class OptionItem {
    constructor({ name, description, values = [], defaultValue, events, reload, _player }) {
        this.events = new EventEmitter()
        this.reload = reload
        this.name = name
        this.description = description
        this.values = new Map(values.map(value => {
            if (typeof value[0] === "object" || value[0] === undefined) value[0] = serialize(value[0])
            if (value[0] === true && !value[1]) value[1] = "开启"
            else if (value[0] === false && !value[1]) value[1] = "关闭"
            return value
        }))
        this._defaultValue = defaultValue
        if (events) each(events, (listener, eventName) => this.events.on(eventName, listener))
        if (defaultValue !== undefined && this.hasVal(defaultValue)) this.selected = defaultValue
        else if (values[0]) this.selected = values[0][0]
        this._player = _player
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
        } else return false
    }
    toggle() {
        const _values = [...this.values]
        for (let i = 0; i < _values.length; i++) {
            const item = _values[i]
            if (this.selected === item[0]) {
                if (i < _values.length - 1) this.select(_values[i + 1][0])
                else this.select(_values[0][0])
                break
            }
        }
    }
    addVal(name, description) {
        this.values.set(name, description)
        return this
    }
    delVal(name) {
        this.values.delete(name)
        return this
    }
    hasVal(name) {
        return this.values.has(name) || !this.values.size
    }
    getValueDescription(name) {
        if (name === undefined) name = this.selected
        return this.values.get(name)
    }
}
