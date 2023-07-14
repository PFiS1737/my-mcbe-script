import { world } from "@minecraft/server"

import { Commands } from "@/lib/commands/index.js"
import { each } from "@/util/index.js"

import { option } from "./option.js"
import { tpxCommand, backCommand, homeCommand } from "./command.js"

option.applyMainPlayer()
    .then(() => each(world.getAllPlayers(), player => option.applyPlayer(player)))
    .then(() => option.init())
    .then(optMap => {
        Commands.register("!", "tpx", tpxCommand)
        
        const values = Object.values(optMap)
        if (values.some(({ back_cmd }) => back_cmd)) Commands.register("!", "back", backCommand)
        if (values.some(({ home_cmd }) => home_cmd)) Commands.register("!", "home", homeCommand)
    })
    .catch(console.error)
