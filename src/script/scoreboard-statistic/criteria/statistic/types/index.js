// import custom from "./custom/index.js"

import killed from "./mob/killed.js"
import killed_by from "./mob/killed_by.js"
import killed_for from "./mob/killed_for.js"

import mined from "./block/mined.js"
import placed from "./block/placed.js"

export const types = {
  // custom
  // TODO
  // "minecraft:custom": custom, custom,

  // mob
  "minecraft:killed": killed,
  killed,
  "minecraft:killed_by": killed_by,
  killed_by,
  "minecraft:killed_for": killed_for,
  killed_for, // not in vanilla

  // block
  "minecraft:mined": mined,
  mined,
  "minecraft:placed": placed,
  placed, // not in vanilla

  // item
  // TODO
}
