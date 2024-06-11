import { Vector3Template } from "./Vector3Template.class.js"
import { Vector3Utils } from "./Vector3Utils.class.js"

export class Vector3 extends Vector3Template {
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
  get absolute() {
    return Vector3Utils.abs(this)
  }

  set(x, y, z) {
    this.x = x
    this.y = y
    this.z = z
    return this
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

  distance(v) {
    return Vector3Utils.distance(this, v)
  }
  squaredDistance(v) {
    return Vector3Utils.squaredDistance(this, v)
  }

  add(v) {
    this.x += v.x
    this.y += v.y
    this.z += v.z
    return this
  }
  subtract(v) {
    this.x -= v.x
    this.y -= v.y
    this.z -= v.z
    return this
  }
  multiply(v) {
    this.x *= v.x
    this.y *= v.y
    this.z *= v.z
    return this
  }
  divide(v) {
    this.x /= v.x
    this.y /= v.y
    this.z /= v.z
    return this
  }
  scale(n) {
    this.x *= n
    this.y *= n
    this.z *= n
    return this
  }
  negate(v) {
    this.x = -this.x
    this.y = -this.y
    this.z = -this.z
    return this
  }
  inverse(v) {
    this.x = 1 / this.x
    this.y = 1 / this.y
    this.z = 1 / this.z
    return this
  }

  floor() {
    this.copy(Vector3Utils.floor(this))
    return this
  }
  ceil() {
    this.copy(Vector3Utils.ceil(this))
    return this
  }
  round() {
    this.copy(Vector3Utils.round(this))
    return this
  }
  abs() {
    this.copy(Vector3Utils.abs(this))
    return this
  }

  normalize() {
    this.copy(Vector3Utils.normalize(this))
    return this
  }
}
