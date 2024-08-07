import { ItemTypeGroups } from "@/lib/wrapper/item/index"
import { type BlockConfig, FortuneRules } from "./_types"

export default {
  drops: [
    {
      dig_by: ItemTypeGroups.STONE_PICKAXE_OR_UPPER.toArray(),

      raw: {
        item_id: "minecraft:lapis_lazuli",
        default_range: [4, 9],
        xp_range: [2, 5],
      },

      fortune_rule: FortuneRules.Ore,
    },
  ],
} as BlockConfig
