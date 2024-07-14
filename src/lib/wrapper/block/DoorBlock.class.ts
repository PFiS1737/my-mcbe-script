import type { Block } from "@minecraft/server"

import { BlockLocation, Directions } from "../../location/index"
import { WrappedBlock } from "./WrappedBlock.class"
import { WrappedBlocks } from "./WrappedBlocks.class"

import {
  COPPER_DOORS,
  DOORS,
  WOODEN_DOORS,
} from "./BlockTypeGroups.enumeration"

export class DoorBlock extends WrappedBlocks {
  constructor(block: Block) {
    DoorBlock.assert(block)

    const wrappedBlock =
      block instanceof WrappedBlock ? block : new WrappedBlock(block)

    const isUpper = wrappedBlock.getState("upper_block_bit")
    const blocks = [
      // _lower
      isUpper ? wrappedBlock.getNeighbourBlock(Directions.Down) : wrappedBlock,
      // _upper
      isUpper ? wrappedBlock : wrappedBlock.getNeighbourBlock(Directions.Up),
    ]

    super(blocks)
  }

  static match(block: Block) {
    return DOORS.has(block.typeId)
  }
  static assert(block: Block) {
    if (DoorBlock.match(block)) return true

    throw new TypeError(`The "${block.typeId}" is not a door.`)
  }

  get _lower() {
    return this._blocks[0]
  }
  get _upper() {
    return this._blocks[1]
  }

  get opened() {
    return this._lower.getState("open_bit") as boolean
  }
  get facingDirection() {
    // the direction you are facing when you place the door
    const directionCode = this._lower.getState("direction")
    switch (directionCode) {
      case 0:
        return Directions.East
      case 1:
        return Directions.South
      case 2:
        return Directions.West
      case 3:
        return Directions.North
      default:
        // this branch can't be reached forever
        throw new Error("Unexpected error.")
    }
  }
  get hingeSide() {
    return this._upper.getState("door_hinge_bit") as boolean
    // true -> right
    // false -> left
  }

  isWooden() {
    return WOODEN_DOORS.has(this.typeId)
  }
  isCopper() {
    return COPPER_DOORS.has(this.typeId)
  }
  isIron() {
    return !this.canBeOpenedByHand()
  }
  canBeOpenedByHand() {
    return this.isWooden() || this.isCopper()
  }

  open() {
    this._lower.setState("open_bit", true)
  }
  close() {
    this._lower.setState("open_bit", false)
  }

  getRelated({ shouldBeTheSameType = true } = {}) {
    // 获取可以与该门双开的另一个门和这个门组成的列表
    const output: DoorBlock[] = [this]

    // 1. 获取另一个门的位置
    //    根据门的方向和门轴位置确定
    // e.g. 如果一个门的朝向是东边，门轴在左边（即北边）
    //      那么另一个门应该位于南边，即 z+1 的位置
    const facingDirection = this.facingDirection
    const hingeSide = this.hingeSide
    const offset = BlockLocation.create({
      x: Number(
        facingDirection.isSouth()
          ? hingeSide || -1
          : facingDirection.isNorth()
            ? !hingeSide || -1
            : 0
      ),
      y: 0,
      z: Number(
        facingDirection.isEast()
          ? !hingeSide || -1
          : facingDirection.isWest()
            ? hingeSide || -1
            : 0
      ),
    })

    // 2. 进行判断
    const relatedBlock = this._lower.getOffsetBlock(offset)
    if (DoorBlock.match(relatedBlock._block)) {
      const relatedDoor = new DoorBlock(relatedBlock._block)
      // 另一扇门应该方向相同，而门轴相反
      if (
        relatedDoor.canBeOpenedByHand() &&
        (shouldBeTheSameType ? relatedDoor.typeId === this.typeId : true) &&
        relatedDoor.facingDirection.code === facingDirection.code &&
        relatedDoor.hingeSide === !hingeSide
      )
        output.push(relatedDoor)
    }

    return output
  }
}
