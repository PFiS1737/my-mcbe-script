import { each } from "../util/index"

export class TypeGroup<T> {
  types: Set<T>

  constructor(types: T[]) {
    this.types = new Set(types)
  }

  add(...types: T[]) {
    each(types, (type) => this.types.add(type))
    return this
  }
  has(type: T) {
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
