// import { MinecraftBlockTypes } from "@minecraft/vanilla-data"
import { MinecraftBlockTypes } from "@minecraft/server"

import { BlockLocation } from "../../location/index.js"

import { WrappedBlocks } from "./WrappedBlocks.class.js"
import { BlockWrapperTemplate } from "./BlockWrapperTemplate.class.js"

export const WOODEN_DOORS = new Set([
    MinecraftBlockTypes.acaciaDoor,
    MinecraftBlockTypes.bambooDoor,
    MinecraftBlockTypes.birchDoor,
    MinecraftBlockTypes.cherryDoor,
    MinecraftBlockTypes.crimsonDoor,
    MinecraftBlockTypes.darkOakDoor,
    MinecraftBlockTypes.jungleDoor,
    MinecraftBlockTypes.mangroveDoor,
    MinecraftBlockTypes.spruceDoor,
    MinecraftBlockTypes.warpedDoor,
    MinecraftBlockTypes.woodenDoor
])

export class WoodenDoorBlock extends WrappedBlocks {
    constructor(block) {
        if (!WoodenDoorBlock.isWoodenDoorBlock(block))
            throw new TypeError(`"${block.typeId}" is not a wooden door.`)
        
        const wrappedBlock = block instanceof BlockWrapperTemplate
            ? block
            : new BlockWrapperTemplate(block)
        
        const isUpper = wrappedBlock.getState("upper_block_bit")
        const blocks = [
            // _lower
            isUpper
                ? wrappedBlock.getOffsetBlock(new BlockLocation(0, -1, 0))
                : wrappedBlock,
            // _upper
            isUpper
                ? wrappedBlock
                : wrappedBlock.getOffsetBlock(new BlockLocation(0, +1, 0))
        ]
        
        super(blocks)
    }
    
    static isWoodenDoorBlock(block) {
        return WOODEN_DOORS.has(block.type)
    }
    
    get _lower() {
        return this.blocks[0]
    }
    get _upper() {
        return this.blocks[1]
    }
    
    get opened() {
        return this._lower.getState("open_bit")
    }
    get facingDirection() {
        return this._lower.getState("direction")
        // the direction you are facing when you place the door
        // 0 -> east (x+)
        // 1 -> south (z+)
        // 2 -> west (x-)
        // 3 -> north (z-)
    }
    get hingeSide() {
        return this._upper.getState("door_hinge_bit")
        // true -> right
        // false -> left
    }
    
    open() {
        this._lower.setState("open_bit", true)
    }
    close() {
        this._lower.setState("open_bit", false)
    }
    
    getRelated() {
        // 获取可以与该门双开的另一个门和这个门组成的列表
        
        // 1. 获取另一个门的位置
        //    根据门的方向和门轴位置确定
        // e.g. 如果一个门的朝向是东边，门轴在左边（即北边）
        //      那么另一个门应该位于南边，即 z+1 的位置
        
        // 于是我们有下面的 switch 语句：
        // let relatedBlock
        // switch (this.facingDirection) {
        //     case 0: {
        //         relatedBlock = this._lower.getOffsetBlock(
        //             this.hingeSide
        //                 ? new BlockLocation(0, 0, -1)  // s -> n
        //                 : new BlockLocation(0, 0, +1)  // n -> s
        //         )
        //         break
        //     }
        //     case 1: {
        //         relatedBlock = this._lower.getOffsetBlock(
        //             this.hingeSide
        //                 ? new BlockLocation(+1, 0, 0)  // w -> e
        //                 : new BlockLocation(-1, 0, 0)  // e -> w
        //         )
        //         break
        //     }
        //     case 2: {
        //         relatedBlock = this._lower.getOffsetBlock(
        //             this.hingeSide
        //                 ? new BlockLocation(0, 0, +1)  // n -> s
        //                 : new BlockLocation(0, 0, -1)  // s -> n
        //         )
        //         break
        //     }
        //     case 3: {
        //         relatedBlock = this._lower.getOffsetBlock(
        //             this.hingeSide
        //                 ? new BlockLocation(-1, 0, 0)  // e -> w
        //                 : new BlockLocation(+1, 0, 0)  // w -> e
        //         )
        //         break
        //     }
        // }
        
        // 经过压缩，可以得到：
        const facingDirection = this.facingDirection
        const hingeSide = this.hingeSide
        const offset = BlockLocation.create({
            x: Number(
                facingDirection === 1
                    ? hingeSide || -1
                    : facingDirection === 3
                        ? !hingeSide || -1
                        : 0
            ),
            y: 0,
            z: Number(
                facingDirection === 0
                    ? !hingeSide || -1
                    : facingDirection === 2
                        ? hingeSide || -1
                        : 0
            )
        })
        const relatedBlock = this._lower.getOffsetBlock(offset)
        
        const output = [this]
        
        // 2. 进行判断
        if (WoodenDoorBlock.isWoodenDoorBlock(relatedBlock)) {
            const relatedDoor = new WoodenDoorBlock(relatedBlock)
            
            // 另一扇门应该方向相同，而门轴相反
            if (
                relatedDoor.facingDirection === facingDirection &&
                relatedDoor.hingeSide === !hingeSide
            ) output.push(relatedDoor)
        }
        
        return output
    }
}
