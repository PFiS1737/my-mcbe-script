export class Direction {
    constructor(directionCode) {
        this.code = directionCode
    }
    
    get name() {
        switch (this.code) {
            case 0: return "East"
            case 1: return "South"
            case 2: return "West"
            case 3: return "North"
            case 4: return "Up"
            case 5: return "Down"
        }
    }
    
    isEast() {
        return this.code === 0
    }
    isSouth() {
        return this.code === 1
    }
    isWest() {
        return this.code === 2
    }
    isNorth() {
        return this.code === 3
    }
    isUp() {
        return this.code === 4
    }
    isDown() {
        return this.code === 5
    }
}

export class Directions {
    static East = new Direction(0)
    static South = new Direction(1)
    static West = new Direction(2)
    static North = new Direction(3)
    static Up = new Direction(4)
    static Down = new Direction(5)
}
