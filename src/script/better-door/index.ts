import { world } from "@minecraft/server"

import { BetterConsole } from "@/lib/BetterConsole.class"

import { setupListener } from "./event"
import { option } from "./option"

option
  .applyMainPlayer()
  .then(() => {
    for (const player of world.getAllPlayers()) {
      option.applyPlayer(player)
    }
  })
  .then(() => option.init())
  .then(() => setupListener())
  .catch(BetterConsole.error)
