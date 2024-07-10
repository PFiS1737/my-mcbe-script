import { world } from "@minecraft/server"

import { BetterConsole } from "@/lib/BetterConsole.class"
import { each } from "@/util/index"

import { setupListener } from "./event"
import { option } from "./option"

option
  .applyMainPlayer()
  .then(() =>
    each(world.getAllPlayers(), (player) => option.applyPlayer(player))
  )
  .then(() => option.init())
  .then(() => setupListener())
  .catch(BetterConsole.error)
