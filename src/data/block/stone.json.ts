import { ItemTypeGroups } from "@/lib/wrapper/item/index"
import type { BlockConfig } from "./_types"

export default {
  drops: [
    {
      dig_by: ItemTypeGroups.WOODEN_PICKAXE_OR_UPPER.toArray(),

      raw: {
        item_id: "minecraft:cobblestone",
      },
      refined: {
        item_id: "minecraft:smooth_stone",
      },
    },
  ],
} as BlockConfig
