import { each } from "../util/index.js"
import { withProbability } from "../util/math.js"

export class LootTable {
    constructor(items) {
        if (items) each(items, item => {
            if (typeof item === "number") this.addItem({ weight: 1, value: item })
            else this.addItem(item)
        })
    }
    
    table = new Set()
    totalWeight = 0
    
    addItem(item) {
        this.table.add(item)
        this.totalWeight += item.weight
    }
    
    getResult() {
        let total = 0
        for (const { weight, value } of this.table) {
            if (
                withProbability(
                    weight / ( this.totalWeight - total )
                )
            ) return value
            else total += weight
        }
    }
    
    [Symbol.iterator]() {
        return this.table
    }
}
