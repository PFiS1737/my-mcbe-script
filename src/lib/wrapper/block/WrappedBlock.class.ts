import {
  type Block,
  BlockPermutation,
  BlockVolume,
  ItemStack,
} from "@minecraft/server"
import type {
  MinecraftBlockTypes,
  MinecraftItemTypes,
} from "@minecraft/vanilla-data"

import {
  BlockLocation,
  type Direction,
  type Location,
  LocationUtils,
} from "../../location/index"
import type { Implementable } from "../../util/types"
import { WrappedItemStack } from "../item/index"
import { BlockDrops } from "./BlockDrops.class"

export class WrappedBlock implements Implementable<Block> {
  _block: Block
  type: Block["type"]
  typeId: MinecraftBlockTypes
  location: BlockLocation
  dimension: Block["dimension"]
  permutation: Block["permutation"]

  constructor(block: Block) {
    this._block = block

    this.type = block.type
    this.typeId = block.typeId as MinecraftBlockTypes
    this.location = BlockLocation.create(block.location)
    this.dimension = block.dimension
    this.permutation = block.permutation
  }

  getOffsetBlock(v: Location | BlockLocation) {
    const location = this.location.clone().offset(v)
    const block = this.dimension.getBlock(location)

    if (!block) throw new Error("Getting block from an unload chunk.")

    return new WrappedBlock(block)
  }
  getNeighbourBlock(direction: Direction) {
    const offset = LocationUtils.getDirectionOffset(direction)
    return this.getOffsetBlock(offset)
  }

  getState(name: string) {
    return this.permutation.getState(name)
  }
  hasState(name: string) {
    return !!this.getState(name)
  }
  setState(name: string, value: string | number | boolean) {
    const states = this.permutation.getAllStates()
    states[name] = value
    this._block.setPermutation(BlockPermutation.resolve(this.typeId, states))
  }

  canBeDugBy(itemTypeId: MinecraftItemTypes | "<empty>" = "<empty>") {
    return !!new BlockDrops(this.typeId).getDropConfig(itemTypeId)
  }

  destroy() {
    this.dimension.fillBlocks(
      new BlockVolume(this.location, this.location),
      BlockPermutation.resolve("minecraft:air")
    )
  }
  breakBy(useItemStack: ItemStack | WrappedItemStack) {
    const drops = new BlockDrops(
      this.typeId,
      (useItemStack.typeId as MinecraftItemTypes) ?? "<empty>"
    )

    this.destroy()

    const result = (() => {
      if (useItemStack) {
        const item =
          useItemStack instanceof WrappedItemStack
            ? useItemStack
            : new WrappedItemStack(useItemStack)
        return drops.getDrops({
          withFortune: item.enchants.getEnchantment("fortune")?.level ?? 0,
          withSilkTouch: item.enchants.hasEnchantment("silk_touch"),
        })
      }
      return drops.getDrops()
    })()

    const spawnDrops = () => {
      for (const drop of result) {
        this.dimension.spawnItem(
          new ItemStack(drop.itemId, drop.amount),
          this.location
        )
        if (drop.xp) {
          while (drop.xp--)
            this.dimension.spawnEntity("minecraft:xp_orb", this.location)
        }
      }
    }

    const getTotalDamage = () => {
      let damage = 0
      for (const drop of result) {
        if (drop.damage) damage += drop.damage
      }
      return damage
    }

    return { drops: result, spawnDrops, getTotalDamage }
  }
}
