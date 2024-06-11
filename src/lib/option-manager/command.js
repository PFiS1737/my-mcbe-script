import { Commands } from "../commands/index.js"
import { asyncRun, errorHandler } from "../util/game.js"

import { optionManager } from "./manager.js"

Commands.register("!", "option", async (argv, sender) => {
  switch (argv[1]) {
    case "dialog":
    case "-d":
    case undefined: {
      // TODO argv[2] -> namespace
      await asyncRun(() => optionManager.showDialog(sender))
      break
    }
    default: {
      throw errorHandler("未知的子命令", sender)
    }
  }
})
