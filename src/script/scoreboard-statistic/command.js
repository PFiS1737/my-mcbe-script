import {
    world,
    DisplaySlotId,
    ObjectiveSortOrder,
    ScoreboardObjective,
    GameMode
} from "@minecraft/server"

import { Commands } from "@/lib/commands/index.js"
import { Dialog } from "@/lib/dialog/index.js"
import { WrappedPlayer } from "@/lib/wrapper/entity/index.js"
import { eachAsync } from "@/util/index.js"
import { asyncRun, errorHandler, getOrAddObjective } from "@/util/game.js"

import { option } from "./option.js"
import { ALL_DATABASES } from "./db.js"

import CRITERIA from "./criteria/index.js"

export async function command(argv, sender) {
    if (argv[1] !== "objectives") throw errorHandler("仅支持 objectives 子命令", sender)
    
    const playerDB = ALL_DATABASES.get(sender)
    const playerOption = option.getPlayer(sender)
    
    switch (argv[2]) {
        case "add": {
            if (!playerOption.getItemVal("enable_creative")) sender.sendMessage("注意：当前设置不会统计创造模式下的行为")
            
            const [ , , , objectiveId, criteria, displayName ] = argv
            if (!objectiveId) throw errorHandler("objectiveId 是必须的", sender)
            if (!criteria) throw errorHandler("criteria 是必须的", sender)
            
            if (playerDB.has(objectiveId)) throw errorHandler("添加失败：您已位于该记分板", sender)
            
            const objective = await asyncRun(() => {
                const _objective = getOrAddObjective(objectiveId, displayName || objectiveId)
                world.scoreboard.setObjectiveAtDisplaySlot(DisplaySlotId.Sidebar, {
                    objective: _objective,
                    sortOrder: ObjectiveSortOrder.Ascending
                })
                return _objective
            })
            
            // 如果该玩家不存在任何一个记分板中，直接 setScore(sender) 会报错
            // 所以这里设置一下初始分数
            if (!objective.hasParticipant(sender))
                await Commands.asyncRun(`scoreboard players set @s ${objectiveId} 0`, sender)
            
            await setupListener(objective, criteria, sender)
            sender.sendMessage(`成功设置 "${displayName}" 使用 "${criteria}"`)
            
            break
        }
        case "remove": {
            const objectiveId = argv[3]
            
            if (!playerDB.has(objectiveId)) throw errorHandler("移除失败：您并不位于该记分板", sender)
            
            const objective = getOrAddObjective(objectiveId)
            const { events } = playerDB.get(objectiveId)
            
            async function _remove() {
                await eachAsync(events, async ({ listener }, eventName) => {
                    await asyncRun(() => world.afterEvents[eventName].unsubscribe(listener))
                })
                objective.removeParticipant(sender)
                if (objective.getParticipants()) world.scoreboard.removeObjective(objective)
                
                await playerDB.delete(objectiveId)
                
                sender.sendMessage("删除成功")
            }
            
            if (playerOption.getItemVal("enable_confirm")) await Dialog.confirm({
                body: `是否清除你在 ${objectiveId} 上的统计数据，你将永远失去它们`,
                target: sender,
                onConfirm: _remove
            })
            else await _remove()
            
            break
        }
        default: {
            throw errorHandler(`未知的子命令 objectives ${argv[2]}`, sender)
        }
    }
}

export async function setupListener(objectiveId, criteria, sender) {
    const [ criteriaType, criteriaName ] = criteria
        .split(":")
        .map(e => e.replace(".", ":"))
        .map((e, i) => {
            if (i === 0) return e
            return e.match(/^(.+)\:/) ? e : `minecraft:${e}`
        })
    const objective = objectiveId instanceof ScoreboardObjective
        ? objectiveId
        : getOrAddObjective(objectiveId)
    
    const setupTigger = CRITERIA.get(criteriaType)
    if (setupTigger) {
        const playerDB = ALL_DATABASES.get(sender)
        const playerOption = option.getPlayer(sender)
        const wrappedPlayer = new WrappedPlayer(sender)
        
        const tigger = setupTigger({
            player: sender,
            target: criteriaName,
            async callback(result) {
                if (
                    !wrappedPlayer.testGameMode(GameMode.creative) ||
                    playerOption.getItemVal("enable_creative")
                ) {
                    switch (result.type) {
                        case "decrease": {
                            if (playerOption.getItemVal("enable_cancel_out"))
                                objective.setScore(sender, objective.getScore(sender) - result.value)
                            break
                        }
                        case "reset": {
                            objective.setScore(sender, result.value)
                            break
                        }
                        case "increase":
                        case undefined:
                        default: {
                            // TODO: scoreboard wrapper #addScore()
                            objective.setScore(sender, objective.getScore(sender) + result.value)
                        }
                    }
                }
            }
        })
        
        await eachAsync(tigger.events, async ({ option: subscribeOption, listener }, eventName) => {
            if (subscribeOption) await asyncRun(() => world.afterEvents[eventName].subscribe(listener, subscribeOption))
            else await asyncRun(() => world.afterEvents[eventName].subscribe(listener))  // 为什么多传参数还报错啊啊啊啊啊啊啊！！！
        })
        
        await playerDB.set(objective.id, criteria, tigger.events)
    } else {
        throw errorHandler(`未知的准则：${criteria}`, sender)
    }
}
