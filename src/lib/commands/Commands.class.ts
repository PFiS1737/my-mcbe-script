import {
  type Dimension,
  type Entity,
  MinecraftDimensionTypes,
  type Player,
  world,
} from "@minecraft/server"

import { BetterConsole } from "../BetterConsole.class"

export type CommandTarget = Player | Entity | Dimension
type CommandConfig = {
  regex: RegExp
  runner: (commandString: string, target: CommandTarget) => Promise<void>
}

const overworld = world.getDimension(MinecraftDimensionTypes.overworld)

const CUSTOM_COMMAND_SET = new Set<CommandConfig>()

export class Commands {
  static run(commandString: string, target: CommandTarget = overworld) {
    return target.runCommand(commandString)
  }
  static async asyncRun(
    commandString: string,
    target: CommandTarget = overworld
  ) {
    const customCommands = [...CUSTOM_COMMAND_SET]
      .filter(({ regex }) => regex.test(commandString))
      .map((e) => e.runner)
    if (customCommands.length) {
      for (const runner of customCommands) {
        await runner(commandString, target)
      }
    } else return await target.runCommandAsync(commandString)
  }
  static register(
    prefix: string,
    command: string,
    callback: (argv: string[], target: CommandTarget) => Promise<void>
  ) {
    if (prefix.startsWith("/"))
      throw new Error("Unable to register slash commands.")

    const regex = new RegExp(`^${prefix}${command}( |$)`)
    const runner: CommandConfig["runner"] = async (commandString, target) => {
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
