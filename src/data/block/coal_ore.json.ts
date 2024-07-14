import { ItemTypeGroups } from "@/lib/wrapper/item/index"
import { type BlockConfig, FortuneRules } from "./_types"

export default {
  drops: [
    {
      dig_by: ItemTypeGroups.WOODEN_PICKAXE_OR_UPPER.toArray(),

      raw: {
        item_id: "minecraft:coal",
        xp_range: [0, 2],
      },

      fortune_rule: FortuneRules.Ore,
    },
  ],
} as BlockConfig
