import { ItemTypeGroups } from "@/lib/wrapper/item/index.js"

export default {
  drops: [
    {
      dig_by: ItemTypeGroups.STONE_PICKAXE_OR_UPPER.toArray(),

      raw: {
        item_id: "minecraft:raw_iron",
      },
      refined: {
        item_id: "minecraft:iron_ingot",
      },

      fortune_rule: "ore",
    },
  ],
}
