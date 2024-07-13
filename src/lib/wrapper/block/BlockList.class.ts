import type { Block } from "@minecraft/server"

import { type Vector3, Vector3Utils } from "../../vector/index"
import type { WrappedBlock } from "./WrappedBlock.class"

export class BlockList<T extends Block | WrappedBlock> {
  constructor(blocks?: T[]) {
    if (blocks) this.add(...blocks)
  }

  blocks: T[] = []

  get size() {
    return this.blocks.length
  }

  add(...blocks: T[]) {
    for (const block of blocks) {
      if (!this.has(block)) this.blocks.push(block)
    }
  }
  has(block: T) {
    return this.blocks.some(({ location }) =>
      Vector3Utils.exactEquals(location as Vector3, block.location as Vector3)
    )
  }

  shift() {
    return this.blocks.shift()
  }

  [Symbol.iterator]() {
    return this.blocks.values()
  }
}
