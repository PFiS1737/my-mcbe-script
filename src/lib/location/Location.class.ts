import type { Vector3Like } from "../vector/Vector3.class"
import { Vector3, Vector3Utils } from "../vector/index"
import type { BlockLocation } from "./BlockLocation.class"

export class Location extends Vector3 {
  get centerCorrected() {
    return Location.create(
      Vector3Utils.add(this.floored, new Vector3(0.5, 0.5, 0.5))
    )
  }

  static create(vector: Vector3Like) {
    return Vector3.create(vector) as Location
  }
  static parse(vectorStr: string) {
    return Vector3.parse(vectorStr) as Location
  }

  clone() {
    return new Location(this.x, this.y, this.z)
  }
  equals(v: Location) {
    return Vector3Utils.exactEquals(this, v)
  }
  isNearTo(v: Location | BlockLocation, distance: number) {
    return this.distanceTo(v) <= distance
  }

  offset(v: Location | BlockLocation) {
    return this.add(v)
  }
}
