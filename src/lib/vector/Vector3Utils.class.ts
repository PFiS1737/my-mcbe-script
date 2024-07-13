import { Vector3 } from "./Vector3.class"
import { VectorNUtils } from "./VectorNUtils.class"

/**
 * Utility class for operations on 3D vectors.
 */
export class Vector3Utils extends VectorNUtils {
  /**
   * @param vector - The vector write in array.
   * @returns The vector.
   */
  static create(
    vector: number[] | string | { x: number; y: number; z: number }
  ): Vector3 {
    return Vector3.create(vector)
  }

  /**
   * Calculate the cross product of two 3D vectors.
   * @param a - The first vector.
   * @param b - The second vector.
   * @returns The cross product of the vectors.
   */
  static cross(a: Vector3, b: Vector3): Vector3 {
    return this.create([
      a.y * b.z - a.z * b.y,
      a.z * b.x - a.x * b.z,
      a.x * b.y - a.y * b.x,
    ])
  }
}
