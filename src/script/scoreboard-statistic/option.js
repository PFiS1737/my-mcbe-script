import { optionManager } from "@/lib/option-manager/index.js"

export const option = optionManager
    .registerNamesapace("scoreboard-statistic")
    .addItem({
        name: "enable_creative",
        description: "允许统计创造模式下的行为",
        values: [[true], [false]],
        defaultValue: true,
        events: {
            changed: (selected, original) => console.warn("scoreboard-statistic:enable_creative -> from", original, "to", selected)
        }
    })
    .addItem({
        name: "enable_cancel_out",
        description: "对部分统计项启用抵消",
        values: [[true], [false]],
        defaultValue: false,
        events: {
            changed: (selected, original) => console.warn("scoreboard-statistic:enable_cancel_out -> from", original, "to", selected)
        }
    })
    .addItem({
        name: "enable_confirm",
        description: "启用删除记分板时的警告",
        values: [[true], [false]],
        defaultValue: true,
        events: {
            changed: (selected, original) => console.warn("scoreboard-statistic:enable_confirm -> from", original, "to", selected)
        }
    })
