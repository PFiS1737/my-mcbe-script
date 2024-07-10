import { TypeGroup } from "@/lib/wrapper/TypeGroup.class"
import { BlockTypeGroups } from "@/lib/wrapper/block/index"

export const ENABLE_BLOCKS = new TypeGroup([
  ...BlockTypeGroups.LOGS,
  ...BlockTypeGroups.STEMS,
  ...BlockTypeGroups.ORES,
  "minecraft:obsidian",
  "minecraft:ancient_debris",
  "minecraft:amethyst_block",
])
