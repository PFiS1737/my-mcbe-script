import { EntityDamageCause } from "@minecraft/server"
import type { Criteria } from "../../../types"

export default (({ player, target, callback }) => ({
  events: {
    entityDie: {
      options: {
        entityTypes: [target],
      },
      listener(event) {
        const cause = event.damageSource.cause
        const source = event.damageSource.damagingEntity
        if (
          cause === EntityDamageCause.entityAttack &&
          source?.id === player.id
        )
          callback({
            type: "increase",
            value: 1,
          })
      },
    },
  },
})) as Criteria
