import type { Player } from "@minecraft/server"

import { Commands } from "../commands/index"
import { asyncRun, errorHandler } from "../util/game"
import { optionManager } from "./manager"

Commands.register("!", "option", async (argv, sender) => {
  switch (argv[1]) {
    case "dialog":
    case "-d":
    case undefined: {
      // TODO: argv[2] -> namespace
      await asyncRun(() => optionManager.showDialog(sender as Player))
      break
    }
    default: {
      throw errorHandler("未知的子命令", sender as Player)
    }
  }
})
