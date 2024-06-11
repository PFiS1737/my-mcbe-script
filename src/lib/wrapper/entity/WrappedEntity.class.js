import { Directions, Location } from "../../location/index.js"
import { removeMinecraftNamespace } from "../../util/game.js"
import { each } from "../../util/index.js"

import { WrapperTemplate } from "../WrapperTemplate.class.js"

export class WrappedEntity extends WrapperTemplate {
  components = new Map()

  constructor(entity) {
    super()

    this._entity = entity

    this.id = entity.id
    this.typeId = entity.typeId

    this.scoreboardIdentity = entity.scoreboardIdentity

    const components = entity.getComponents()
    each(components, (component) => {
      this.components.set(removeMinecraftNamespace(component.typeId), component)
    })
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
  }
}
