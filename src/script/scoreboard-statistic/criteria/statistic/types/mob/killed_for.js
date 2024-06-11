import { EntityDamageCause } from "@minecraft/server"

export default ({ player, target, callback }) => ({
  events: {
    entityDie: {
      option: {
        entities: [player],
      },
      listener(event) {
        const cause = `minecraft:${event.damageSource.cause}`
        if (cause === target)
          callback({
            type: "increase",
            value: 1,
          })
      },
    },
  },
})
