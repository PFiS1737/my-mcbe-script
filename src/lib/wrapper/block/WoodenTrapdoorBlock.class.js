import { Directions } from "../../location/index.js"

import { WrappedPlayer } from "../entity/index.js"

import { WrappedBlock } from "./WrappedBlock.class.js"

import { WOODEN_TRAPDOORS } from "./BlockTypeGroups.enumeration.js"

export class WoodenTrapdoorBlock extends WrappedBlock {
  constructor(block) {
    if (!WoodenTrapdoorBlock.match(block))
      throw new TypeError(`The "${block.typeId}" is not a wooden door.`)

    super(block)
  }

  static match(block) {
    return WOODEN_TRAPDOORS.has(block?.typeId)
  }

  get opened() {
    return this.getState("open_bit")
  }
  get facingDirection() {
    // trapdoor is on the >direction< side of a block
    const directionCode = this.getState("direction")
    switch (directionCode) {
      case 0:
        return Directions.East
      case 2:
        return Directions.South
      case 1:
        return Directions.West
      case 3:
        return Directions.North
      default:
        // TODO: error msg
        throw new Error("error")
    }
  }
  get upsideOrDown() {
    return this.getState("upside_down_bit")
  }

  open() {
    this.setState("open_bit", true)
  }
  close() {
    this.setState("open_bit", false)
  }

  getRelated(player, { extensive = true, maxLength = 1 } = {}) {
    // 获取可以与该活板门双开的另外一些活板门和这个活板门组成的列表
    const output = [this]

    if (maxLength > 0) {
      // 1. 获取另一个活板门的位置
      // e.g. 如果一个活板门位于一个方块的东边
      //      那么另一个活板门应该位于东边，即 x+1 的位置
      const relatedBlock = this.getNeighbourBlock(this.facingDirection)

      // 2. 判断是否为相关活板门
      if (WoodenTrapdoorBlock.match(relatedBlock)) {
        const relatedTrapdoor = new WoodenTrapdoorBlock(relatedBlock._block)

        // 方向相反，上下位置相同
        if (
          relatedTrapdoor.facingDirection.isOppositeTo(this.facingDirection) &&
          relatedTrapdoor.upsideOrDown === this.upsideOrDown
        )
          // @ts-ignore
          output.push(relatedTrapdoor)
      }
    }

    if (extensive) {
      let that = this
      let needOpposite = false
      // 仅 maxLength > 1 时才会运行
      while (--maxLength) {
        // 3. 获取扩展活板门
        //    即能与该活板门延伸联动的另一个活板门
        // @ts-ignore
        const playerFacing = WrappedPlayer.wrap(player).getFacingDirectionXZ()
        const extensiveBlock = needOpposite
          ? that.getNeighbourBlock(playerFacing.getOpposite())
          : that.getNeighbourBlock(playerFacing)

        if (WoodenTrapdoorBlock.match(extensiveBlock)) {
          const extensiveTrapdoor = new WoodenTrapdoorBlock(
            extensiveBlock._block
          )

          // 方向相同，上下位置相同
          if (
            extensiveTrapdoor.facingDirection.equals(this.facingDirection) &&
            extensiveTrapdoor.upsideOrDown === this.upsideOrDown
          ) {
            const result = extensiveTrapdoor.getRelated(player, {
              extensive: false,
              maxLength,
            })
            if (result.length > 1) {
              // @ts-ignore
              output.push(...result)

              // @ts-ignore
              that = extensiveTrapdoor
              continue
            }
          }
        }

        // 当玩家面对的方向可以联动的活板门数量不足时
        // 反向查找
        if (!needOpposite) {
          needOpposite = true
          that = this
          // 因为此变向操纵消耗了一次迭代，故补充一次
          maxLength++
        } else {
          break
        }
      }
    }

    return output
  }
}
