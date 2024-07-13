import { type EntityDieAfterEvent, type Player, world } from "@minecraft/server"

import { optionManager } from "@/lib/option-manager/index"

import { Handler } from "./Handler.class"

async function afterEntityDieCallback(event: EntityDieAfterEvent) {
  const player = event.deadEntity as Player
  const handler = new Handler(player)

  await handler.set({
    name: "__death__",
    option: {
      disposable: true,
      force: true,
    },
  })
}

export const option = optionManager
  .registerNamesapace("tpx")
  .addItem({
    name: "auto_back_point",
    description: "允许使用 tpx 传送时自动添加返回点",
    values: [[true], [false]],
    defaultValue: true,
    events: {
      changed: (selected, original) =>
        console.warn("tpx:auto_back_point -> from", original, "to", selected),
    },
  })
  .addItem({
    name: "back_after_death",
    description: "允许死亡时自动添加死亡点",
    values: [[true], [false]],
    defaultValue: true,
    events: {
      changed: (selected, original) => {
        console.warn("tpx:back_after_death -> from", original, "to", selected)

        if (selected)
          world.afterEvents.entityDie.subscribe(afterEntityDieCallback, {
            entityTypes: ["minecraft:player"],
          })
        else world.afterEvents.entityDie.unsubscribe(afterEntityDieCallback)
      },
    },
  })
  .addItem({
    name: "back_cmd",
    description: "允许使用独立的 back 命令",
    values: [[true], [false]],
    defaultValue: false,
    reload: true,
    events: {
      changed: (selected, original) =>
        console.warn("tpx:back_cmd -> from", original, "to", selected),
    },
  })
  .addItem({
    name: "home_cmd",
    description: "允许使用独立的 home 命令",
    values: [[true], [false]],
    defaultValue: false,
    reload: true,
    events: {
      changed: (selected, original) =>
        console.warn("tpx:home_cmd -> from", original, "to", selected),
    },
  })
