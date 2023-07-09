import { Commands } from "../commands/index.js"

import { optionCommand } from "./command.js"

Commands.register("!", "option", optionCommand)

export { optionManager } from "./manager.js"
