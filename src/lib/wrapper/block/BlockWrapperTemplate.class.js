import { world, BlockPermutation } from "@minecraft/server"

import { BlockLocation } from "../../location/index.js"

export class BlockWrapperTemplate {
    constructor(block) {
        this.block = block
        this.type = block.type
        this.typeId = block.typeId
        this.location = BlockLocation.create(block.location)
        this.dimension = block.dimension
        this.permutation = block.permutation
    }
    
    getOffsetBlock(v) {
        const location = this.location.clone().offset(v)
        return new BlockWrapperTemplate(
            this.dimension.getBlock(location)
        )
    }
    
    getState(name) {
        return this.permutation.getState(name)
    }
    hasState(name) {
        return !!this.getState(name)
    }
    setState(name, value) {
        const states = this.permutation.getAllStates()
        states[name] = value
        this.block.setPermutation(
            BlockPermutation.resolve(this.typeId, states)
        )
    }
}
