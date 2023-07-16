// import { MinecraftBlockTypes } from "@minecraft/vanilla-data"
import { MinecraftBlockTypes } from "@minecraft/server"

import { BlockLocation, LocationUtils } from "../../location/index.js"

import { WrappedBlocks } from "./WrappedBlocks.class.js"
import { BlockWrapperTemplate } from "./BlockWrapperTemplate.class.js"

import { WrappedPlayer } from "../entity/index.js"

export const WOODEN_TRAPDOORS = new Set([
    MinecraftBlockTypes.acaciaTrapdoor,
    MinecraftBlockTypes.bambooTrapdoor,
    MinecraftBlockTypes.birchTrapdoor,
    MinecraftBlockTypes.cherryTrapdoor,
    MinecraftBlockTypes.crimsonTrapdoor,
    MinecraftBlockTypes.darkOakTrapdoor,
    MinecraftBlockTypes.jungleTrapdoor,
    MinecraftBlockTypes.mangroveTrapdoor,
    MinecraftBlockTypes.spruceTrapdoor,
    MinecraftBlockTypes.trapdoor,
    MinecraftBlockTypes.warpedTrapdoor
])

export class WoodenTrapdoorBlock extends WrappedBlocks {
    constructor(block) {
        if (!WoodenTrapdoorBlock.isWoodenTrapdoorBlock(block))
            throw new TypeError(`"${block.typeId}" is not a wooden door.`)
        
        const wrappedBlock = block instanceof BlockWrapperTemplate
            ? block
            : new BlockWrapperTemplate(block)
        
        super([block])
    }
    
    static isWoodenTrapdoorBlock(block) {
        return WOODEN_TRAPDOORS.has(block.type)
    }
    
    get opened() {
        return this.block.getState("open_bit")
    }
    get facingDirection() {
        const direction = this.block.getState("direction")
        if (direction === 1) return 2
        else if (direction === 2) return 1
        else return direction
        // 0 -> trapdoor is on the >east (x+)< side of a block
        // 1 -> south (z+)
        // 2 -> west (x-)
        // 3 -> north (z-)
    }
    get upsideOrDown() {
        return this.block.getState("upside_down_bit")
    }
    
    open() {
        this.block.setState("open_bit", true)
    }
    close() {
        this.block.setState("open_bit", false)
    }
    
    getRelated(player, maxLength = 1) {
        // 获取可以与该活板门双开的另外一些活板门和这个活板门组成的列表
        
        // 1. 获取另一个活板门的位置
        // e.g. 如果一个活板门位于一个方块的东边
        //      那么另一个活板门应该位于东边，即 x+1 的位置
        const facingDirection = this.facingDirection
        const offset = LocationUtils.getFacingOffset(facingDirection)
        const relatedBlock = this.block.getOffsetBlock(offset)
        
        const output = [this]
        
        // 如果 maxLength 大于 0
        if (maxLength) {
            // 2. 判断是否为相关活板门
            if (WoodenTrapdoorBlock.isWoodenTrapdoorBlock(relatedBlock)) {
                const relatedTrapdoor = new WoodenTrapdoorBlock(relatedBlock)
                
                // 方向相反，上下位置相同
                if (
                    Math.abs(relatedTrapdoor.facingDirection - facingDirection) === 2 &&
                    relatedTrapdoor.upsideOrDown === this.upsideOrDown
                ) output.push(relatedTrapdoor)
                
                // 3. 获取扩展活板门
                //    即能与该活板门延伸联动的另一个活板门
                const wrappedPlayer = new WrappedPlayer(player)
                const playerFacing = wrappedPlayer.getFacing()
                const extensiveOffset = LocationUtils.getFacingOffset(playerFacing)
                const extensiveBlock = this.block.getOffsetBlock(extensiveOffset)
                if (WoodenTrapdoorBlock.isWoodenTrapdoorBlock(extensiveBlock)) {
                    const extensiveTrapdoor = new WoodenTrapdoorBlock(extensiveBlock)
                    
                    // 方向相同，上下位置相同
                    if (
                        extensiveTrapdoor.facingDirection === facingDirection &&
                        extensiveTrapdoor.upsideOrDown === this.upsideOrDown
                    ) {
                        // 进行递归运算
                        const result = extensiveTrapdoor.getRelated(player, maxLength - 1)
                        if (result.length > 1) output.push(...result)  // TODO: 如果指定的长度还未达到，就反向运行
                    }
                }
            }
        }
        
        return output
    }
}
