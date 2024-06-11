import { range } from "./util/math.js"

export class NumberRange {
  constructor(min, max, step = 1) {
    this.min = min
    this.max = max
    this.step = step
  }
  toArray() {
    return range(this.min, this.max + this.step, this.step)
  }

  get array() {
    return this.toArray()
  }

  includes(n) {
    return this.array.includes(n)
  }

  [Symbol.iterator]() {
    return this.array.values()
  }
}
