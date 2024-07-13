import { BlockLocation } from "./BlockLocation.class"
import type { Direction } from "./Directions.class"
import { Location } from "./Location.class"

export class LocationUtils {
  static getDirectionOffset(direction: Direction) {
    return BlockLocation.create({
      x: direction.isEast() ? +1 : direction.isWest() ? -1 : 0,
      y: direction.isUp() ? +1 : direction.isDown() ? -1 : 0,
      z: direction.isSouth() ? +1 : direction.isNorth() ? -1 : 0,
    })
  }

  static between(from: Location, to: Location, step = 1) {
    const output = []
    for (let x = from.x; x <= to.x; x += step) {
      for (let y = from.y; y <= to.y; y += step) {
        for (let z = from.z; z <= to.z; z += step) {
          output.push(new Location(x, y, z))
        }
      }
    }
    return output
  }
}
