import { world, Dimension } from "@minecraft/server"

import { Vector3 } from "./vector/Vector3.class.js"

export class LocationInfo {
    constructor({ location, dimension }) {
        this.location = location instanceof Vector3
            ? location
            : Vector3.create(location)
        this.dimension = dimension instanceof Dimension
            ? dimension
            : world.getDimension(dimension)
    }
    textify() {
        return {
            location: `${this.location}`,
            dimension: this.dimension.id
        }
    }
    
    [Symbol.toPrimitive](hint) {
        if (hint === "string") return  `${this.dimension.id.replace("minecraft:", "")}: ${this.location}`
        else return this
    }
}
