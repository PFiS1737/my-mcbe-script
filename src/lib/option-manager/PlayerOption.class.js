import { ModalFormData } from "@minecraft/server-ui"

import { each, eachAsync } from "../util/index.js"

import { Database } from "../database/index.js"
import { Dialog } from "../dialog/index.js"

import { OptionItem } from "./OptionItem.class.js"

export class PlayerOption {
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
        const handleDone = async ({ reply = true } = {}) => {
            await this._syncToDB()
            if (reply) this.player.sendMessage("设置选项修改成功")
        }
        if (this.reload) {
            this.reload = false
            await Dialog.confirm({
                body: '你选择的项目更改后需要刷新脚本，请手动运行 "/reload" 命令。\n\n您也可以取消您的更改',
                target: this.player,
                onConfirm: async () => {
                    await handleDone({ reply: false })
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
            const valuesMap = [...values].map(e => e[0])
            nameMap.push({ name, valuesMap })
            if (values.size === 2 && values.get(true) && values.get(false)) {
                form.toggle(description, selected)
            } else {
                form.dropdown(description, valuesMap.map(e => `${e}`), valuesMap.findIndex(e => e === selected))
            }
            // TODO 滑块等其他方式
        })
        
        const dialog = new Dialog({
            dialog: form,
            onClose: async () => {
                if (parentDialog) await parentDialog.show(this.player)
            },
            onSubmit: async result => {
                each(result, (valueIndex, nameIndex) => {
                    const { name, valuesMap } = nameMap[nameIndex]
                    const value = typeof valueIndex === "boolean"
                        ? valueIndex
                        : valuesMap[valueIndex]
                    this.setItemVal(name, value)
                })
                await this.done(parentDialog)
            }
        })
        await dialog.show(this.player)
    }
}
