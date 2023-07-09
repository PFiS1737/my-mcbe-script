import { Dimension, Entity, world, system, MinecraftDimensionTypes } from "@minecraft/server"

// import { Parser } from "mcbe-command-parser"

import { eachAsync } from "../util/index.js"

const overworld = world.getDimension(MinecraftDimensionTypes.overworld)

const CUSTOM_COMMAND_SET = new Set()

export class Commands {
    constructor() {}
    
    // static run(commandString, option = {}, target = overworld) {
    //     if (target instanceof Dimension || Entity) {
    //         if (option.safe) system.run(() => {
    //             target.runCommand(commandString)
    //         })
    //         else return target.runCommand(commandString)
    //     } else throw new TypeError("target must be Entity or Dimension.")
    // }
    static async asyncRun(commandString, target = overworld) {
        if (target instanceof Dimension || Entity) {
            const customCommands = [...CUSTOM_COMMAND_SET]
                .filter(({ regex }) => regex.test(commandString))
                .map(e => e.runner)
            if (customCommands.length) await eachAsync(customCommands, async runner => await runner(commandString, target))
            else return await target.runCommandAsync(commandString)
        }
        else throw new TypeError("target must be Entity or Dimension.")
    }
    static register(prefix, command, /* grammar, */ callback) {
        if (prefix.startsWith("/")) throw new Error("Unable to register slash commands.")
        
        const regex = new RegExp(`^${prefix}${command}( |$)`)
        const runner = async (commandString, target) => {
            // callback(new Parser(commandString, grammar), target)
            const argv = commandString
                .split(/(".*?"|[^"\s]+)+(?=\s*|\s*$)/g)
                .filter(e => e.trim().length > 0)
            await callback(argv, target)
        }
        
        CUSTOM_COMMAND_SET.add({ regex, runner })
        
        world.beforeEvents.chatSend.subscribe(event => {
            if (regex.test(event.message)) {
                event.cancel = true
                
                try { runner(event.message, event.sender) }
                catch (err) { throw err }
            }
        })
    }
}

export default Commands
