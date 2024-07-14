import type { Player } from "@minecraft/server"
import { ModalFormData } from "@minecraft/server-ui"

import { Database } from "../database/index"
import { Dialog } from "../dialog/index"
import { type IOptionItemRange, OptionItemRange } from "./OptionItemRange.class"
import {
  type IOptionItemSelection,
  OptionItemSelection,
} from "./OptionItemSelection.class"

export class PlayerOption {
  name: string
  db: Database<string | number | boolean>
  player: Player

  constructor(player: Player, name: string) {
    this.name = name
    this.db = Database.open(player, `option-manager:${name}`)
    this.player = player
  }

  items: Record<string, OptionItemSelection<any> | OptionItemRange> = {}
  reload = false

  addSelectionItem(opts: { _player: Player } & IOptionItemSelection<any>) {
    this.items[opts.name] = new OptionItemSelection(opts)
    return this
  }
  addRangeItem(opts: { _player: Player } & IOptionItemRange) {
    this.items[opts.name] = new OptionItemRange(opts)
    return this
  }
  async _syncToDB() {
    const data = this.getItemValMap()
    for (const [name, value] of data) await this.db.set(name, value)

    for (const [name] of this.db) {
      if (!this.hasItem(name)) await this.db.delete(name)
    }
  }
  async _syncFromDB() {
    for (const [name, value] of this.db)
      this.setItemVal(name, value, undefined, { syncFromDB: true })
    await this._syncToDB()
  }
  async init() {
    this.addSelectionItem = () => {
      throw new Error("Can't add item after initialization.")
    }
    this.addRangeItem = () => {
      throw new Error("Can't add item after initialization.")
    }

    await this._syncFromDB()

    return this.getItemValMap()
  }

  _getItem(name: string) {
    return this.items[name]
  }
  hasItem(name: string) {
    return !!this.items[name]
  }
  setItemVal<T>(
    name: string,
    value: T,
    callback: (
      selected: T,
      original: T,
      map: Map<string, any>
    ) => void = () => {},
    { syncFromDB = false } = {}
  ) {
    const item = this._getItem(name)
    if (item) {
      // @ts-ignore
      const result = item.select(value)
      if (result) {
        if (!syncFromDB && item.reload) this.reload = true
        callback(item.selected, item.original, this.getItemValMap())
      }
    }
    return this
  }
  getItemVal(name: string) {
    const item = this._getItem(name)
    if (item) return item.selected
  }
  getItemValMap() {
    // TODO: use map
    const result = new Map<string, any>()
    for (const [name] of Object.entries(this.items))
      result.set(name, this.getItemVal(name))
    return result
  }
  async done({ parentDialog }: { parentDialog?: Dialog<any> } = {}) {
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
          await this.showDialog({ parentDialog })
        },
      })
    } else await handleDone()
  }
  async showDialog({ parentDialog }: { parentDialog?: Dialog<any> } = {}) {
    const form = new ModalFormData().title(`${this.name} 选项`)
    const nameMap: Array<{
      name: string
      valuesMap:
        | Map<boolean, boolean>
        | Map<number, string | number | boolean>
        | Map<number, number>
    }> = []

    for (const [, item] of Object.entries(this.items)) {
      if (item instanceof OptionItemSelection) {
        const { name, description, values, selected } = item

        if (values.size === 2 && values.get(true) && values.get(false)) {
          const valuesMap = new Map()
          for (const [e] of values) valuesMap.set(e, e)
          nameMap.push({ name, valuesMap })

          form.toggle(description, selected)
        } else {
          const valueArray = [...values]

          const valuesMap = new Map()
          for (let i = 0; i < valueArray.length; i++) {
            const [e] = valueArray[i]
            valuesMap.set(i, e)
          }
          nameMap.push({ name, valuesMap })

          form.dropdown(
            description,
            valueArray.map((e) => e[1] ?? `${e[0]}`),
            valueArray.map((e) => e[0]).findIndex((e) => e === selected)
          )
        }
      } else if (item instanceof OptionItemRange) {
        const { name, description, range, selected } = item

        const valuesMap = new Map()
        for (const i of range) valuesMap.set(i, i)
        nameMap.push({ name, valuesMap })

        form.slider(description, range.min, range.max, range.step, selected)
      }
    }

    const dialog = new Dialog<void>({
      dialog: form,
      onClose: async () => {
        if (parentDialog) await parentDialog.show(this.player)
      },
      onSubmit: async (result) => {
        for (let nameIndex = 0; nameIndex < result.length; nameIndex++) {
          const valueIndex = result[nameIndex] as number

          const { name, valuesMap } = nameMap[nameIndex]
          const value = valuesMap.get(valueIndex)
          this.setItemVal(name, value)
        }
        await this.done({ parentDialog })
      },
    })
    await dialog.show(this.player)
  }
}
