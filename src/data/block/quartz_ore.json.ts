import { ItemTypeGroups } from "@/lib/wrapper/item/index"
import { type BlockConfig, FortuneRules } from "./types"

export default {
  drops: [
    {
      dig_by: ItemTypeGroups.WOODEN_PICKAXE_OR_UPPER.toArray(),

      raw: {
        item_id: "minecraft:quartz",
        xp_range: [2, 5],
      },

      fortune_rule: FortuneRules.Ore,
    },
  ],
} as BlockConfig
