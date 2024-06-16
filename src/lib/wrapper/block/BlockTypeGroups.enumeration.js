import { TypeGroup } from "../TypeGroup.class.js"

export const WOODEN_DOORS = new TypeGroup([
  "minecraft:acacia_door",
  "minecraft:bamboo_door",
  "minecraft:birch_door",
  "minecraft:cherry_door",
  "minecraft:crimson_door",
  "minecraft:dark_oak_door",
  "minecraft:jungle_door",
  "minecraft:mangrove_door",
  "minecraft:spruce_door",
  "minecraft:warped_door",
  "minecraft:wooden_door",
])

export const COPPER_DOORS = new TypeGroup([
  "minecraft:copper_door",
  "minecraft:exposed_copper_door",
  "minecraft:weathered_copper_door",
  "minecraft:oxidized_copper_door",
  "minecraft:waxed_copper_door",
  "minecraft:waxed_exposed_copper_door",
  "minecraft:waxed_weathered_copper_door",
  "minecraft:waxed_oxidized_copper_door",
])

export const DOORS = new TypeGroup([
  ...WOODEN_DOORS,
  ...COPPER_DOORS,
  "minecraft:iron_door",
])

export const WOODEN_TRAPDOORS = new TypeGroup([
  "minecraft:acacia_trapdoor",
  "minecraft:bamboo_trapdoor",
  "minecraft:birch_trapdoor",
  "minecraft:cherry_trapdoor",
  "minecraft:crimson_trapdoor",
  "minecraft:dark_oak_trapdoor",
  "minecraft:jungle_trapdoor",
  "minecraft:mangrove_trapdoor",
  "minecraft:spruce_trapdoor",
  "minecraft:trapdoor",
  "minecraft:warped_trapdoor",
])

export const COPPER_TRAPDOORS = new TypeGroup([
  "minecraft:copper_trapdoor",
  "minecraft:exposed_copper_trapdoor",
  "minecraft:weathered_copper_trapdoor",
  "minecraft:oxidized_copper_trapdoor",
  "minecraft:waxed_copper_trapdoor",
  "minecraft:waxed_exposed_copper_trapdoor",
  "minecraft:waxed_weathered_copper_trapdoor",
  "minecraft:waxed_oxidized_copper_trapdoor",
])

export const TRAPDOORS = new TypeGroup([
  ...WOODEN_TRAPDOORS,
  ...COPPER_TRAPDOORS,
  "minecraft:iron_trapdoor",
])

export const LOGS = new TypeGroup([
  "minecraft:acacia_log",
  "minecraft:birch_log",
  "minecraft:cherry_log",
  "minecraft:dark_oak_log",
  "minecraft:jungle_log",
  "minecraft:mangrove_log",
  "minecraft:oak_log",
  "minecraft:spruce_log ",
])

export const STEMS = new TypeGroup([
  "minecraft:crimson_stem",
  "minecraft:warped_stem",
])

export const ORES = new TypeGroup([
  "minecraft:coal_ore",
  "minecraft:copper_ore",
  "minecraft:deepslate_coal_ore",
  "minecraft:deepslate_copper_ore",
  "minecraft:deepslate_diamond_ore",
  "minecraft:deepslate_emerald_ore",
  "minecraft:deepslate_gold_ore",
  "minecraft:deepslate_iron_ore",
  "minecraft:deepslate_lapis_ore",
  "minecraft:deepslate_redstone_ore",
  "minecraft:diamond_ore",
  "minecraft:emerald_ore",
  "minecraft:gold_ore",
  "minecraft:iron_ore",
  "minecraft:lapis_ore",
  "minecraft:nether_gold_ore",
  "minecraft:quartz_ore",
  "minecraft:redstone_ore",
])

export const STONES = new TypeGroup(["minecraft:stone", "minecraft:deepslate"])
