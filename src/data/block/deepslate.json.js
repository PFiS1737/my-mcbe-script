import { ItemTypeGroups } from "@/lib/wrapper/item/index.js"

export default {
    drops: [
        {
            dig_by: ItemTypeGroups
                .WOODEN_PICKAXE_OR_UPPER.toArray(),
            
            raw: {
                item_id: "minecraft:cobbled_deepslate"
            }
        }
    ]
}
