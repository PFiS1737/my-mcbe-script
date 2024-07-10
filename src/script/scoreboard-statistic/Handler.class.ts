import {
  DisplaySlotId,
  GameMode,
  ObjectiveSortOrder,
  world,
} from "@minecraft/server"

import { WrappedPlayer } from "@/lib/wrapper/entity/index"
import { asyncRun, getOrAddObjective } from "@/util/game"
import { eachAsync } from "@/util/index"

import { ALL_PLAYER_DATABASES, globalDB } from "./db"
import { option } from "./option"

import CRITERIA from "./criteria/index"

export class Handler {
  constructor(player) {
    this.player = player
    this.playerOption = option.getPlayer(player)
    this.playerDB = ALL_PLAYER_DATABASES.get(player)
  }

  async add({ objectiveId, criteria, displayName = objectiveId }) {
    if (world.scoreboard.getObjective(objectiveId))
      return { code: 0, message: "DUPLICATE_OBJECTIVE" }

    const [criteriaType] = parseCriteria(criteria)
    if (!CRITERIA.get(criteriaType))
      return { code: 0, message: "UNKNOWN_CRITERIA" }

    await asyncRun(() => {
      const objective = world.scoreboard.addObjective(objectiveId, displayName)
      world.scoreboard.setObjectiveAtDisplaySlot(DisplaySlotId.Sidebar, {
        objective,
        sortOrder: ObjectiveSortOrder.Ascending,
      })

      if (!objective.hasParticipant(this.player)) {
        // TODO: 或许放到 start 里更合理
        // 如果该玩家不存在任何一个记分板中，直接 setScore(this.player) 会报错
        // 所以这里用命令设置一下初始分数
        // objective.setScore(this.player, 0)
        this.player.runCommand(`scoreboard players set @s ${objectiveId} 0`)
      }
    })

    await globalDB.set(objectiveId, criteria)

    return { code: 1 }
  }
  async remove({ objectiveId }) {
    if (!globalDB.get(objectiveId)) return false

    await asyncRun(() => world.scoreboard.removeObjective(objectiveId))
    await globalDB.delete(objectiveId)

    return true
  }
  async start({ objectiveId, criteria = globalDB.get(objectiveId) }) {
    if (this.playerDB.has(objectiveId)) return false

    const objective = getOrAddObjective(objectiveId)
    const [criteriaType, criteriaName] = parseCriteria(criteria)

    const setupTigger = CRITERIA.get(criteriaType)
    const tigger = setupTigger({
      player: this.player,
      target: criteriaName,
      callback: (result) => {
        if (
          // @ts-ignore
          !WrappedPlayer.wrap(this.player).testGameMode(GameMode.creative) ||
          this.playerOption.getItemVal("enable_creative")
        ) {
          switch (result.type) {
            case "decrease": {
              if (this.playerOption.getItemVal("enable_cancel_out"))
                objective.setScore(
                  this.player,
                  objective.getScore(this.player) - result.value
                )
              break
            }
            case "reset": {
              objective.setScore(this.player, result.value)
              break
            }
            default: {
              // TODO: scoreboard wrapper #addScore()
              objective.setScore(
                this.player,
                objective.getScore(this.player) + result.value
              )
            }
          }
        }
      },
    })

    await eachAsync(
      tigger.events,
      async ({ option: subscribeOption, listener }, eventName) => {
        if (subscribeOption)
          await asyncRun(() =>
            world.afterEvents[eventName].subscribe(listener, subscribeOption)
          )
        else
          await asyncRun(() => world.afterEvents[eventName].subscribe(listener)) // 为什么多传参数还报错啊啊啊啊啊啊啊！！！
      }
    )

    await this.playerDB.add(objectiveId, tigger.events)

    return true
  }
  async stop({ objectiveId }) {
    if (!this.playerDB.has(objectiveId)) return false

    const events = this.playerDB.getEvents(objectiveId)
    await eachAsync(events, async ({ listener }, eventName) => {
      await asyncRun(() => world.afterEvents[eventName].unsubscribe(listener))
    })
    await this.playerDB.delete(objectiveId)

    return true
  }
}

function parseCriteria(criteria) {
  return criteria
    .split(":")
    .map((e) => e.replace(".", ":"))
    .map((e, i) => {
      if (i === 0) return e
      return e.match(/^(.+)\:/) ? e : `minecraft:${e}`
    })
}
