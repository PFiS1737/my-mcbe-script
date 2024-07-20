import {
  type ItemComponentTypeMap,
  ItemComponentTypes,
  type ItemEnchantableComponent,
  type ItemStack,
} from "@minecraft/server"
import type { MinecraftItemTypes } from "@minecraft/vanilla-data"

import { removeMinecraftNamespace } from "../../util/game"
import type { Implementable } from "../../util/types"

export class WrappedItemStack implements Implementable<ItemStack> {
  _item: ItemStack
  type: ItemStack["type"]
  typeId: MinecraftItemTypes
  components = new Map<
    keyof ItemComponentTypeMap,
    ItemComponentTypeMap[keyof ItemComponentTypeMap]
  >()

  constructor(itemStack: ItemStack) {
    this._item = itemStack

    this.type = itemStack.type
    this.typeId = itemStack.typeId as MinecraftItemTypes

    const components = itemStack.getComponents()
    for (const component of components)
      this.components.set(
        removeMinecraftNamespace(
          component.typeId
        ) as keyof ItemComponentTypeMap,
        component as ItemComponentTypeMap[keyof ItemComponentTypeMap]
      )
  }

  hasComponent(componentId: string) {
    return this._item.hasComponent(componentId)
  }

  get enchants() {
    return this.components.get(
      ItemComponentTypes.Enchantable
    ) as ItemEnchantableComponent
  }
}
