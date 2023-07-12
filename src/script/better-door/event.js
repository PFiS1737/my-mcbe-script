import { world } from "@minecraft/server"

import {
    WoodenDoorBlock,
    WoodenTrapdoorBlock
} from "@/lib/wrapper/block/index.js"
import { each } from "@/util/index.js"
import { asyncRun, errorHandler } from "@/util/game.js"

import { option } from "./option.js"

export const setupListener = () => world.beforeEvents.itemUseOn.subscribe(event => {
    const { block, source: player } = event
    const playerOption = option.getPlayer(player)
    if (
        WoodenDoorBlock.isWoodenDoorBlock(block) &&
        playerOption.getItemVal("door")
    ) {
        event.cancel = true
        const doors = (new WoodenDoorBlock(block)).getRelated()
        asyncRun(() => {
            if (doors[0].opened) each(doors, _ => _.close())
            else each(doors, _ => _.open())
        })
    } else if (
        WoodenTrapdoorBlock.isWoodenTrapdoorBlock(block) &&
        playerOption.getItemVal("trapdoor")
    ) {
        event.cancel = true
        const maxLength = playerOption.getItemVal("max_trapdoor_length")
        const trapdoors = (new WoodenTrapdoorBlock(block)).getRelated(maxLength)
        asyncRun(() => {
            if (trapdoors[0].opened) each(trapdoors, _ => _.close())
            else each(trapdoors, _ => _.open())
        })
    }
})
