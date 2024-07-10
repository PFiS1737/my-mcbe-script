import killed from "./statistic/types/mob/killed"

export default ({ player, callback }) =>
  killed({
    player,
    target: "minecraft:player",
    callback,
  })
