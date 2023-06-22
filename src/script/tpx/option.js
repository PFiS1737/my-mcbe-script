import { world } from "@minecraft/server"

import { optionManager } from "@/lib/option-manager/index.js"

import { setupHandler } from "./handler.js"

async function afterEntityDieCallback(event) {
    const player = event.deadEntity
    const handler = await setupHandler(player)
    
    await handler.SET({
        name: "__death__",
        option: {
            disposable: true,
            force: true
        }
    })
}

export const tpxOption = optionManager
    .registerNamesapace("tpx")
    .addItem({
        name: "auto_back_point",
        description: "允许使用 tpx 传送时自动添加返回点",
        values: [[true], [false]],
        defaultValue: true,
        events: {
            changed: (selected, original) => console.warn("auto_back_point -> from", original, "to", selected),
        }
    })
    .addItem({
        name: "back_after_death",
        description: "允许死亡时自动添加返回点",
        values: [[true], [false]],
        defaultValue: true,
        events: {
            changed: (selected, original) => {
                console.warn("back_after_death -> from", original, "to", selected)
                
                if (selected) world.afterEvents.entityDie.subscribe(afterEntityDieCallback, { entityTypes: [ "minecraft:player" ] })
                else world.afterEvents.entityDie.unsubscribe(afterEntityDieCallback)
            },
        }
    })
    .addItem({
        name: "back_cmd",
        description: "允许使用独立的 back 命令",
        values: [[true], [false]],
        defaultValue: false,
        reload: true,
        events: {
            changed: (selected, original) => console.warn("back_cmd -> from", original, "to", selected)
        }
    })
    .addItem({
        name: "home_cmd",
        description: "允许使用独立的 home 命令",
        values: [[true], [false]],
        defaultValue: false,
        reload: true,
        events: {
            changed: (selected, original) => console.warn("home_cmd -> from", original, "to", selected)
        }
    })