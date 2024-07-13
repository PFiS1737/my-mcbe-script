import type { NumberRange as INumberRange } from "@minecraft/common"

import { range } from "./util/math"

export class NumberRange implements INumberRange {
  min: number
  max: number
  step: number

  constructor(min: number, max: number, step = 1) {
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

  includes(n: number) {
    return this.array.includes(n)
  }

  [Symbol.iterator]() {
    return this.array.values()
  }
}
