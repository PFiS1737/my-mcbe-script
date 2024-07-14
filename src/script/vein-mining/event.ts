import { ItemStack, world } from "@minecraft/server"
import type {
  MinecraftBlockTypes,
  MinecraftItemTypes,
} from "@minecraft/vanilla-data"

import { BetterConsole } from "@/lib/BetterConsole.class"
import { BlockLocation } from "@/lib/location/index"
import type { PlayerOption } from "@/lib/option-manager/PlayerOption.class"
import type { BlockDrops } from "@/lib/wrapper/block/BlockDrops.class"
import {
  BlockList,
  BlockTypeGroups,
  WrappedBlock,
} from "@/lib/wrapper/block/index"
import { WrappedPlayer } from "@/lib/wrapper/entity/index"
import {
  ItemStackWithDurability,
  WrappedItemStack,
} from "@/lib/wrapper/item/index"
import { asyncRun } from "@/util/game"

import { ENABLE_BLOCKS } from "./config"
import { option } from "./option"

export const setupListener = () =>
  world.afterEvents.playerBreakBlock.subscribe((event) => {
    const basicBlock = new WrappedBlock(event.block)
    const blockTypeId = event.brokenBlockPermutation.type
      .id as MinecraftBlockTypes
    const player = new WrappedPlayer(event.player)
    const playerOption = option.getPlayer(event.player)

    let enableBlocks = ENABLE_BLOCKS
    if (playerOption.getItemVal("enable_stone"))
      enableBlocks = ENABLE_BLOCKS.clone().add(...BlockTypeGroups.STONES)

    player
      .useMainHandItem(async (mainHandItem) => {
        if (
          !mainHandItem ||
          !enableBlocks.has(blockTypeId) ||
          !WrappedBlock.prototype.canBeDugBy.call(
            { typeId: blockTypeId },
            mainHandItem.typeId as MinecraftItemTypes
          ) ||
          playerOption.getItemVal("condition") === "off" ||
          (playerOption.getItemVal("condition") === "sneaking" &&
            !player.isSneaking)
        )
          return mainHandItem

        const blockList = getRelatedBlocks(
          playerOption,
          basicBlock,
          blockTypeId
        )

        const wrappedItem = ItemStackWithDurability.match(mainHandItem)
          ? new ItemStackWithDurability(mainHandItem)
          : new WrappedItemStack(mainHandItem)

        let totalDamage = 0

        const totalItems: ReturnType<BlockDrops["getDrops"]> = []
        let totalXp = 0

        while (
          blockList.size > 0 &&
          (!playerOption.getItemVal("prevent_tool_destruction") ||
            (playerOption.getItemVal("prevent_tool_destruction") &&
              (wrappedItem instanceof ItemStackWithDurability
                ? totalDamage < wrappedItem.durability
                : true)))
        ) {
          const block = blockList.shift()

          if (!block) throw new Error("Unexpected error.")

          const result = await asyncRun(() => block.breakBy(mainHandItem))

          totalDamage += result.getTotalDamage()

          if (playerOption.getItemVal("auto_collection")) {
            for (const drop of result.drops) {
              if (drop.xp) totalXp += drop.xp

              totalItems.push(drop)
            }
          } else {
            result.spawnDrops()
          }
        }

        if (playerOption.getItemVal("auto_collection")) {
          for (const { itemId, amount } of totalItems) {
            player.inventory.addItem(new ItemStack(itemId, amount))
          }
          player.addExperience(totalXp)
        }

        if (wrappedItem instanceof ItemStackWithDurability)
          wrappedItem.applyDamage(totalDamage)

        return wrappedItem._item
      })
      .catch(BetterConsole.error)
  })

function getNeighbourBlocks(
  playerOption: PlayerOption,
  basicBlock: WrappedBlock,
  blockTypeId: MinecraftBlockTypes
) {
  const offsets = [
    new BlockLocation(1, 0, 0),
    new BlockLocation(-1, 0, 0),
    new BlockLocation(0, 0, 1),
    new BlockLocation(0, 0, -1),
    new BlockLocation(0, 1, 0),
    new BlockLocation(0, -1, 0),
  ]

  if (playerOption.getItemVal("enable_edge")) {
    offsets.push(
      new BlockLocation(1, 1, 0),
      new BlockLocation(1, -1, 0),
      new BlockLocation(-1, 1, 0),
      new BlockLocation(-1, -1, 0),
      new BlockLocation(0, 1, 1),
      new BlockLocation(0, -1, 1),
      new BlockLocation(0, 1, -1),
      new BlockLocation(0, -1, -1),
      new BlockLocation(1, 0, 1),
      new BlockLocation(1, 0, -1),
      new BlockLocation(-1, 0, 1),
      new BlockLocation(-1, 0, -1)
    )
  }

  if (playerOption.getItemVal("enable_diagonal")) {
    offsets.push(
      new BlockLocation(-1, -1, -1),
      new BlockLocation(-1, 1, -1),
      new BlockLocation(-1, -1, 1),
      new BlockLocation(-1, 1, 1),
      new BlockLocation(1, -1, -1),
      new BlockLocation(1, 1, -1),
      new BlockLocation(1, -1, 1),
      new BlockLocation(1, 1, 1)
    )
  }

  const list = new BlockList<WrappedBlock>()

  for (const offset of offsets) {
    const block = basicBlock.getOffsetBlock(offset)
    if (block.typeId === blockTypeId) list.add(block)
  }

  return list
}

function getRelatedBlocks(
  playerOption: PlayerOption,
  basicBlock: WrappedBlock,
  blockTypeId: MinecraftBlockTypes
) {
  const maxAmount = playerOption.getItemVal("max_amount")

  const list = new BlockList<WrappedBlock>()
  list.add(...getNeighbourBlocks(playerOption, basicBlock, blockTypeId))

  let previousSize = 0
  let currentSize = list.size

  while (currentSize < maxAmount && currentSize - previousSize > 0) {
    for (const block of list) {
      list.add(...getNeighbourBlocks(playerOption, block, blockTypeId))
      previousSize = currentSize
      currentSize = list.size

      if (currentSize >= maxAmount) break
    }
  }

  return list
}
