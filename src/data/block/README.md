```
{
    drops: Array<{
        // when dig with item
        // use "<empty>" (can in the array) for empty-handed
        // use "<default>" (only string) if none of the other items meet the requirements
        dig_by: string | string[] | {
            item_group: string
        },
        
        // the raw resource that drop
        // default to use the block item (if has)
        raw: ItemDrop,
        
        // for ore like
        // refined resource
        refined: ItemDrop,
        
        // for crop like
        // seend resource, default to use raw resource
        seed: ItemDrop,
        // immature resource, default to use seed resource
        immature: ItemDrop
        
        // the rule template for fortune enchantment
        // rf: @/lib/wrapper/block/BlockDrops.class.js
        fortune_rule: ore | melon | grass | flower | crop | custom
        
        option: {
            // necessary if the fortune rule is custom
            custom: {
                <fortune level>(0|1|2|3): Array<{
                    weight: number,
                    value: ItemDrop[]
                }>
            }
        }
    }>
}
```

```
ItemDrop {
    item_id: string,
    default_range: [ number, number ]  // default to [1, 1]
    max_amount: number  // default to Infinity,
    xp_range: [ number, number ]  // default to [0, 0]
}
```
