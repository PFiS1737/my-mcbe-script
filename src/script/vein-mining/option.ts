import { optionManager } from "@/lib/option-manager/index"

export const option = optionManager
  .registerNamesapace("vein-mining")
  .addItem({
    name: "condition",
    description: "触发条件",
    values: [
      ["off", "关闭"],
      ["always", "总是"],
      ["sneaking", "仅潜行时"],
    ],
    defaultValue: "sneaking",
    events: {
      changed: (selected, original) =>
        console.warn("vein-mining:tigger -> from", original, "to", selected),
    },
  })
  .addItem({
    name: "max_amount",
    description: "最多检测的方块数量（并非最终挖掘的方块数）",
    range: [8, 128],
    defaultValue: 64,
    events: {
      changed: (selected, original) =>
        console.warn(
          "vein-mining:enable_edge -> from",
          original,
          "to",
          selected
        ),
    },
  })
  .addItem({
    name: "enable_stone",
    description: "允许连锁挖掘岩石类方块（石头、深板岩）",
    values: [[true], [false]],
    defaultValue: false,
    events: {
      changed: (selected, original) =>
        console.warn(
          "vein-mining:enable_stone -> from",
          original,
          "to",
          selected
        ),
    },
  })
  .addItem({
    name: "auto_collection",
    description: "自动收集掉落物及经验（绕过经验修补）",
    values: [[true], [false]],
    defaultValue: false,
    events: {
      changed: (selected, original) =>
        console.warn(
          "vein-mining:auto_collect_drops -> from",
          original,
          "to",
          selected
        ),
    },
  })
  .addItem({
    name: "prevent_tool_destruction",
    description: "防止工具耐久耗尽",
    values: [[true], [false]],
    defaultValue: false,
    events: {
      changed: (selected, original) =>
        console.warn(
          "vein-mining:prevent_tool_destruction -> from",
          original,
          "to",
          selected
        ),
    },
  })
  .addItem({
    name: "enable_edge",
    description: "是否检测仅棱相连的方块",
    values: [[true], [false]],
    defaultValue: false,
    events: {
      changed: (selected, original) =>
        console.warn(
          "vein-mining:enable_edge -> from",
          original,
          "to",
          selected
        ),
    },
  })
  .addItem({
    name: "enable_diagonal",
    description: "是否检测仅角相连的方块",
    values: [[true], [false]],
    defaultValue: false,
    events: {
      changed: (selected, original) =>
        console.warn(
          "vein-mining:enable_diagonal -> from",
          original,
          "to",
          selected
        ),
    },
  })
