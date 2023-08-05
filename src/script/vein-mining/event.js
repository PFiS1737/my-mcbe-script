import { world, ItemStack } from "@minecraft/server"

import { BetterConsole } from "@/lib/BetterConsole.class.js"
import { WrappedItemStack, ItemStackWithDurability } from "@/lib/wrapper/item/index.js"
import { WrappedBlock, BlockList } from "@/lib/wrapper/block/index.js"
import { Vector3Utils } from "@/lib/vector/index"
import { WrappedPlayer } from "@/lib/wrapper/entity/index.js"
import { BlockLocation } from "@/lib/location/index.js"
import { each } from "@/util/index.js"
import { asyncRun } from "@/util/game.js"

import { option } from "./option.js"
import { ENABLE_BLOCKS } from "./config.js"

export const setupListener = () => world.afterEvents.blockBreak.subscribe(event => {
    const basicBlock = new WrappedBlock(event.block)
    const blockTypeId = event.brokenBlockPermutation.type.id
    const player = new WrappedPlayer(event.player)
    const playerOption = option.getPlayer(event.player)
    
    player.useMainHandItem(async mainHandItem => {
        if (
            !mainHandItem ||
            !ENABLE_BLOCKS.has(blockTypeId) ||
            !WrappedBlock.prototype.canBeDugBy
                .call({ typeId: blockTypeId }, mainHandItem.typeId) ||
            playerOption.getItemVal("condition") === "off" ||
            (playerOption.getItemVal("condition") === "sneaking" && !player.isSneaking)
        ) return mainHandItem
        
        const blockList = getRelatedBlocks(playerOption, basicBlock, blockTypeId)
        
        const wrappedItem = ItemStackWithDurability.tryWrap(mainHandItem)
            ?? new WrappedItemStack(mainHandItem)
        
        let totalDamage = 0
        
        const totalItems = []
        let totalXp = 0
        
        while (
            blockList.size > 0 &&
            (
                !playerOption.getItemVal("prevent_tool_destruction") ||
                (
                    playerOption.getItemVal("prevent_tool_destruction") &&
                    totalDamage < ( wrappedItem.durability ?? Infinity )
                )
            )
        ) {
            const block = blockList.shift()
            
            const result = await asyncRun(() => block.breakBy(mainHandItem))
            
            totalDamage += result.getTotalDamage()
            
            if (playerOption.getItemVal("auto_collection")) {
                each(result.drops, drop => {
                    if (drop.xp) totalXp += drop.xp
                    totalItems.push([ drop.itemId, drop.amount ])
                })
            } else {
                result.spawnDrops()
            }
        }
        
        if (playerOption.getItemVal("auto_collection")) {
            each(totalItems, item => player.inventory.addItem(new ItemStack(...item)))
            player.addExperience(totalXp)
        }
        
        if (wrappedItem instanceof ItemStackWithDurability) wrappedItem.applyDamage(totalDamage)
        
        return wrappedItem._item
    }).catch(BetterConsole.error)
})

function getNeighbourBlocks(playerOption, basicBlock, blockTypeId) {
    const offsets = [
        new BlockLocation(1, 0, 0),
        new BlockLocation(-1, 0, 0),
        new BlockLocation(0, 0, 1),
        new BlockLocation(0, 0, -1),
        new BlockLocation(0, 1, 0),
        new BlockLocation(0, -1, 0)
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
    
    each(offsets, offset => {
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
    
    while (
        currentSize < maxAmount &&
        currentSize - previousSize > 0
    ) {
        for (const block of list) {
            list.add(...getNeighbourBlocks(playerOption, block, blockTypeId))
            previousSize = currentSize
            currentSize = list.size
            
            if (currentSize >= maxAmount) break
        }
    }
    
    return list
}
