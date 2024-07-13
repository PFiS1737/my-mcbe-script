import { WrapperTemplate } from "../WrapperTemplate.class"
import type { WrappedBlock } from "./WrappedBlock.class"

export class WrappedBlocks extends WrapperTemplate {
  _blocks: WrappedBlock[]

  constructor(blocks: WrappedBlock[]) {
    super()

    this._blocks = blocks
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
