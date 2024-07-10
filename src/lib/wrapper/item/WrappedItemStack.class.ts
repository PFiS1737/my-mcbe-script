import { removeMinecraftNamespace } from "../../util/game"
import { each } from "../../util/index"

import { WrapperTemplate } from "../WrapperTemplate.class"

export class WrappedItemStack extends WrapperTemplate {
  constructor(itemStack) {
    super()

    this._item = itemStack

    this.type = itemStack.type
    this.typeId = itemStack.typeId

    const components = itemStack.getComponents()
    each(components, (component) => {
      this.components.set(removeMinecraftNamespace(component.typeId), component)
    })
  }

  components = new Map()

  hasComponent(componentId) {
    return this._item.hasComponent(componentId)
  }

  get enchants() {
    return this.components.get("enchantable")
  }
}
