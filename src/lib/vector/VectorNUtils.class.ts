import { equals, round } from "../util/math"
import { VectorN } from "./VectorN.class"

/**
 * Utility class for operations on N-dimensional vectors.
 */
export class VectorNUtils {
  /**
   * Create a vector.
   * @param vector - The vector write in array.
   * @returns The vector.
   */
  static create(vector: Array<number>) {
    return VectorN.create(vector)
  }

  /**
   * Clone a vector.
   * @param a - The vector to clone.
   * @returns The cloned vector.
   */
  static clone(a: VectorN) {
    return this.create(a.toArray())
  }

  /**
   * Assert that two vectors have the same dimensions.
   * @param a - The first vector.
   * @param b - The second vector.
   * @throws Will throw an error if the vectors do not have the same dimensions.
   */
  static _assertDimensions(a: VectorN, b: VectorN) {
    if (a.dimensions !== b.dimensions)
      throw new Error("Vectors must have the same dimensions.")
  }

  /**
   * Add two vectors.
   * @param a - The first vector.
   * @param b - The second vector.
   * @returns The resulting vector.
   */
  static add(a: VectorN, b: VectorN) {
    VectorNUtils._assertDimensions(a, b)
    return a.map((val, index) => val + b.get(index))
  }

  /**
   * Subtract one vector from another.
   * @param a - The first vector.
   * @param b - The second vector.
   * @returns The resulting vector.
   */
  static subtract(a: VectorN, b: VectorN) {
    VectorNUtils._assertDimensions(a, b)
    return a.map((val, index) => val - b.get(index))
  }

  /**
   * Multiply two vectors component-wise.
   * @param a - The first vector.
   * @param b - The second vector.
   * @returns The resulting vector.
   */
  static multiply(a: VectorN, b: VectorN) {
    VectorNUtils._assertDimensions(a, b)
    return a.map((val, index) => val * b.get(index))
  }

  /**
   * Divide one vector by another component-wise.
   * @param a - The first vector.
   * @param b - The second vector.
   * @returns The resulting vector.
   */
  static divide(a: VectorN, b: VectorN) {
    VectorNUtils._assertDimensions(a, b)
    return a.map((val, index) => val / b.get(index))
  }

  /**
   * Scale a vector by a scalar.
   * @param a - The vector to scale.
   * @param n - The scalar value.
   * @returns The resulting vector.
   */
  static scale(a: VectorN, n: number) {
    return a.map((val) => val * n)
  }

  /**
   * Negate a vector.
   * @param a - The vector to negate.
   * @returns The resulting vector.
   */
  static negate(a: VectorN) {
    return a.map((val) => -val)
  }

  /**
   * Invert a vector component-wise.
   * @param a - The vector to invert.
   * @returns The resulting vector.
   */
  static inverse(a: VectorN) {
    return a.map((val) => 1 / val)
  }

  /**
   * Exchange two axes of a vector.
   * @param a - The vector to modify.
   * @param axis1 - The first axis to exchange.
   * @param axis2 - The second axis to exchange
   * @returns The resulting vector.
   * @throws Will throw an error if the length of the axes array is not 2.
   */
  static exchange(a: VectorN, axis1: number, axis2: number) {
    const output = this.clone(a)
    const n0 = output.get(axis1)
    const n1 = output.get(axis2)
    output.set(axis1, n1)
    output.set(axis2, n0)
    return output
  }

  /**
   * Check if two vectors are exactly equal.
   * @param a - The first vector.
   * @param b - The second vector.
   * @returns True if the vectors are exactly equal, otherwise false.
   */
  static exactEquals(a: VectorN, b: VectorN) {
    VectorNUtils._assertDimensions(a, b)
    return a.axes.every((val, index) => val === b.get(index))
  }

  /**
   * Check if two vectors are approximately equal.
   * @param a - The first vector.
   * @param b - The second vector.
   * @returns True if the vectors are approximately equal, otherwise false.
   */
  static equals(a: VectorN, b: VectorN) {
    VectorNUtils._assertDimensions(a, b)
    return a.axes.every((val, index) => equals(val, b.get(index)))
  }

  /**
   * Get the component-wise maximum of multiple vectors.
   * @param vectors - The vectors to compare.
   * @returns The resulting vector.
   */
  static max(...vectors: VectorN[]) {
    const length = vectors[0].dimensions

    const maxAxes = vectors.reduce((acc, vector) => {
      vector.axes.forEach((val, index) => {
        if (val > acc[index]) acc[index] = val
      })
      return acc
    }, new Array(length).fill(Number.NEGATIVE_INFINITY))

    return this.create(maxAxes)
  }

  /**
   * Get the component-wise minimum of multiple vectors.
   * @param vectors - The vectors to compare.
   * @returns The resulting vector.
   */
  static min(...vectors: VectorN[]) {
    const length = vectors[0].dimensions

    const minAxes = vectors.reduce((acc, vector) => {
      vector.axes.forEach((val, index) => {
        if (val < acc[index]) acc[index] = val
      })
      return acc
    }, new Array(length).fill(Number.POSITIVE_INFINITY))

    return this.create(minAxes)
  }

  /**
   * Apply the floor function to each component of a vector.
   * @param a - The vector to modify.
   * @returns The resulting vector.
   */
  static floor(a: VectorN) {
    return a.map((val) => Math.floor(val))
  }

  /**
   * Apply the ceil function to each component of a vector.
   * @param a - The vector to modify.
   * @returns The resulting vector.
   */
  static ceil(a: VectorN) {
    return a.map((val) => Math.ceil(val))
  }

  /**
   * Apply the round function to each component of a vector.
   * @param a - The vector to modify.
   * @returns The resulting vector.
   */
  static round(a: VectorN) {
    return a.map((val) => round(val))
  }

  /**
   * Apply the absolute value function to each component of a vector.
   * @param a - The vector to modify.
   * @returns The resulting vector.
   */
  static abs(a: VectorN) {
    return a.map((val) => Math.abs(val))
  }

  /**
   * Get the vector with the maximum magnitude from a list of vectors.
   * @param vectors - The vectors to compare.
   * @returns The vector with the maximum magnitude.
   */
  static maxMagnitude(...vectors: VectorN[]) {
    return vectors.reduce((prev, curr) =>
      VectorNUtils.magnitude(curr) > VectorNUtils.magnitude(prev) ? curr : prev
    )
  }

  /**
   * Get the vector with the minimum magnitude from a list of vectors.
   * @param vectors - The vectors to compare.
   * @returns The vector with the minimum magnitude.
   */
  static minMagnitude(...vectors: VectorN[]) {
    return vectors.reduce((prev, curr) =>
      VectorNUtils.magnitude(curr) < VectorNUtils.magnitude(prev) ? curr : prev
    )
  }

  /**
   * Calculate the magnitude of a vector.
   * @param a - The vector to calculate the magnitude of.
   * @returns The magnitude of the vector.
   */
  static magnitude(a: VectorN) {
    return Math.sqrt(VectorNUtils.squaredMagnitude(a))
  }

  /**
   * Calculate the squared magnitude of a vector.
   * @param a - The vector to calculate the squared magnitude of.
   * @returns The squared magnitude of the vector.
   */
  static squaredMagnitude(a: VectorN) {
    return a.axes.reduce((sum, val) => sum + val ** 2, 0)
  }

  /**
   * Calculate the distance between two vectors.
   * @param a - The first vector.
   * @param b - The second vector.
   * @returns The distance between the vectors.
   */
  static distance(a: VectorN, b: VectorN) {
    return Math.sqrt(VectorNUtils.squaredDistance(a, b))
  }

  /**
   * Calculate the squared distance between two vectors.
   * @param a - The first vector.
   * @param b - The second vector.
   * @returns The squared distance between the vectors.
   */
  static squaredDistance(a: VectorN, b: VectorN) {
    VectorNUtils._assertDimensions(a, b)
    return a.axes.reduce((sum, val, index) => {
      const diff = val - b.get(index)
      return sum + diff ** 2
    }, 0)
  }

  /**
   * Calculate the dot product of two vectors.
   * @param a - The first vector.
   * @param b - The second vector.
   * @returns The dot product of the vectors.
   */
  static dot(a: VectorN, b: VectorN) {
    VectorNUtils._assertDimensions(a, b)
    return a.axes.reduce((sum, val, index) => sum + val * b.get(index), 0)
  }

  /**
   * Normalize a vector.
   * @param a - The vector to normalize.
   * @returns The normalized vector.
   */
  static normalize(a: VectorN) {
    const magnitude = this.magnitude(a)
    if (magnitude) return this.scale(a, 1 / magnitude)
    return this.create(new Array(a.dimensions).fill(0))
  }

  /**
   * Calculate the angle between two vectors.
   * @param a - The first vector.
   * @param b - The second vector.
   * @returns The angle between the vectors in radians.
   */
  static angle(a: VectorN, b: VectorN) {
    const cosOmega = this.dot(this.normalize(a), this.normalize(b))
    return Math.acos(cosOmega)
  }

  /**
   * Generate a random vector.
   * @param dimensions - The number of dimensions.
   * @param scale - The scale of the random components.
   * @returns The random vector.
   */
  static random(dimensions: number, scale = 1) {
    const axes = Array.from({ length: dimensions }, () => Math.random() * 2 - 1)
    return this.scale(this.create(axes), scale)
  }

  /**
   * Perform linear interpolation between two vectors.
   * @param a - The first vector.
   * @param b - The second vector.
   * @param t - The interpolation parameter.
   * @returns The interpolated vector.
   */
  static lerp(a: VectorN, b: VectorN, t: number) {
    VectorNUtils._assertDimensions(a, b)
    return a.map((val, index) => val * (1 - t) + b.get(index) * t)
  }

  /**
   * Perform spherical linear interpolation between two vectors.
   * @param a - The first vector.
   * @param b - The second vector.
   * @param t - The interpolation parameter.
   * @returns The interpolated vector.
   */
  static slerp(a: VectorN, b: VectorN, t: number) {
    if (t <= 0) return this.clone(a)
    if (t >= 1) return this.clone(b)

    const omega = this.angle(a, b)
    const sinOmega = Math.sin(omega)

    if (sinOmega <= Number.EPSILON) return this.lerp(a, b, t)

    const ratioA = Math.sin(omega * (1 - t)) / sinOmega
    const ratioB = Math.sin(omega * t) / sinOmega
    return a.map((val, index) => val * ratioA + b.get(index) * ratioB)
  }

  /**
   * Perform Bezier interpolation between vectors.
   * @param points - The control points.
   * @param t - The interpolation parameter.
   * @returns The interpolated vector.
   */
  static bezier(points: VectorN[], t: number): VectorN {
    const n = points.length - 1

    if (!n) return points[0]

    const newPoints = []
    for (let i = 0; i < n; i++) {
      newPoints.push(this.lerp(points[i], points[i + 1], t))
    }

    return this.bezier(newPoints, t)
  }
}
