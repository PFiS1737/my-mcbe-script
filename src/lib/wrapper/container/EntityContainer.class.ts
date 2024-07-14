import type { Container, Entity, ItemStack } from "@minecraft/server"

import { WrappedContainer } from "./WrappedContainer.class"

export class EntityContainer extends WrappedContainer {
  _entity: Entity

  constructor(entity: Entity, container: Container) {
    super(container)

    this._entity = entity
  }

  get location() {
    return this._entity.location
  }
  get dimension() {
    return this._entity.dimension
  }

  addItem(itemStack: ItemStack) {
    const remain = this.tryAddItem(itemStack)

    if (remain) this.dimension.spawnItem(remain, this.location)
  }
}
