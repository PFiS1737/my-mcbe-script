import { each } from "../../util/index"
import { Vector3Utils } from "../../vector/index"

export class BlockList {
  constructor(blocks) {
    if (blocks) this.add(...blocks)
  }

  blocks = []

  get size() {
    return this.blocks.length
  }

  add(...blocks) {
    each(blocks, (block) => {
      if (!this.has(block)) this.blocks.push(block)
    })
  }
  has(block) {
    return this.blocks.some(({ location }) =>
      Vector3Utils.exactEquals(location, block.location)
    )
  }

  shift() {
    return this.blocks.shift()
  }

  [Symbol.iterator]() {
    return this.blocks.values()
  }
}
