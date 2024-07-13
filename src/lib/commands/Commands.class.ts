import {
  Dimension,
  Entity,
  MinecraftDimensionTypes,
  type Player,
  world,
} from "@minecraft/server"

import { BetterConsole } from "../BetterConsole.class"

type CommandConfig = {
  regex: RegExp
  runner: (commandString: string, target: Player) => Promise<void>
}

const overworld = world.getDimension(MinecraftDimensionTypes.overworld)

const CUSTOM_COMMAND_SET = new Set<CommandConfig>()

export class Commands {
  static run(commandString: string, target: Entity | Dimension = overworld) {
    if (target instanceof Dimension || target instanceof Entity)
      return target.runCommand(commandString)
    throw new TypeError("Target must be Entity or Dimension.")
  }
  static async asyncRun(
    commandString: string,
    target: Entity | Dimension = overworld
  ) {
    if (target instanceof Dimension || target instanceof Entity) {
      const customCommands = [...CUSTOM_COMMAND_SET]
        .filter(({ regex }) => regex.test(commandString))
        .map((e) => e.runner)
      if (customCommands.length) {
        for (const runner of customCommands) {
          // FIXME: enable entity and dimension to be the target
          await runner(commandString, target)
        }
      } else return await target.runCommandAsync(commandString)
    } else throw new TypeError("Target must be Entity or Dimension.")
  }
  static register(
    prefix: string,
    command: string,
    callback: (argv: string[], target: Player) => Promise<void>
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
