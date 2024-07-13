import type { Entity } from "@minecraft/server"
import type { Criteria } from "../../../types"

export default (({ player, target, callback }) => ({
  events: {
    entityDie: {
      options: {
        entities: [player as Entity],
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
})) as Criteria
