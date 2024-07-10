import { world } from "@minecraft/server"

import { BetterConsole } from "@/lib/BetterConsole.class"
import { Commands } from "@/lib/commands/index"
import { each, eachAsync } from "@/util/index"

import { Handler } from "./Handler.class"
import { command } from "./command"
import { EventDB } from "./db"
import { option } from "./option"

option
  .applyMainPlayer()
  .then(() =>
    each(world.getAllPlayers(), (player) => option.applyPlayer(player))
  )
  .then(() => option.init())
  .then(async () => {
    await eachAsync(option.players, async ([player]) => {
      // 将所有玩家的数据库实例化并储存在 ALL_PLAYER_DATABASES 中
      const db = EventDB.init(player)

      const handler = new Handler(player)
      const participated = db.getParticipated()

      // reload 后运行时存储 events 为空，
      // 并且 listener 也都失效，
      // 故重新订阅事件
      await db.clear()
      await eachAsync(participated, async (objectiveId) => {
        const result = await handler.start({ objectiveId })
        if (result)
          player.sendMessage(`已重启您在记分板 ${objectiveId} 上的统计`)
      })
    })

    Commands.register("!", "statistic", command)
  })
  .catch(BetterConsole.error)
