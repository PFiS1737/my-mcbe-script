import { each } from "../util/index.js"

export class TypeGroup {
  constructor(types) {
    this.types = new Set(types)
  }

  add(...types) {
    each(types, (type) => this.types.add(type))
  }
  has(type) {
    return this.types.has(type)
  }

  clone() {
    return new TypeGroup([...this])
  }

  toArray() {
    return Array.from(this)
  }
  [Symbol.iterator]() {
    return this.types.keys()
  }
}
