import { Container } from "./Container.class"

export class EntityContainer extends Container {
  constructor(entity, container) {
    super(container)

    this._entity = entity
  }

  get location() {
    return this._entity.location
  }
  get dimension() {
    return this._entity.dimension
  }

  addItem(itemStack) {
    const remain = this.tryAddItem(itemStack)

    if (remain) this.dimension.spawnItem(remain, this.location)
  }
}
