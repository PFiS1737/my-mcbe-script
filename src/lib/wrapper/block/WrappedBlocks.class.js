import { WrapperTemplate } from "../WrapperTemplate.class.js"

import { WrappedBlock } from "./WrappedBlock.class.js"

export class WrappedBlocks extends WrapperTemplate {
    constructor(blocks) {
        super()
        
        this.blocks = (Array.isArray(blocks) ? blocks : [blocks])
            .map(block => {
                return block instanceof WrappedBlock  // TODO: TypeError
                    ? block
                    : new WrappedBlock(block)
            })
    }
    
    get block() {
        return this.blocks[0]
    }
    
    get type() {
        return this.block.type
    }
    get typeId() {
        return this.block.typeId
    }
    get location() {
        return this.block.location
    }
    get dimension() {
        return this.block.dimension
    }
}
