import { Vector3Utils } from "../vector/index.js"

import { Location } from "./Location.class.js"

export class BlockLocation extends Location {
    constructor(x, y, z) {
        super(x, y, z)
        
        this.floor()
    }
    
    get centerCorrected() {
        throw new Error('Couldn\'t get "centerCorrected" on BlockLocation')
    }
    
    divide(v) {
        super.divide(v)
        return this.floor()
    }
    inverse() {
        throw new Error('Couldn\'t call "inverse" on BlockLocation.')
    }
    
    between(v) {
        const dx = v.x - this.x
        const dy = v.y - this.y
        const dz = v.z - this.z
        const output = []
        for (let x = 0; x <= dx; x++) {
            for (let y = 0; y <= dy; y++) {
                for (let z = 0; z <= dz; z++) {
                    output.push(
                        new BlockLocation(...Vector3Utils.add(this, { x, y, z }))
                    )
                }
            }
        }
        return output
    }
}
