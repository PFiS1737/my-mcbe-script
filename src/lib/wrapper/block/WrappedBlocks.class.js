import { WrapperTemplate } from "../WrapperTemplate.class.js"

import { WrappedBlock } from "./WrappedBlock.class.js"

export class WrappedBlocks extends WrapperTemplate {
  constructor(blocks) {
    super()

    this._blocks = (Array.isArray(blocks) ? blocks : [blocks]).map((block) => {
      return block instanceof WrappedBlock // TODO: TypeError
        ? block
        : new WrappedBlock(block)
    })
  }

  get _block() {
    return this._blocks[0]
  }

  get type() {
    return this._block.type
  }
  get typeId() {
    return this._block.typeId
  }
  get location() {
    return this._block.location
  }
  get dimension() {
    return this._block.dimension
  }
  get permutation() {
    return this._block.permutation
  }
}
