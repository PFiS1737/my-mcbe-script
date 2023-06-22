import { ModalFormData, ActionFormData } from "@minecraft/server-ui"

import { serialize } from "serialize-javascript"

import { each, eachAsync } from "../util/index.js"
import { waitForFirstPlayerInitialSpawn } from "../util/game.js"

import Commands from "../commands/index.js"
import Dialog from "../dialog/index.js"
import Database from "../database/index.js"
import { EventEmitter } from "../EventEmitter.class.js"

export class OptionManager {
    constructor() {}
    
    namespaces = new Map()
    
    registerNamesapace(name) {
        const namespaces = new OptionNamespace(name)
        this.namespaces.set(name, namespaces)
        return namespaces
    }
    getNamesapace(name) {
        return this.namespaces.get(name)
    }
    async showDialog(player) {
        const form = new ActionFormData()
            .title("设置选项")
            .body("选择要设置的模块：")
        const nameMap = []
        each(this.namespaces, ([ name ]) => {
            nameMap.push(name)
            form.button(name)  // TODO name -> desc
        })
        
        const dialog = new Dialog({
            dialog: form,
            onSelect: async selection => {
                const name = nameMap[selection]
                await this.getNamesapace(name)
                    .getPlayer(player)
                    .showDialog(dialog)
            }
        })
        await dialog.show(player)
    }
}

class OptionNamespace {
    constructor(name) {
        this.name = name
    }
    
    players = new Map()
    _items = new Set()
    
    addItem(opts) {
        this._items.add(opts)
        return this
    }
    applyPlayer(player) {
        if (this.players.has(player.id)) return this.players.get(player.id)
        const playerOpt = new PlayerOption(player, this.name)
        each(this._items, item => {
            item._player = player
            playerOpt.addItem(item)
        })
        this.players.set(player.id, playerOpt)
        return playerOpt
    }
    async applyMainPlayer() {
        const player = await waitForFirstPlayerInitialSpawn()
        return this.applyPlayer(player)
    }
    async init() {
        const valueMap = {}
        await eachAsync(this.players, async ([ playerId, playerOpt ]) => {
            const result = await playerOpt.init()
            valueMap[playerId] = result
        })
        delete this.addPlayer
        return valueMap
    }
    
    getPlayer(player) {
        return this.players.get(player.id)
    }
}

class PlayerOption {
    constructor(player, name) {
        this.name = name
        this.db = Database.open(player, `option-manager:${name}`)
        this.player = player
    }
    
    items = {}
    
    addItem(opts) {
        this.items[opts.name] = new OptionItem(opts)
        return this
    }
    async _syncToDB() {
        const data = this.getItemValMap()
        await eachAsync(data, async (value, name) => {
            await this.db.set(name, value)
        })
        await eachAsync(this.db, async ([ name, value ]) => {
            if (!this.hasItem(name)) this.db.delete(name)
        })
    }
    async _syncFromDB() {
        each(this.db, ([ name, value ]) => this.setItemVal(name, value, undefined, { syncFromDB: true }))
        await this._syncToDB()
    }
    async init() {
        delete this.addItem
        await this._syncFromDB()
        return this.getItemValMap()
    }
    
    _getItem(name) {
        return this.items[name]
    }
    hasItem(name) {
        return !!this.items[name]
    }
    setItemVal(name, value, callback = () => {}, { syncFromDB } = {}) {
        const item = this._getItem(name)
        if (item) {
            const result = item.select(value)
            if (result) {
                if (!syncFromDB && item.reload) this.reload = true
                callback(item.selected, item.original, this.getItemValMap())
            }
        }
        return this
    }
    toggleItemVal(name, callback = () => {}) {
        const item = this._getItem(name)
        item.toggle()
        callback(item.selected, item.original, this.getItemValMap())
        return this
    }
    getItemVal(name) {
        const item = this._getItem(name)
        if (item) return item.selected
    }
    getItemValMap() {
        const result = {}
        each(this.items, (_, name) => result[name] = this.getItemVal(name))
        return result
    }
    async done(parentDialog) {
        const handleDone = async () => {
            await this._syncToDB()
            this.player.sendMessage("设置选项修改成功")
        }
        if (this.reload) {
            this.reload = false
            await Dialog.confirm({
                body: "你选择的项目更改后需要刷新脚本，请手动运行 /reload 命令。\n\n您可以取消您的更改",
                target: this.player,
                onConfirm: async () => {
                    await handleDone()
                    // await Commands.asyncRun("reload")
                },
                onCancel: async () => {
                    await this._syncFromDB()
                    await this.showDialog(parentDialog)
                }
            })
        } else await handleDone()
    }
    async showDialog(parentDialog) {
        const form = new ModalFormData().title(`${this.name} 选项`)
        const nameMap = []
        each(this.items, item => {
            const { name, description, values, selected } = item
            nameMap.push(name)
            if (values.size === 2 && values.get(true) && values.get(false)) {
                form.toggle(description, selected)
            } else {
                // TODO 暂时用不到，先不写了
                // form.dropdown(description, values)
            }
        })
        
        const dialog = new Dialog({
            dialog: form,
            onClose: async () => {
                if (parentDialog) await parentDialog.show(this.player)
            },
            onSubmit: async result => {
                each(result, (value, index) => {
                    const name = nameMap[index]
                    this.setItemVal(name, value)
                })
                await this.done(parentDialog)
            }
        })
        await dialog.show(this.player)
    }
}

class OptionItem {
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
