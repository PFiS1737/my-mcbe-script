import type { Player } from "@minecraft/server"
import { ActionFormData } from "@minecraft/server-ui"
import { Dialog } from "../dialog/index"
import { each } from "../util/index"
import { OptionNamespace } from "./OptionNamespace.class"

export class OptionManager {
  namespaces = new Map<string, OptionNamespace>()

  registerNamesapace(name: string) {
    const namespaces = new OptionNamespace(name)
    this.namespaces.set(name, namespaces)
    return namespaces
  }
  getNamesapace(name: string) {
    const namespace = this.namespaces.get(name)

    if (!namespace) throw new Error("Can't get namespace.")

    return namespace
  }
  async showDialog(player: Player) {
    const form = new ActionFormData()
      .title("设置选项")
      .body("选择要设置的模块：")
    const nameMap: string[] = []
    each(this.namespaces, ([name]) => {
      nameMap.push(name)
      form.button(name) // TODO: name -> desc
    })

    const dialog = new Dialog({
      dialog: form,
      onSelect: async (selection) => {
        const name = nameMap[selection]
        await this.getNamesapace(name).getPlayer(player).showDialog(dialog)
      },
    })
    await dialog.show(player)
  }
}
