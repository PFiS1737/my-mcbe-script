import { Dimension, world } from "@minecraft/server"

import { removeMinecraftNamespace } from "../util/game"
import type { Vector3Like } from "../vector/Vector3.class"
import { Location } from "./Location.class"

export class LocationInfo {
  location: Location
  dimension: Dimension

  constructor({
    location,
    dimension,
  }: {
    location: Location | Vector3Like
    dimension: string | Dimension
  }) {
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

  [Symbol.toPrimitive](hint: string) {
    if (hint === "string")
      return `${removeMinecraftNamespace(this.dimension.id)}: ${this.location}`
    return this
  }
}
