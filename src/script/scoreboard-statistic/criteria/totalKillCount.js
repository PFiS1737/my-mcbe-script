import { EntityDamageCause } from "@minecraft/server"

export default ({ player, callback }) => ({
  events: {
    entityDie: {
      listener(event) {
        const cause = event.damageSource.cause
        const source = event.damageSource.damagingEntity
        if (cause === EntityDamageCause.entityAttack && source.id === player.id)
          callback({
            type: "increase",
            value: 1,
          })
      },
    },
  },
})
