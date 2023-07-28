import { optionManager } from "@/lib/option-manager/index.js"
import { range } from "@/util/math.js"

export const option = optionManager
    .registerNamesapace("vein-mining")
    .addItem({
        name: "condition",
        description: "触发条件",
        values: [
            [ "off", "关闭" ],
            [ "always", "总是" ],
            [ "sneaking", "仅潜行时" ]
        ],
        defaultValue: "sneaking",
        events: {
            changed: (selected, original) => console.warn("vein-mining:tigger -> from", original, "to", selected)
        }
    })
    .addItem({
        name: "max_amount",
        description: "最多检测的方块数量（并非最终挖掘的方块数）",
        values: range(1, 64).map(i => [i, `${i}`]),
        defaultValue: 31,
        events: {
            changed: (selected, original) => console.warn("vein-mining:enable_edge -> from", original, "to", selected)
        }
    })
    .addItem({
        name: "auto_collection",
        description: "自动收集掉落物及经验",
        values: [[true], [false]],
        defaultValue: false,
        events: {
            changed: (selected, original) => console.warn("vein-mining:auto_collect_drops -> from", original, "to", selected)
        }
    })
    .addItem({
        name: "protect_tools",
        description: "保护工具，防止其损坏",
        values: [[true], [false]],
        defaultValue: false,
        events: {
            changed: (selected, original) => console.warn("vein-mining:protect_tools -> from", original, "to", selected)
        }
    })
    .addItem({
        name: "protect_player",
        description: "是否不挖掘玩家脚下的方块",
        values: [[true], [false]],
        defaultValue: false,
        events: {
            changed: (selected, original) => console.warn("vein-mining:protect_player -> from", original, "to", selected)
        }
    })
    .addItem({
        name: "enable_diagonal",
        description: "是否检测仅角相连的方块",
        values: [[true], [false]],
        defaultValue: false,
        events: {
            changed: (selected, original) => console.warn("vein-mining:enable_diagonal -> from", original, "to", selected)
        }
    })
    .addItem({
        name: "enable_edge",
        description: "是否检测仅棱相连的方块",
        values: [[true], [false]],
        defaultValue: false,
        events: {
            changed: (selected, original) => console.warn("vein-mining:enable_edge -> from", original, "to", selected)
        }
    })

