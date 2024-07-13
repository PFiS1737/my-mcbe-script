import { serialize } from "../util"
import { Vector3Utils } from "./Vector3Utils.class"
import { VectorN } from "./VectorN.class"

export type Vector3Like =
  | string
  | number[]
  | { x: number; y: number; z: number }

/**
 * Class representing a 3-dimensional vector.
 * @extends VectorN
 */
export class Vector3 extends VectorN {
  /**
   * Create a 3D vector.
   * @param x - The x axis.
   * @param y - The y axis.
   * @param z - The z axis.
   */
  constructor(x = 0, y = 0, z = 0) {
    super(x, y, z)
  }

  /**
   * @param vector - The vector write in array.
   * @returns The vector.
   */
  static create(vector: Vector3Like): Vector3 {
    if (Array.isArray(vector)) return new this(...vector)
    // @ts-ignore
    if (typeof vector === "string") return this.parse(vector)
    if (typeof vector === "object")
      return new this(vector.x, vector.y, vector.z)

    throw new Error(`Can't create 3d vector for ${serialize(vector)}`)
  }

  get magnitude() {
    return Vector3Utils.magnitude(this)
  }
  get squaredMagnitude() {
    return Vector3Utils.squaredMagnitude(this)
  }

  get normalized() {
    return Vector3Utils.normalize(this)
  }
  get floored() {
    return Vector3Utils.floor(this)
  }
  get ceiled() {
    return Vector3Utils.ceil(this)
  }
  get rounded() {
    return Vector3Utils.round(this)
  }
  get absoluted() {
    return Vector3Utils.abs(this)
  }

  /**
   * Apply a function to each axes of the vector and return a new vector.
   * @param callbackfn - The function to apply.
   * @returns The new vector.
   */
  map(
    callbackfn: (vale: number, index: number, array: number[]) => number
  ): Vector3 {
    return Vector3.create(this.axes.map(callbackfn))
  }

  copy(v: Vector3 | VectorN) {
    this.x = v.x
    this.y = v.y
    this.z = v.z
    return this
  }
  clone() {
    return new Vector3(this.x, this.y, this.z)
  }
  equals(v: Vector3) {
    return Vector3Utils.equals(this, v)
  }

  distanceTo(v: Vector3) {
    return Vector3Utils.distance(this, v)
  }
  squaredDistanceTo(v: Vector3) {
    return Vector3Utils.squaredDistance(this, v)
  }

  add(v: Vector3) {
    return this.copy(Vector3Utils.add(this, v))
  }
  subtract(v: Vector3) {
    return this.copy(Vector3Utils.subtract(this, v))
  }
  multiply(v: Vector3) {
    return this.copy(Vector3Utils.multiply(this, v))
  }
  divide(v: Vector3) {
    return this.copy(Vector3Utils.divide(this, v))
  }
  scale(n: number) {
    return this.copy(Vector3Utils.scale(this, n))
  }
  negate() {
    return this.copy(Vector3Utils.negate(this))
  }
  inverse() {
    return this.copy(Vector3Utils.inverse(this))
  }

  floor() {
    return this.copy(this.floored)
  }
  ceil() {
    return this.copy(this.ceiled)
  }
  round() {
    return this.copy(this.rounded)
  }
  abs() {
    return this.copy(this.absoluted)
  }

  normalize() {
    return this.copy(this.normalized)
  }
}
