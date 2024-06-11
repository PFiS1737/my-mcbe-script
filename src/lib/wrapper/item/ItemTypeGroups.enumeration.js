import { TypeGroup } from "../TypeGroup.class.js"

export const DIAMOND_PICKAXE_OR_UPPER = new TypeGroup([
  "minecraft:diamond_pickaxe",
  "minecraft:netherite_pickaxe",
])

export const IRON_PICKAXE_OR_UPPER = new TypeGroup([
  ...DIAMOND_PICKAXE_OR_UPPER,
  "minecraft:iron_pickaxe",
])

export const STONE_PICKAXE_OR_UPPER = new TypeGroup([
  ...IRON_PICKAXE_OR_UPPER,
  "minecraft:stone_pickaxe",
])

export const WOODEN_PICKAXE_OR_UPPER = new TypeGroup([
  ...STONE_PICKAXE_OR_UPPER,
  "minecraft:golden_pickaxe",
  "minecraft:wooden_pickaxe",
])
