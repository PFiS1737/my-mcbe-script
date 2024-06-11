import { Dimension, world } from "@minecraft/server"

import { removeMinecraftNamespace } from "../util/game.js"
import { Location } from "./Location.class.js"

export class LocationInfo {
  constructor({ location, dimension }) {
    this.location =
      location instanceof Location ? location : Location.create(location)
    this.dimension =
      dimension instanceof Dimension ? dimension : world.getDimension(dimension)
  }
  textify() {
    return {
      location: `${this.location}`,
      dimension: this.dimension.id,
    }
  }

  [Symbol.toPrimitive](hint) {
    if (hint === "string")
      return `${removeMinecraftNamespace(this.dimension.id)}: ${this.location}`
    return this
  }
}
