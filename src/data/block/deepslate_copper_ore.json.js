import { ItemTypeGroups } from "@/lib/wrapper/item/index.js"

export default {
  drops: [
    {
      dig_by: ItemTypeGroups.STONE_PICKAXE_OR_UPPER.toArray(),

      raw: {
        item_id: "minecraft:raw_copper",
        default_range: [2, 5],
      },
      refined: {
        item_id: "minecraft:copper_ingot",
      },

      fortune_rule: "ore",
    },
  ],
}
