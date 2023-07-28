import { each } from "../util/index.js"

export class TypeGroup {
    constructor(types) {
        this.types = new Set(types)
    }
    
    has(type) {
        return this.types.has(type)
    }
    
    toArray() {
        return Array.from(this)
    }
    [Symbol.iterator]() {
        return this.types.keys()
    }
}
