import { world, Dimension } from "@minecraft/server"

import { Location } from "./location/Location.class.js"

export class LocationInfo {
    constructor({ location, dimension }) {
        this.location = location instanceof Location
            ? location
            : Location.create(location)
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
