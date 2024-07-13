import type { Entity } from "@minecraft/server"
import type { Criteria } from "./types"

export default (({ player, callback }) => ({
  events: {
    entityDie: {
      options: {
        entities: [player as Entity],
      },
      listener(_) {
        callback({
          type: "increase",
          value: 1,
        })
      },
    },
  },
})) as Criteria
