import { world } from "@minecraft/server"

import { BetterConsole } from "@/lib/BetterConsole.class"
import { DoorBlock, TrapdoorBlock } from "@/lib/wrapper/block/index"
import { asyncRun } from "@/util/game"

import { option } from "./option"

export const setupListener = () =>
  world.beforeEvents.itemUseOn.subscribe((event) => {
    const { block, source: player } = event
    const playerOption = option.getPlayer(player)

    const shouldBeTheSameType = playerOption.getItemVal(
      "should_be_the_same_type"
    )

    if (DoorBlock.match(block) && playerOption.getItemVal("door")) {
      event.cancel = true
      // @ts-ignore
      const doors = new DoorBlock(block).getRelated({ shouldBeTheSameType })
      asyncRun(() => {
        if (doors[0].opened) {
          for (const door of doors) door.close()
        } else {
          for (const door of doors) door.open()
        }
      }).catch(BetterConsole.error)
    } else if (
      TrapdoorBlock.match(block) &&
      playerOption.getItemVal("trapdoor")
    ) {
      event.cancel = true
      const maxLength = playerOption.getItemVal("max_trapdoor_length")
      // @ts-ignore
      const trapdoors = TrapdoorBlock.wrap(block).getRelated(player, {
        maxLength,
        shouldBeTheSameType,
      })
      asyncRun(() => {
        if (trapdoors[0].opened) {
          for (const trapdoor of trapdoors) trapdoor.close()
        } else {
          for (const trapdoor of trapdoors) trapdoor.open()
        }
      }).catch(BetterConsole.error)
    }
  })
