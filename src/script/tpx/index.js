import { world } from "@minecraft/server"

import { BetterConsole } from "@/lib/BetterConsole.class.js"
import { Commands } from "@/lib/commands/index.js"
import { each } from "@/util/index.js"

import { backCommand, homeCommand, tpxCommand } from "./command.js"
import { TpxDB } from "./db.js"
import { option } from "./option.js"

option
  .applyMainPlayer()
  .then(() =>
    each(world.getAllPlayers(), (player) => option.applyPlayer(player))
  )
  .then(() => option.init())
  .then((optMap) => {
    // 将所有玩家的数据库实例化并储存在 ALL_PLAYER_DATABASES 中
    // 同时避免在 beforeEvent 中构建导致的 read-only mode 问题
    const players = optMap.keys()
    each(players, (player) => TpxDB.init(player))

    Commands.register("!", "tpx", tpxCommand)

    const values = [...optMap.values()]
    if (values.some(({ back_cmd }) => back_cmd))
      Commands.register("!", "back", backCommand)
    if (values.some(({ home_cmd }) => home_cmd))
      Commands.register("!", "home", homeCommand)
  })
  .catch(BetterConsole.error)
