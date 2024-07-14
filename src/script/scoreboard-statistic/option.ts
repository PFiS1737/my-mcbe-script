import { optionManager } from "@/lib/option-manager/index"

export const option = optionManager
  .registerNamesapace({ id: "scoreboard-statistic" })
  .addToggleItem({
    name: "enable_creative",
    description: "允许统计创造模式下的行为",
    defaultValue: true,
    events: {
      changed: (selected, original) =>
        console.warn(
          "scoreboard-statistic:enable_creative -> from",
          original,
          "to",
          selected
        ),
    },
  })
  .addToggleItem({
    name: "enable_cancel_out",
    description: "对部分统计项启用抵消",
    defaultValue: false,
    events: {
      changed: (selected, original) =>
        console.warn(
          "scoreboard-statistic:enable_cancel_out -> from",
          original,
          "to",
          selected
        ),
    },
  })
  .addToggleItem({
    name: "enable_confirm_dialog",
    description: "启用删除记分板时的警告",
    defaultValue: true,
    events: {
      changed: (selected, original) =>
        console.warn(
          "scoreboard-statistic:enable_confirm_dialog -> from",
          original,
          "to",
          selected
        ),
    },
  })
  .addToggleItem({
    name: "auto_start",
    description: "添加记分板后是否自动开始统计",
    defaultValue: true,
    events: {
      changed: (selected, original) =>
        console.warn(
          "scoreboard-statistic:auto_start -> from",
          original,
          "to",
          selected
        ),
    },
  })
