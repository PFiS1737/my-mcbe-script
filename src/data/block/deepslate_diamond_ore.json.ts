import { ItemTypeGroups } from "@/lib/wrapper/item/index"
import { type BlockConfig, FortuneRules } from "./types"

export default {
  drops: [
    {
      dig_by: ItemTypeGroups.IRON_PICKAXE_OR_UPPER.toArray(),

      raw: {
        item_id: "minecraft:diamond",
        xp_range: [3, 7],
      },

      fortune_rule: FortuneRules.Ore,
    },
  ],
} as BlockConfig
