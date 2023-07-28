import { ItemTypeGroups } from "@/lib/wrapper/item/index.js"

export default {
    drops: [
        {
            dig_by: ItemTypeGroups
                .IRON_PICKAXE_OR_UPPER.toArray(),
            
            raw: {
                item_id: "minecraft:redstone",
                default_range: [ 4, 5 ],
                xp_range: [ 1, 5 ]
            },
            
            fortune_rule: "melon"
        }
    ]
}
