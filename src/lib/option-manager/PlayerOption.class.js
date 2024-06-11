import { ModalFormData } from "@minecraft/server-ui"

import { each, eachAsync } from "../util/index.js"

import { Database } from "../database/index.js"
import { Dialog } from "../dialog/index.js"

import { OptionItemRange } from "./OptionItemRange.class.js"
import { OptionItemSelection } from "./OptionItemSelection.class.js"

export class PlayerOption {
  constructor(player, name) {
    this.name = name
    this.db = Database.open(player, `option-manager:${name}`)
    this.player = player
  }

  items = {}

  addItem(opts) {
    if (opts.range) this.items[opts.name] = new OptionItemRange(opts)
    else if (opts.values) this.items[opts.name] = new OptionItemSelection(opts)
    return this
  }
  async _syncToDB() {
    const data = this.getItemValMap()
    await eachAsync(data, async (value, name) => {
      await this.db.set(name, value)
    })
    await eachAsync(this.db, async ([name, _]) => {
      if (!this.hasItem(name)) await this.db.delete(name)
    })
  }
  async _syncFromDB() {
    each(this.db, ([name, value]) =>
      this.setItemVal(name, value, undefined, { syncFromDB: true })
    )
    await this._syncToDB()
  }
  async init() {
    this.addItem = undefined
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
  getItemVal(name) {
    const item = this._getItem(name)
    if (item) return item.selected
  }
  getItemValMap() {
    const result = {}
    each(this.items, (_, name) => {
      result[name] = this.getItemVal(name)
    })
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
        },
      })
    } else await handleDone()
  }
  async showDialog(parentDialog) {
    const form = new ModalFormData().title(`${this.name} 选项`)
    const nameMap = []

    each(this.items, (item) => {
      if (item instanceof OptionItemSelection) {
        const { name, description, values, selected } = item

        if (values.size === 2 && values.get(true) && values.get(false)) {
          const valuesMap = new Map()
          each(values, ([e]) => valuesMap.set(e, e))
          nameMap.push({ name, valuesMap })

          form.toggle(description, selected)
        } else {
          const valueArray = [...values]

          const valuesMap = new Map()
          each(valueArray, ([e], i) => valuesMap.set(i, e))
          nameMap.push({ name, valuesMap })

          form.dropdown(
            description,
            valueArray.map((e) => e[1]),
            valueArray.map((e) => e[0]).findIndex((e) => e === selected)
          )
        }
      } else if (item instanceof OptionItemRange) {
        const { name, description, range, selected } = item

        const valuesMap = new Map()
        each(range, (i) => valuesMap.set(i, i))
        nameMap.push({ name, valuesMap })

        form.slider(description, range.min, range.max, range.step, selected)
      }
    })

    const dialog = new Dialog({
      dialog: form,
      onClose: async () => {
        if (parentDialog) await parentDialog.show(this.player)
      },
      onSubmit: async (result) => {
        each(result, (valueIndex, nameIndex) => {
          const { name, valuesMap } = nameMap[nameIndex]
          const value = valuesMap.get(valueIndex)
          this.setItemVal(name, value)
        })
        await this.done(parentDialog)
      },
    })
    await dialog.show(this.player)
  }
}
