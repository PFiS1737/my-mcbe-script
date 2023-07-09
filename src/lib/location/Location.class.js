import { Vector3, Vector3Utils } from "../vector/index.js"

export class Location extends Vector3 {
    constructor(x, y, z) {
        super(x, y, z)
    }
    
    get centerCorrected() {
        return new Location(...Vector3Utils.add(
            this.floored,
            new Vector3(0.5, 0.5, 0.5)
        ))
    }
    
    equals(v) {
        return Vector3Utils.exactEquals(this, v)
    }
    
    offset(v) {
        return this.add(v)
    }
    isNear(v, distance) {
        return this.distance(v) <= distance
    }
}
