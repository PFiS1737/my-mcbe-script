import { Location } from "./Location.class.js"

export class LocationUtils {
    static getFacingOffset(facing) {
        return Location.create({
            x: facing === 0  // east (x+)
                ? +1
                : facing === 2  // west (x-)
                    ? -1
                    : 0,
            y: 0,
            z: facing === 1  // south (z+)
                ? +1
                : facing === 3  // north (z-)
                    ? -1
                    : 0
        })
    }
}