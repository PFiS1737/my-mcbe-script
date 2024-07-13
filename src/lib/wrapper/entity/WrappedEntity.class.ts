import type { Entity } from "@minecraft/server"
import type { MinecraftEntityTypes } from "@minecraft/vanilla-data"

import { Directions, Location } from "../../location/index"
import { removeMinecraftNamespace } from "../../util/game"

import { WrapperTemplate } from "../WrapperTemplate.class"

export class WrappedEntity extends WrapperTemplate {
  _entity: Entity
  id: Entity["id"]
  typeId: MinecraftEntityTypes
  scoreboardIdentity: Entity["scoreboardIdentity"]
  components = new Map()

  constructor(entity: Entity) {
    super()

    this._entity = entity

    this.id = entity.id
    this.typeId = entity.typeId as MinecraftEntityTypes

    this.scoreboardIdentity = entity.scoreboardIdentity

    const components = entity.getComponents()
    for (const component of components)
      this.components.set(removeMinecraftNamespace(component.typeId), component)
  }

  get nameTag() {
    return this._entity.nameTag
  }
  get location() {
    return Location.create(this._entity.location)
  }
  get dimension() {
    return this._entity.dimension
  }

  get isSneaking() {
    return this._entity.isSneaking
  }

  getRotation() {
    return this._entity.getRotation()
  }

  getFacingDirectionXZ() {
    const rotation = this.getRotation().y

    if (rotation > -135 && rotation <= -45) return Directions.East
    if (rotation > -45 && rotation <= 45) return Directions.South
    if (rotation > 45 && rotation <= 135) return Directions.West
    if (rotation > 135 || rotation <= -135) return Directions.North

    throw new Error("Unexpected error.")
  }
}
