import { type Entity, EntityDamageCause } from "@minecraft/server"
import type { Criteria } from "../../../types"

export default (({ player, target, callback }) => ({
  events: {
    entityDie: {
      options: {
        entities: [player as Entity],
      },
      listener(event) {
        const cause = event.damageSource.cause
        const source = event.damageSource.damagingEntity
        if (
          cause === EntityDamageCause.entityAttack &&
          source?.typeId === target
        )
          callback({
            type: "increase",
            value: 1,
          })
      },
    },
  },
})) as Criteria
