import { ItemTypeGroups } from "@/lib/wrapper/item/index.js"

export default {
  drops: [
    {
      dig_by: ItemTypeGroups.WOODEN_PICKAXE_OR_UPPER.toArray(),

      raw: {
        item_id: "minecraft:gold_nugget",
        default_range: [2, 6],
        xp_range: [0, 1],
      },
      refined: {
        item_id: "minecraft:gold_ingot",
      },

      fortune_rule: "ore",
    },
  ],
}
