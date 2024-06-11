import { ItemTypeGroups } from "@/lib/wrapper/item/index.js"

export default {
  drops: [
    {
      dig_by: ItemTypeGroups.IRON_PICKAXE_OR_UPPER.toArray(),

      raw: {
        item_id: "minecraft:raw_gold",
      },
      refined: {
        item_id: "minecraft:gold_ingot",
      },

      fortune_rule: "ore",
    },
  ],
}
