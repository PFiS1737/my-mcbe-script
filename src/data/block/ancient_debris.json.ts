import { ItemTypeGroups } from "@/lib/wrapper/item/index"
import type { BlockConfig } from "./types"

export default {
  drops: [
    {
      dig_by: ItemTypeGroups.DIAMOND_PICKAXE_OR_UPPER.toArray(),

      raw: {
        item_id: "minecraft:ancient_debris",
      },
      refined: {
        item_id: "minecraft:netherite_scrap",
      },
    },
  ],
} as BlockConfig
