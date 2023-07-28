import { world,system } from "@minecraft/server"

export const sleepAsync = ms => new Promise(resolve => system.runTimeout(resolve, ms))

export function asyncRun(fn) {
    return new Promise((resolve, reject) => {
        system.run(() => {
            try {
                resolve(fn())
            } catch (err) {
                reject(err)
            }
        })
    })
}

export function errorHandler(errText, target) {
    const err = new Error(errText)
    target.sendMessage(err.toString())
    return err
}

export function waitForFirstPlayerInitialSpawn() {
    const players = world.getAllPlayers()
    if (players.length) return Promise.resolve(players[0])
    else return new Promise(resolve => {
        const callback = world.afterEvents.playerSpawn.subscribe(event => {
            if (event.initialSpawn) resolve(event.player)
            world.afterEvents.playerSpawn.unsubscribe(callback)
        })
    })
}

export function getOrAddObjective(id, name) {
    const objective = world.scoreboard.getObjective(id)
    if (!objective && !name) throw new Error(`Couldn't find objective "${id}".`)
    else if (!objective) return world.scoreboard.addObjective(id, name)
    else return objective
}

export function removeMinecraftNamespace(identifier) {
    return identifier.replace(/^minecraft\:/, "")
}

export function addMinecraftNamespaceIfNeed(identifier) {
    return /^(.+)\:/.test(identifier)
        ? identifier
        : "minecraft:" + identifier
}
