import {
  DisplaySlotId,
  GameMode,
  ObjectiveSortOrder,
  type Player,
  world,
} from "@minecraft/server"

import type { PlayerOption } from "@/lib/option-manager/PlayerOption.class"
import { WrappedPlayer } from "@/lib/wrapper/entity/index"
import {
  addMinecraftNamespaceIfNeed,
  asyncRun,
  getOrAddObjective,
} from "@/util/game"

import CRITERIA from "./criteria/index"
import { ALL_PLAYER_DATABASES, type EventDB, globalDB } from "./db"
import { option } from "./option"

export class Handler {
  player: Player
  playerOption: PlayerOption
  playerDB: EventDB

  constructor(player: Player) {
    this.player = player
    this.playerOption = option.getPlayer(player)

    const playerDB = ALL_PLAYER_DATABASES.get(player)

    if (!playerDB) throw new Error("Can't get player database.")

    this.playerDB = playerDB
  }

  async add({
    objectiveId,
    criteria,
    displayName = objectiveId,
  }: {
    objectiveId: string
    criteria: string
    displayName?: string
  }) {
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

  async remove({ objectiveId }: { objectiveId: string }) {
    if (!globalDB.get(objectiveId)) return false

    await asyncRun(() => world.scoreboard.removeObjective(objectiveId))
    await globalDB.delete(objectiveId)

    return true
  }

  async start({
    objectiveId,
    criteria = globalDB.get(objectiveId) as string,
  }: {
    objectiveId: string
    criteria?: string
  }) {
    if (this.playerDB.has(objectiveId)) return false

    const objective = getOrAddObjective(objectiveId)
    const [criteriaType, criteriaName] = parseCriteria(criteria)

    const setupTigger = CRITERIA.get(criteriaType)

    if (!setupTigger) throw new Error("Unknown criteria.")

    const tigger = setupTigger({
      player: this.player,
      target: criteriaName,
      callback: (result) => {
        if (
          !new WrappedPlayer(this.player).testGameMode(GameMode.creative) ||
          this.playerOption.getItemVal("enable_creative")
        ) {
          switch (result.type) {
            case "decrease": {
              if (this.playerOption.getItemVal("enable_cancel_out"))
                objective.setScore(
                  this.player,
                  (objective.getScore(this.player) ?? 0) - result.value
                )
              break
            }
            case "reset": {
              objective.setScore(this.player, result.value)
              break
            }
            default: {
              objective.addScore(this.player, result.value)
            }
          }
        }
      },
    })

    for (const [eventName, { options, listener }] of Object.entries(
      tigger.events
    )) {
      await asyncRun(() =>
        //@ts-ignore
        world.afterEvents[eventName].subscribe(listener, options)
      )
    }

    await this.playerDB.add(objectiveId, tigger.events)

    return true
  }

  async stop({ objectiveId }: { objectiveId: string }) {
    if (!this.playerDB.has(objectiveId)) return false

    const events = this.playerDB.getEvents(objectiveId)

    if (!events) throw new Error("Unexpected error.")

    for (const [eventName, { listener }] of Object.entries(events)) {
      await asyncRun(() =>
        //@ts-ignore
        world.afterEvents[eventName].unsubscribe(listener)
      )
    }
    await this.playerDB.delete(objectiveId)

    return true
  }
}

function parseCriteria(criteria: string) {
  return criteria
    .split(":")
    .map((e) => addMinecraftNamespaceIfNeed(e.replace(".", ":")))
}
