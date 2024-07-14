import type { Player } from "@minecraft/server"
import { ActionFormData } from "@minecraft/server-ui"

import { Dialog } from "../dialog/index"
import { OptionNamespace } from "./OptionNamespace.class"

export class OptionManager {
  namespaces = new Map<string, OptionNamespace>()

  registerNamesapace({ id, name }: { id: string; name?: string }) {
    const namespaces = new OptionNamespace(id, name)
    this.namespaces.set(id, namespaces)
    return namespaces
  }
  getNamesapace(id: string) {
    const namespace = this.namespaces.get(id)

    if (!namespace) throw new Error("Can't get namespace.")

    return namespace
  }
  async showDialog(player: Player) {
    const form = new ActionFormData()
      .title("设置选项")
      .body("选择要设置的模块：")

    const nameMap: string[] = []
    for (const [, namespace] of this.namespaces) {
      nameMap.push(namespace.id)
      form.button(namespace.name)
    }

    const dialog = new Dialog({
      dialog: form,
      onSelect: async (selection) => {
        const id = nameMap[selection]
        await this.getNamesapace(id)
          .getPlayer(player)
          .showDialog({ parentDialog: dialog })
      },
    })
    await dialog.show(player)
  }
}
