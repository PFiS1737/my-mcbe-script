import {
  Dimension,
  Entity,
  MinecraftDimensionTypes,
  world,
} from "@minecraft/server"

// import { Parser } from "mcbe-command-parser"

import { BetterConsole } from "../BetterConsole.class"
import { eachAsync } from "../util/index"

const overworld = world.getDimension(MinecraftDimensionTypes.overworld)

const CUSTOM_COMMAND_SET = new Set()

export class Commands {
  static run(commandString, target = overworld) {
    // @ts-ignore
    if (target instanceof Dimension || target instanceof Entity)
      return target.runCommand(commandString)
    throw new TypeError("Target must be Entity or Dimension.")
  }
  static async asyncRun(commandString, target = overworld) {
    // @ts-ignore
    if (target instanceof Dimension || target instanceof Entity) {
      const customCommands = [...CUSTOM_COMMAND_SET]
        .filter(({ regex }) => regex.test(commandString))
        .map((e) => e.runner)
      if (customCommands.length)
        await eachAsync(
          customCommands,
          async (runner) => await runner(commandString, target)
        )
      else return await target.runCommandAsync(commandString)
    } else throw new TypeError("Target must be Entity or Dimension.")
  }
  static register(prefix, command, /* grammar, */ callback) {
    if (prefix.startsWith("/"))
      throw new Error("Unable to register slash commands.")

    const regex = new RegExp(`^${prefix}${command}( |$)`)
    const runner = async (commandString, target) => {
      // callback(new Parser(commandString, grammar), target)
      const argv = commandString
        .split(/(".*?"|[^"\s]+)+(?=\s*|\s*$)/g)
        .filter((e) => e.trim().length > 0)
      await callback(argv, target)
    }

    CUSTOM_COMMAND_SET.add({ regex, runner })

    world.beforeEvents.chatSend.subscribe((event) => {
      if (regex.test(event.message)) {
        event.cancel = true

        runner(event.message, event.sender).catch(BetterConsole.error)
      }
    })
  }
}

export default Commands
