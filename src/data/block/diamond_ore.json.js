import { ItemTypeGroups } from "@/lib/wrapper/item/index.js"

export default {
  drops: [
    {
      dig_by: ItemTypeGroups.IRON_PICKAXE_OR_UPPER.toArray(),

      raw: {
        item_id: "minecraft:diamond",
        xp_range: [3, 7],
      },

      fortune_rule: "ore",
    },
  ],
}
