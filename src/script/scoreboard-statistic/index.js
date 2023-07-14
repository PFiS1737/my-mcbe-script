import { world } from "@minecraft/server"

import { Commands } from "@/lib/commands/index.js"
import { each, eachAsync } from "@/util/index.js"

import { option } from "./option.js"
import { command, setupListener } from "./command.js"
import { DB } from "./db.js"

option.applyMainPlayer()
    .then(() => each(world.getAllPlayers(), player => option.applyPlayer(player)))
    .then(() => option.init())
    .then(async () => {
        Commands.register("!", "scoreboard", command)
        
        await eachAsync(option.players, async ([ player ]) => {
            await eachAsync(DB.init(player).getAll(), async ({ criteria }, objectiveId) => {
                // reload 后运行时存储 events 为空，
                // 并且 listener 也都失效，
                // 故重新订阅事件
                await setupListener(objectiveId, criteria, player)
            })
        })
    })
    .catch(console.error)
