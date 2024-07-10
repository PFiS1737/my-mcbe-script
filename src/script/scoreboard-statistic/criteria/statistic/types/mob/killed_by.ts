import { EntityDamageCause } from "@minecraft/server"

export default ({ player, target, callback }) => ({
  events: {
    entityDie: {
      option: {
        entities: [player],
      },
      listener(event) {
        const cause = event.damageSource.cause
        const source = event.damageSource.damagingEntity
        if (
          cause === EntityDamageCause.entityAttack &&
          source.typeId === target
        )
          callback({
            type: "increase",
            value: 1,
          })
      },
    },
  },
})
