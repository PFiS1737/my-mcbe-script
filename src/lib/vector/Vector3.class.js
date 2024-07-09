import { Vector3Utils } from "./Vector3Utils.class.js"
import { VectorN } from "./VectorN.class.js"

/**
 * Class representing a 3-dimensional vector.
 * @extends VectorN
 */
export class Vector3 extends VectorN {
  /**
   * Create a 3D vector.
   * @param {number} x - The x axis.
   * @param {number} y - The y axis.
   * @param {number} z - The z axis.
   */
  constructor(x = 0, y = 0, z = 0) {
    super(x, y, z)
  }

  get x() {
    return this.get(0)
  }
  set x(value) {
    this.set(0, value)
  }
  get y() {
    return this.get(1)
  }
  set y(value) {
    this.set(1, value)
  }
  get z() {
    return this.get(2)
  }
  set z(value) {
    this.set(2, value)
  }

  /**
   * @param {Array<number>|string|{x:number,y:number,z:number}} vector - The vector write in array.
   * @returns {Vector3} The vector.
   */
  static create(vector) {
    if (Array.isArray(vector)) return new this(...vector)
    // @ts-ignore
    if (typeof vector === "string") return this.parse(vector)
    if (typeof vector === "object")
      return new this(vector.x, vector.y, vector.z)
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
   * @param {function(number, number): number} callbackfn - The function to apply.
   * @returns {Vector3} The new vector.
   */
  map(callbackfn) {
    return Vector3.create(this.axes.map(callbackfn))
  }

  copy(v) {
    this.x = v.x
    this.y = v.y
    this.z = v.z
    return this
  }
  clone() {
    return new Vector3(this.x, this.y, this.z)
  }
  equals(v) {
    return Vector3Utils.equals(this, v)
  }

  distanceTo(v) {
    return Vector3Utils.distance(this, v)
  }
  squaredDistanceTo(v) {
    return Vector3Utils.squaredDistance(this, v)
  }

  add(v) {
    return this.copy(Vector3Utils.add(this, v))
  }
  subtract(v) {
    return this.copy(Vector3Utils.subtract(this, v))
  }
  multiply(v) {
    return this.copy(Vector3Utils.multiply(this, v))
  }
  divide(v) {
    return this.copy(Vector3Utils.divide(this, v))
  }
  scale(n) {
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
