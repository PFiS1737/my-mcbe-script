export class Vector3Template {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x
    this.y = y
    this.z = z
  }

  static parse(vectorStr) {
    return new this(...vectorStr.split(" ").map(Number))
  }
  static create(vector) {
    if (Array.isArray(vector)) return new this(...vector)
    if (typeof vector === "string") return Vector3Template.parse(vector)
    if (typeof vector === "object")
      return new this(vector.x, vector.y, vector.z)

    throw new TypeError(
      'The argument "vector" must be an array, a vector string or a vector object.'
    )
  }

  stringify() {
    return this[Symbol.toPrimitive]("string")
  }
  toArray() {
    return [...this]
  }

  [Symbol.toPrimitive](hint) {
    if (hint === "string") return `${this.x} ${this.y} ${this.z}`
    return this
  }
  *[Symbol.iterator]() {
    yield this.x
    yield this.y
    yield this.z
  }
}
