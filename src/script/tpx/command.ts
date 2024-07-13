import { Commands } from "@/lib/commands/index"
import { asyncRun, errorHandler } from "@/util/game"
import type { Player } from "@minecraft/server"
import { Handler } from "./Handler.class"
import { option } from "./option"

const SUB_COMMANDS = [
  "set",
  "-s",
  "remove",
  "rm",
  "-r",
  "back",
  "bk",
  "-b",
  "list",
  "ls",
  "-l",
  "help",
  "-h",
  "option",
  "opt",
  "-o",
]

export async function tpxCommand(argv: string[], sender: Player) {
  const name = argv[2] ?? "default"
  const handler = new Handler(sender)

  switch (argv[1]) {
    case "set":
    case "-s": {
      if (SUB_COMMANDS.includes(name) || name === "__back__")
        throw errorHandler(`添加失败：不能使用 ${name} 作为名称`, sender)

      const result = await handler.set({
        name,
        option: {
          disposable:
            argv[3] === "true" ? true : argv[3] === "false" ? false : undefined,
        },
      })

      if (result) sender.sendMessage(`成功设置 ${name} 在 ${result.info}`)

      break
    }
    case "remove":
    case "rm":
    case "-r": {
      const result = await handler.remove({ name })

      if (result === true) sender.sendMessage(`成功删除 ${name}`)
      else if (result === false)
        throw errorHandler(`删除失败：未找到 ${name}`, sender)

      break
    }
    case "back":
    case "bk":
    case "-b": {
      const result = await handler.tryTeleport({
        names: ["__death__", "__back__"],
      })

      if (result) sender.sendMessage(`已返回到 ${result.info}`)
      else throw errorHandler("传送失败：未找到返回点", sender)

      break
    }
    case "list":
    case "ls":
    case "-l": {
      const result = handler.list()

      if (result) {
        result.msg.unshift("您的传送点有：")
        sender.sendMessage(result.msg.join("\n- "))
      } else sender.sendMessage("您目前没有传送点")

      break
    }
    case "help":
    case "-h": {
      // TODO command-parser
      sender.sendMessage("制作中...")
      break
    }
    case "option":
    case "opt":
    case "-o": {
      await asyncRun(() => option.getPlayer(sender).showDialog())
      break
    }
    default: {
      const result = await handler.teleport({ name: argv[1] })

      if (result) sender.sendMessage(`已传送到 ${result.info}`)
      else throw errorHandler(`传送失败：未找到传送点 ${argv[1]}`, sender)
    }
  }
}

export async function backCommand(_: string[], sender: Player) {
  if (option.getPlayer(sender).getItemVal("back_cmd"))
    await Commands.asyncRun("!tpx back", sender)
  else sender.sendMessage("您未启用该命令")
}

export async function homeCommand(argv: string[], sender: Player) {
  if (option.getPlayer(sender).getItemVal("home_cmd")) {
    switch (argv[1]) {
      case "set": {
        await Commands.asyncRun("!tpx set __home__", sender)
        break
      }
      default: {
        await Commands.asyncRun("!tpx __home__", sender)
      }
    }
  } else sender.sendMessage("您未启用该命令")
}
