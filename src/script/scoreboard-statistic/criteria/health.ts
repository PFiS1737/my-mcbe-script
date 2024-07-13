import type { Entity } from "@minecraft/server"
import type { Criteria } from "./types"

export default (({ player, callback }) => ({
  events: {
    entityHealthChanged: {
      options: {
        entities: [player as Entity],
      },
      listener(event) {
        callback({
          type: "reset",
          value: event.newValue,
        })
      },
    },
    playerSpawn: {
      listener(_) {
        callback({
          type: "reset",
          value: 20,
        })
      },
    },
  },
})) as Criteria
