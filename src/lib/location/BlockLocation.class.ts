import { Vector3Utils } from "../vector"
import { Vector3, type Vector3Like } from "../vector/Vector3.class"

export class BlockLocation extends Vector3 {
  constructor(x: number, y: number, z: number) {
    super(x, y, z)

    this.floor()
  }

  static create(vector: Vector3Like) {
    return Vector3.create(vector) as BlockLocation
  }

  clone() {
    return new BlockLocation(this.x, this.y, this.z)
  }
  equals(v: BlockLocation) {
    return Vector3Utils.exactEquals(this, v)
  }
  isNearTo(v: BlockLocation, distance: number) {
    return this.distanceTo(v) <= distance
  }

  offset(v: BlockLocation) {
    return this.add(v)
  }

  divide(v: BlockLocation) {
    super.divide(v)
    return this.floor()
  }
}
