import { world } from "@minecraft/server"

import Commands from "@/lib/commands/index.js"
import { each } from "@/util/index.js"

import { tpxOption } from "./option.js"
import { tpxCommand, backCommand, homeCommand } from "./command.js"

tpxOption.applyMainPlayer()
    .then(() => each(world.getAllPlayers(), player => tpxOption.applyPlayer(player)))
    .then(() => tpxOption.init())
    .then(optMap => {
        Commands.register("!", "tpx", tpxCommand)
        
        const values = Object.values(optMap)
        if (values.some(({ enable_back_cmd }) => enable_back_cmd)) Commands.register("!", "back", backCommand)
        if (values.some(({ enable_home_cmd }) => enable_home_cmd)) Commands.register("!", "home", homeCommand)
    })
    .catch(console.error)