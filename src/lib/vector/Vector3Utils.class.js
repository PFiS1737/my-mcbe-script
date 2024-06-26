import { binomial, equals, round, sum } from "../util/math.js"

import { Vector3 } from "./Vector3.class.js"

export class Vector3Utils {
  static clone(a) {
    return Vector3.create(a)
  }

  static add(a, b) {
    return new Vector3(a.x + b.x, a.y + b.y, a.z + b.z)
  }
  static subtract(a, b) {
    return new Vector3(a.x - b.x, a.y - b.y, a.z - b.z)
  }
  static multiply(a, b) {
    return new Vector3(a.x * b.x, a.y * b.y, a.z * b.z)
  }
  static divide(a, b) {
    return new Vector3(a.x / b.x, a.y / b.y, a.z / b.z)
  }
  static scale(a, n) {
    return new Vector3(a.x * n, a.y * n, a.z * n)
  }
  static negate(a) {
    return new Vector3(-a.x, -a.y, -a.z)
  }
  static inverse(a) {
    return new Vector3(1 / a.x, 1 / a.y, 1 / a.z)
  }

  static exchange(a, axes = []) {
    if (axes.length !== 2) throw new Error("You could only exchange two axes.")
    const output = Vector3Utils.clone(a)
    const n0 = output[axes[0]]
    const n1 = output[axes[1]]
    output[axes[0]] = n1
    output[axes[1]] = n0
    return output
  }

  static exactEquals(a, b) {
    return a.x === b.x && a.y === b.y && a.z === b.z
  }
  static equals(a, b) {
    return equals(a.x, b.x) && equals(a.y, b.y) && equals(a.z, b.z)
  }

  static max(...vectors) {
    return new Vector3(
      Math.max(...vectors.map(({ x }) => x)),
      Math.max(...vectors.map(({ y }) => y)),
      Math.max(...vectors.map(({ z }) => z))
    )
  }
  static min(...vectors) {
    return new Vector3(
      Math.min(...vectors.map(({ x }) => x)),
      Math.min(...vectors.map(({ y }) => y)),
      Math.min(...vectors.map(({ z }) => z))
    )
  }
  static floor(a) {
    return new Vector3(Math.floor(a.x), Math.floor(a.y), Math.floor(a.z))
  }
  static ceil(a) {
    return new Vector3(Math.ceil(a.x), Math.ceil(a.y), Math.ceil(a.z))
  }
  static round(a) {
    return new Vector3(round(a.x), round(a.y), round(a.z))
  }
  static abs(a) {
    return new Vector3(Math.abs(a.x), Math.abs(a.y), Math.abs(a.z))
  }

  static maxMagnitude(...vectors) {
    return vectors.reduce((prev, curr) =>
      Vector3Utils.magnitude(curr) > Vector3Utils.magnitude(prev) ? curr : prev
    )
  }
  static minMagnitude(...vectors) {
    return vectors.reduce((prev, curr) =>
      Vector3Utils.magnitude(curr) < Vector3Utils.magnitude(prev) ? curr : prev
    )
  }

  static magnitude(a) {
    return Math.sqrt(Vector3Utils.squaredMagnitude(a))
  }
  static squaredMagnitude(a) {
    return a.x ** 2 + a.y ** 2 + a.z ** 2
  }
  static distance(a, b) {
    return Math.sqrt(Vector3Utils.squaredDistance(a, b))
  }
  static squaredDistance(a, b) {
    const dx = b.x - a.x
    const dy = b.y - a.y
    const dz = b.x - a.z
    return dx ** 2 + dy ** 2 + dz ** 2
  }

  static dot(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z
  }
  static cross(a, b) {
    return new Vector3(
      a.y * b.z - a.z * b.y,
      a.z * b.x - a.x * b.z,
      a.x * b.y - a.y * b.x
    )
  }
  static normalize(a) {
    const magnitude = Vector3Utils.magnitude(a)
    if (magnitude) return Vector3Utils.scale(a, 1 / magnitude)
    return new Vector3(0, 0, 0)
  }
  static angle(a, b) {
    const cosOmega = Vector3Utils.dot(
      Vector3Utils.normalize(a),
      Vector3Utils.normalize(b)
    )
    return Math.acos(cosOmega)
  }
  static random(scale = 1) {
    const r = Math.random() * 2 * Math.PI
    const z = Math.random() * 2 - 1
    const zScale = Math.sqrt(1 - z * z) * scale
    return new Vector3(Math.cos(r) * zScale, Math.sin(r) * zScale, z * scale)
  }
  static lerp(a, b, t) {
    return new Vector3(
      a.x * (1 - t) + b.x * t,
      a.y * (1 - t) + b.y * t,
      a.z * (1 - t) + b.z * t
    )
  }
  static slerp(a, b, t) {
    if (t <= 0) return Vector3Utils.clone(a)
    if (t >= 1) return Vector3Utils.clone(b)

    const omega = Vector3Utils.angle(a, b)
    const sinOmega = Math.sin(omega)

    if (sinOmega <= Number.EPSILON) return Vector3Utils.lerp(a, b, t)

    const ratioA = Math.sin(omega * (1 - t)) / sinOmega
    const ratioB = Math.sin(omega * t) / sinOmega
    return new Vector3(
      a.x * ratioA + b.x * ratioB,
      a.y * ratioA + b.y * ratioB,
      a.z * ratioA + b.z * ratioB
    )
  }
  static bezier(points, t) {
    const n = points.length - 1
    const coefficient = binomial(1 - t, t, n)
    return new Vector3(
      sum(0, n, (k) => points[k].x * coefficient(k)),
      sum(0, n, (k) => points[k].y * coefficient(k)),
      sum(0, n, (k) => points[k].z * coefficient(k))
    )
  }
  // TODO: Hermite interpolation
}
