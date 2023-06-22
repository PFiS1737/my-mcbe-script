import { optionManager } from "@/lib/option-manager/index.js"

export const tpxOption = optionManager
    .registerNamesapace("tpx")
    .addItem({
        name: "enable_auto_back_point",
        description: "允许使用 tpx 传送时自动添加返回点",
        values: [[true], [false]],
        defaultValue: true,
        events: {
            changed: (selected, original) => console.warn("enable_auto_back_point -> from", original, "to", selected),
        }
    })
    .addItem({
        name: "enable_back_cmd",
        description: "允许使用独立的 back 命令",
        values: [[true], [false]],
        defaultValue: false,
        reload: true,
        events: {
            changed: (selected, original) => console.warn("enable_back_cmd -> from", original, "to", selected)
        }
    })
    .addItem({
        name: "enable_home_cmd",
        description: "允许使用独立的 home 命令",
        values: [[true], [false]],
        defaultValue: false,
        reload: true,
        events: {
            changed: (selected, original) => console.warn("enable_home_cmd -> from", original, "to", selected)
        }
    })