import { Vector3, Vector3Utils } from "../vector/index"

export class Location extends Vector3 {
  get centerCorrected() {
    return Location.create(
      // @ts-ignore
      Vector3Utils.add(this.floored, new Vector3(0.5, 0.5, 0.5))
    )
  }

  clone() {
    return new Location(this.x, this.y, this.z)
  }
  equals(v) {
    return Vector3Utils.exactEquals(this, v)
  }
  isNearTo(v, distance) {
    return this.distanceTo(v) <= distance
  }

  offset(v) {
    return this.add(v)
  }
}
