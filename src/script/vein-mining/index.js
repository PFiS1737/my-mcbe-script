import { world } from "@minecraft/server"

import { BetterConsole } from "@/lib/BetterConsole.class.js"
import { each } from "@/util/index.js"

import { option } from "./option.js"
import { setupListener } from "./event.js"

option.applyMainPlayer()
    .then(() => each(world.getAllPlayers(), player => option.applyPlayer(player)))
    .then(() => option.init())
    .then(() => setupListener())
    .catch(BetterConsole.error)
