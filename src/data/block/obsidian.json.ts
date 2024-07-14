import { ItemTypeGroups } from "@/lib/wrapper/item/index"
import type { BlockConfig } from "./_types"

export default {
  drops: [
    {
      dig_by: ItemTypeGroups.DIAMOND_PICKAXE_OR_UPPER.toArray(),

      raw: {
        item_id: "minecraft:obsidian",
      },
    },
  ],
} as BlockConfig
