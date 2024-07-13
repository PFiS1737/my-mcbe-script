import { type Player, system, world } from "@minecraft/server"

export const sleepAsync = (ms: number): Promise<void> =>
  new Promise((resolve) => system.runTimeout(resolve, ms))

export function asyncRun<T>(fn: () => T): Promise<T> {
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

export function errorHandler(errText: string, target: Player) {
  const err = new Error(errText)
  target.sendMessage(err.toString())
  return err
}

export function waitForFirstPlayerInitialSpawn(): Promise<Player> {
  const players = world.getAllPlayers()
  if (players.length) return Promise.resolve(players[0])

  return new Promise((resolve) => {
    const callback = world.afterEvents.playerSpawn.subscribe((event) => {
      if (event.initialSpawn) resolve(event.player)
      world.afterEvents.playerSpawn.unsubscribe(callback)
    })
  })
}

export function getOrAddObjective(id: string, name?: string) {
  const objective = world.scoreboard.getObjective(id)

  if (!objective && !name) throw new Error(`Couldn't find objective "${id}".`)
  if (!objective) return world.scoreboard.addObjective(id, name)

  return objective
}

export function removeMinecraftNamespace(identifier: string) {
  return identifier.replace(/^minecraft\:/, "")
}

export function addMinecraftNamespaceIfNeed(identifier: string) {
  return /^(.+)\:/.test(identifier) ? identifier : `minecraft:${identifier}`
}
