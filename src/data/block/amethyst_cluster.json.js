import { ItemTypeGroups } from "@/lib/wrapper/item/index.js"

export default {
    drops: [
        {
            dig_by: ItemTypeGroups
                .WOODEN_PICKAXE_OR_UPPER.toArray(),
            
            raw: {
                item_id: "minecraft:amethyst_shard",
                default_range: [ 4, 4 ]
            },
            
            fortune_rule: "ore"
        },
        {
            dig_by: "<default>",
            
            raw: {
                item_id: "minecraft:amethyst_shard",
                default_range: [ 2, 2 ]
            }
        }
    ]
}
