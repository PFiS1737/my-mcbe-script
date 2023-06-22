import { Vector } from "@minecraft/server"

import { parse, stringify, normalized } from "@/util/vector.js"

export class Vector3 extends Vector {
    static parse(vecStr) {
        return parse(vecStr, Vector3)
    }
    static normalized(vec) {
        return normalized(vec, Vector3)
    }
    
    constructor(x, y, z) {
        super(x, y, z)
    }
    
    [Symbol.toPrimitive](hint) {
        if (hint === "string") return stringify(this)
        else return this
    }
}

export class IntVector3 extends Vector3 {
    static parse(vecStr) {
        return parse(vecStr, IntVector3)
    }
    static normalized(vec) {
        return normalized(vec, IntVector3)
    }
    
    constructor(x, y, z) {
        super(
            Math.trunc(x),
            Math.trunc(y),
            Math.trunc(z)
        )
    }
}
