export class TypeGroup<T> {
  types: Set<T>

  constructor(types: T[]) {
    this.types = new Set(types)
  }

  add(...types: T[]) {
    for (const type of types) this.types.add(type)
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
