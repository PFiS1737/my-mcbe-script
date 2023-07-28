import { LocationUtils } from "./LocationUtils.class.js"

import { Location } from "./Location.class.js"

export class BlockLocation extends Location {
    constructor(x, y, z) {
        super(x, y, z)
        
        this.floor()
    }
    
    get centerCorrected() {
        throw new Error('Couldn\'t get "centerCorrected" on BlockLocation.')
    }
    
    clone() {
        return new BlockLocation(this.x, this.y, this.z)
    }
    
    divide(v) {
        super.divide(v)
        return this.floor()
    }
    inverse() {
        throw new Error('Couldn\'t call "inverse" on BlockLocation.')
    }
    
    between(v) {
        return LocationUtils.between(this, v)
    }
}
