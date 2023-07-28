import { ItemTypeGroups } from "@/lib/wrapper/item/index.js"

export default {
    drops: [
        {
            dig_by: ItemTypeGroups
                .WOODEN_PICKAXE_OR_UPPER.toArray(),
            
            raw: {
                item_id: "minecraft:quartz",
                xp_range: [ 2, 5 ]
            },
            
            fortune_rule: "ore"
        }
    ]
}
