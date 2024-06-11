import { Vector3Utils } from "../vector/index.js"

import { Location } from "./Location.class.js"

export class LocationUtils {
  static getDirectionOffset(direction) {
    return Location.create({
      x: direction.isEast() ? +1 : direction.isWest() ? -1 : 0,
      y: direction.isUp() ? +1 : direction.isDown() ? -1 : 0,
      z: direction.isSouth() ? +1 : direction.isNorth() ? -1 : 0,
    })
  }

  static between(a, b, s = 1) {
    const output = []
    for (let x = a.x; x <= b.x; x += s) {
      for (let y = a.y; y <= b.y; y += s) {
        for (let z = a.z; z <= b.z; z += s) {
          output.push(new Location(x, y, z))
        }
      }
    }
    return output
  }
}
