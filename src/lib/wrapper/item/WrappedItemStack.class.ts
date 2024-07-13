import {
  type ItemComponentTypeMap,
  ItemComponentTypes,
  type ItemEnchantableComponent,
  type ItemStack,
} from "@minecraft/server"
import type { MinecraftItemTypes } from "@minecraft/vanilla-data"

import { removeMinecraftNamespace } from "../../util/game"
import { each } from "../../util/index"
import { WrapperTemplate } from "../WrapperTemplate.class"

export class WrappedItemStack extends WrapperTemplate {
  _item: ItemStack
  type: ItemStack["type"]
  typeId: MinecraftItemTypes

  constructor(itemStack: ItemStack) {
    super()

    this._item = itemStack

    this.type = itemStack.type
    this.typeId = itemStack.typeId as MinecraftItemTypes

    const components = itemStack.getComponents()
    each(components, (component) => {
      this.components.set(
        removeMinecraftNamespace(
          component.typeId
        ) as keyof ItemComponentTypeMap,
        component
      )
    })
  }

  components = new Map<
    keyof ItemComponentTypeMap,
    ItemComponentTypeMap[keyof ItemComponentTypeMap]
  >()

  hasComponent(componentId: string) {
    return this._item.hasComponent(componentId)
  }

  get enchants() {
    return this.components.get(
      ItemComponentTypes.Enchantable
    ) as ItemEnchantableComponent
  }
}
