export class Direction {
  code: number

  constructor(directionCode: number) {
    this.code = directionCode
  }

  get name() {
    switch (this.code) {
      case 0:
        return "East"
      case 1:
        return "South"
      case 2:
        return "Up"
      case 3:
        return "West"
      case 4:
        return "North"
      case 5:
        return "Down"
      default:
        throw new Error("Unexpected error.")
    }
  }

  isEast() {
    return this.code === 0
  }
  isSouth() {
    return this.code === 1
  }
  isUp() {
    return this.code === 2
  }
  isWest() {
    return this.code === 3
  }
  isNorth() {
    return this.code === 4
  }
  isDown() {
    return this.code === 5
  }

  equals(direction: Direction) {
    return this.code === direction.code
  }

  getOpposite() {
    const directionCode = this.code + 3
    return new Direction(directionCode >= 6 ? directionCode - 6 : directionCode)
  }
  isOppositeTo(direction: Direction) {
    return Math.abs(this.code - direction.code) === 3
  }
}

export class Directions {
  static East = new Direction(0) // x+
  static South = new Direction(1) // z+
  static Up = new Direction(2) // y+
  static West = new Direction(3) // x-
  static North = new Direction(4) // z-
  static Down = new Direction(5) // y-
}
