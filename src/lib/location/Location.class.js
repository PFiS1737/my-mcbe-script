import { Vector3, Vector3Utils } from "../vector/index.js"

export class Location extends Vector3 {
    constructor(x, y, z) {
        super(x, y, z)
        // TODO: delete this.normalized
    }
    
    get centerCorrected() {
        return new Location(...Vector3Utils.add(
            this.floored,
            new Vector3(0.5, 0.5, 0.5)
        ))
    }
    
    clone() {
        return new Location(this.x, this.y, this.z)
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
