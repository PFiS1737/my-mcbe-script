import { each } from "../util/index"
import { withProbability } from "../util/math"

export interface ILootTableItemConfig<T> {
  weight: number
  value: T
}

export class LootTable<T = number> {
  constructor(items: Array<number | ILootTableItemConfig<T>>) {
    if (items)
      each(items, (item) => {
        if (typeof item === "number") this.addItem({ weight: 1, value: item })
        else this.addItem(item)
      })
  }

  table = new Set<ILootTableItemConfig<T>>()
  totalWeight = 0

  addItem(item: ILootTableItemConfig<T>) {
    this.table.add(item)
    this.totalWeight += item.weight
  }

  getResult() {
    let total = 0
    for (const { weight, value } of this.table) {
      if (withProbability(weight / (this.totalWeight - total))) return value
      total += weight
    }

    throw new Error("Unexpected error.")
  }

  [Symbol.iterator]() {
    return this.table[Symbol.iterator]()
  }
}
