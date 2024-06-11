import { TypeGroup } from "@/lib/wrapper/TypeGroup.class.js"
import { BlockTypeGroups } from "@/lib/wrapper/block/index.js"

export const ENABLE_BLOCKS = new TypeGroup([
  ...BlockTypeGroups.LOGS,
  ...BlockTypeGroups.STEMS,
  ...BlockTypeGroups.ORES,
  "minecraft:obsidian",
  "minecraft:ancient_debris",
  "minecraft:amethyst_block",
])
