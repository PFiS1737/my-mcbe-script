import { BlockWrapperTemplate } from "./BlockWrapperTemplate.class.js"

export class WrappedBlocks {
    constructor(blocks) {
        this.blocks = blocks
            .map(block => {
                return block instanceof BlockWrapperTemplate
                    ? block
                    : new BlockWrapperTemplate(block)
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
