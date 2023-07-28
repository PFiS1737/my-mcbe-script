import { ItemStack } from "@minecraft/server"

import { each } from "../../util/index.js"
import { removeMinecraftNamespace } from "../../util/game.js"

import { WrapperTemplate } from "../WrapperTemplate.class.js"

export class WrappedItemStack extends WrapperTemplate {
    constructor(itemStack) {
        if (!(itemStack instanceof ItemStack))
            throw new TypeError("Parameter is not an instance of ItemStack.")
        
        super()
        
        this.stack = itemStack
        this.type = itemStack.type
        this.typeId = itemStack.typeId
        
        const components = itemStack.getComponents()
        each(components, component => {
            this.components.set(removeMinecraftNamespace(component.typeId), component)
        })
    }
    
    components = new Map()
    
    get enchants() {
        return this.components.get("enchantments").enchantments
    }
}
