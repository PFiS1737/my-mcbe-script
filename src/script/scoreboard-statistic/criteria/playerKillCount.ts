import killed from "./statistic/types/mob/killed"
import type { Criteria } from "./types"

export default ({ player, callback }: Parameters<Criteria>[0]) =>
  killed({
    player,
    target: "minecraft:player",
    callback,
  })
