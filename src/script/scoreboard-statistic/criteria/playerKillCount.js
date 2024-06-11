import killed from "./statistic/types/mob/killed.js"

export default ({ player, callback }) =>
  killed({
    player,
    target: "minecraft:player",
    callback,
  })
