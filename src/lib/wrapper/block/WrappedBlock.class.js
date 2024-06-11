import {
  BlockPermutation,
  ItemStack as MinecraftItemStack,
} from "@minecraft/server"

import { BlockLocation, LocationUtils } from "../../location/index.js"
import { each } from "../../util/index.js"

import { WrapperTemplate } from "../WrapperTemplate.class.js"

import { WrappedItemStack } from "../item/index.js"

import { BlockDrops } from "./BlockDrops.class.js"

export class WrappedBlock extends WrapperTemplate {
  constructor(block) {
    super()

    this._block = block

    this.type = block.type
    this.typeId = block.typeId
    this.location = BlockLocation.create(block.location)
    this.dimension = block.dimension
    this.permutation = block.permutation
  }

  getOffsetBlock(v) {
    const location = this.location.clone().offset(v)
    return new WrappedBlock(this.dimension.getBlock(location))
  }
  getNeighbourBlock(direction) {
    const offset = LocationUtils.getDirectionOffset(direction)
    return this.getOffsetBlock(offset)
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
    this._block.setPermutation(BlockPermutation.resolve(this.typeId, states))
  }

  canBeDugBy(itemTypeId = "<empty>") {
    return new BlockDrops(this.typeId).setItemUse(itemTypeId)
  }

  destroy() {
    this.dimension.fillBlocks(
      this.location,
      this.location,
      BlockPermutation.resolve("minecraft:air")
    )
  }
  breakBy(useItemStack) {
    const drops = new BlockDrops(this.typeId, useItemStack?.typeId ?? "<empty>")

    this.destroy()

    const result = (() => {
      if (useItemStack) {
        const item =
          useItemStack instanceof WrappedItemStack
            ? useItemStack
            : new WrappedItemStack(useItemStack)
        return drops.getDrops({
          withFortune: item.enchants.hasEnchantment("fortune"),
          withSilkTouch: item.enchants.hasEnchantment("silk_touch"),
        })
      }
      return drops.getDrops()
    })()

    const spawnDrops = () => {
      each(result, (drop) => {
        this.dimension.spawnItem(
          new MinecraftItemStack(drop.itemId, drop.amount),
          this.location
        )
        while (drop.xp--)
          this.dimension.spawnEntity("minecraft:xp_orb", this.location)
      })
    }

    const getTotalDamage = () => {
      let damage = 0
      each(result, (drop) => {
        if (drop.damage) damage += drop.damage
      })
      return damage
    }

    return { drops: result, spawnDrops, getTotalDamage }
  }
}
