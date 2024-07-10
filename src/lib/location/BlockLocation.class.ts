import { LocationUtils } from "./LocationUtils.class"

import { Location } from "./Location.class"

export class BlockLocation extends Location {
  constructor(x, y, z) {
    super(x, y, z)

    this.floor()
  }

  // @ts-ignore
  get centerCorrected() {
    throw new Error('Couldn\'t get "centerCorrected" on BlockLocation.')
  }

  // @ts-ignore
  clone() {
    return new BlockLocation(this.x, this.y, this.z)
  }

  divide(v) {
    super.divide(v)
    return this.floor()
  }
  // @ts-ignore
  inverse() {
    throw new Error('Couldn\'t call "inverse" on BlockLocation.')
  }

  between(v) {
    return LocationUtils.between(this, v)
  }
}
