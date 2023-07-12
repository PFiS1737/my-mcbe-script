import { ActionFormData } from "@minecraft/server-ui"

import { each } from "../util/index.js"

import { Dialog } from "../dialog/index.js"

import { OptionNamespace } from "./OptionNamespace.class.js"

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
