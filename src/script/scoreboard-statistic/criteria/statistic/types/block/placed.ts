import type { Criteria } from "../../../types"

export default (({ player, target, callback }) => ({
  events: {
    playerBreakBlock: {
      listener(event) {
        const blockPermutation = event.brokenBlockPermutation
        const source = event.player
        if (source.id === player.id && blockPermutation.type.id === target)
          callback({
            type: "decrease",
            value: 1,
          })
      },
    },
    playerPlaceBlock: {
      listener(event) {
        const block = event.block
        const source = event.player
        if (source.id === player.id && block.typeId === target)
          callback({
            type: "increase",
            value: 1,
          })
      },
    },
  },
})) as Criteria
