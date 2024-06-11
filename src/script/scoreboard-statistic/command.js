import { Dialog } from "@/lib/dialog/index.js"
import { asyncRun, errorHandler } from "@/util/game.js"

import { Handler } from "./Handler.class.js"
import { option } from "./option.js"

export async function command(argv, sender) {
  const playerOption = option.getPlayer(sender)
  const handler = new Handler(sender)

  const objectiveId = argv[2]
  switch (argv[1]) {
    case "add": {
      const [, , , criteria, displayName] = argv
      if (!objectiveId) throw errorHandler("objectiveId 是必须的", sender)
      if (!criteria) throw errorHandler("criteria 是必须的", sender)

      if (!playerOption.getItemVal("enable_creative"))
        sender.sendMessage("注意：当前设置不会统计创造模式下的行为")

      const result = await handler.add({ objectiveId, criteria, displayName })
      if (result.code)
        sender.sendMessage(
          `成功添加记分板 "${displayName}" (${objectiveId}) 使用 "${criteria}"`
        )
      else {
        switch (result.message) {
          case "DUPLICATE_OBJECTIVE": {
            throw errorHandler(`添加失败：记分板 ${objectiveId} 已存在`, sender)
          }
          case "UNKNOWN_CRITERIA": {
            throw errorHandler(`添加失败：未知的准则 ${criteria}`, sender)
          }
        }
      }

      if (playerOption.getItemVal("auto_start")) {
        const startResult = await handler.start({ objectiveId, criteria })
        if (startResult)
          sender.sendMessage(`已自动开启您在 ${displayName} 上的统计`)
      }

      break
    }
    case "remove":
    case "rm":
    case "-r": {
      async function _remove() {
        const result = await handler.remove({ objectiveId })
        if (result) sender.sendMessage(`删除成功 ${objectiveId}`)
        else
          throw errorHandler(
            `移除失败：记分板 ${objectiveId} 不存在或不是统计用记分板`,
            sender
          )
      }

      if (playerOption.getItemVal("enable_confirm_dialog"))
        await Dialog.confirm({
          body: `是否清除记分板 ${objectiveId} 上的统计数据，你将永远失去它们`,
          target: sender,
          onConfirm: _remove,
        })
      else await _remove()

      break
    }
    case "stop": {
      const result = await handler.stop({ objectiveId })

      if (result) sender.sendMessage(`已暂停您在 ${objectiveId} 上的统计`)
      else
        throw errorHandler(
          `暂停失败：您可能没有开启您在记分板 ${objectiveId} 上的统计，或该记分板不存在`,
          sender
        )

      break
    }
    case "start": {
      const result = await handler.start({ objectiveId })

      if (result) sender.sendMessage(`已开启您在 ${objectiveId} 上的统计`)
      else
        throw errorHandler(
          `开启失败：您可能已经开启您在记分板 ${objectiveId} 上的统计，或该记分板不存在`,
          sender
        )

      break
    }
    case "option":
    case "opt":
    case "-o": {
      await asyncRun(() => playerOption.showDialog())
      break
    }
    default: {
      throw errorHandler(`未知的子命令 ${argv[1]}`, sender)
    }
  }
}
