import { ItemStack, world } from "@minecraft/server"

import { BetterConsole } from "@/lib/BetterConsole.class.js"
import { BlockLocation } from "@/lib/location/index.js"
import {
  BlockList,
  BlockTypeGroups,
  WrappedBlock,
} from "@/lib/wrapper/block/index.js"
import { WrappedPlayer } from "@/lib/wrapper/entity/index.js"
import {
  ItemStackWithDurability,
  WrappedItemStack,
} from "@/lib/wrapper/item/index.js"
import { asyncRun } from "@/util/game.js"
import { each } from "@/util/index.js"

import { ENABLE_BLOCKS } from "./config.js"
import { option } from "./option.js"

export const setupListener = () =>
  world.afterEvents.blockBreak.subscribe((event) => {
    const basicBlock = new WrappedBlock(event.block)
    const blockTypeId = event.brokenBlockPermutation.type.id
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
            mainHandItem.typeId
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

        const wrappedItem =
          ItemStackWithDurability.tryWrap(mainHandItem) ??
          new WrappedItemStack(mainHandItem)

        let totalDamage = 0

        const totalItems = []
        let totalXp = 0

        while (
          blockList.size > 0 &&
          (!playerOption.getItemVal("prevent_tool_destruction") ||
            (playerOption.getItemVal("prevent_tool_destruction") &&
              totalDamage <
                (wrappedItem.durability ?? Number.POSITIVE_INFINITY)))
        ) {
          const block = blockList.shift()

          const result = await asyncRun(() => block.breakBy(mainHandItem))

          totalDamage += result.getTotalDamage()

          if (playerOption.getItemVal("auto_collection")) {
            each(result.drops, (drop) => {
              if (drop.xp) totalXp += drop.xp
              totalItems.push([drop.itemId, drop.amount])
            })
          } else {
            result.spawnDrops()
          }
        }

        if (playerOption.getItemVal("auto_collection")) {
          each(totalItems, (item) =>
            player.inventory.addItem(new ItemStack(...item))
          )
          player.addExperience(totalXp)
        }

        if (wrappedItem instanceof ItemStackWithDurability)
          wrappedItem.applyDamage(totalDamage)

        return wrappedItem._item
      })
      .catch(BetterConsole.error)
  })

function getNeighbourBlocks(playerOption, basicBlock, blockTypeId) {
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

  const list = new BlockList()

  each(offsets, (offset) => {
    const block = basicBlock.getOffsetBlock(offset)
    if (block.typeId === blockTypeId) list.add(block)
  })

  return list
}

function getRelatedBlocks(playerOption, basicBlock, blockTypeId) {
  const maxAmount = playerOption.getItemVal("max_amount")

  const list = new BlockList()
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
