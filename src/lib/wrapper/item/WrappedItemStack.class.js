import { each } from "../../util/index.js"
import { removeMinecraftNamespace } from "../../util/game.js"

import { WrapperTemplate } from "../WrapperTemplate.class.js"

export class WrappedItemStack extends WrapperTemplate {
    constructor(itemStack) {
        super()
        
        this._item = itemStack
        
        this.type = itemStack.type
        this.typeId = itemStack.typeId
        
        const components = itemStack.getComponents()
        each(components, component => {
            this.components.set(removeMinecraftNamespace(component.typeId), component)
        })
    }
    
    components = new Map()
    
    hasComponent(componentId) {
        return this._item.hasComponent(componentId)
    }
    
    get enchants() {
        return this.components.get("enchantments").enchantments
    }
}
