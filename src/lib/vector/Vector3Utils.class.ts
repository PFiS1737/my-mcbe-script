import { Vector3 } from "./Vector3.class"
import { VectorNUtils } from "./VectorNUtils.class"

/**
 * Utility class for operations on 3D vectors.
 */
export class Vector3Utils extends VectorNUtils {
  /**
   * @param {Array<number>|string|{x:number,y:number,z:number}} vector - The vector write in array.
   * @returns {Vector3} The vector.
   */
  static create(vector) {
    return Vector3.create(vector)
  }

  /**
   * Calculate the cross product of two 3D vectors.
   * @param {Vector3} a - The first vector.
   * @param {Vector3} b - The second vector.
   * @returns {Vector3} The cross product of the vectors.
   */
  static cross(a, b) {
    return this.create([
      a.y * b.z - a.z * b.y,
      a.z * b.x - a.x * b.z,
      a.x * b.y - a.y * b.x,
    ])
  }
}
