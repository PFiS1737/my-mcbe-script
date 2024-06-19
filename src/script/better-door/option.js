import { optionManager } from "@/lib/option-manager/index.js"

export const option = optionManager
  .registerNamesapace("better-door")
  .addItem({
    name: "door",
    description: "允许双开门",
    values: [[true], [false]],
    defaultValue: true,
    events: {
      changed: (selected, original) =>
        console.warn("better-door:door -> from", original, "to", selected),
    },
  })
  .addItem({
    name: "trapdoor",
    description: "允许多开活板门",
    values: [[true], [false]],
    defaultValue: false,
    events: {
      changed: (selected, original) =>
        console.warn("better-door:trapdoor -> from", original, "to", selected),
    },
  })
  .addItem({
    name: "max_trapdoor_length",
    description: "允许多开活板门的最大距离",
    range: [1, 32],
    defaultValue: 3,
    events: {
      changed: (selected, original) =>
        console.warn(
          "better-door:max_trapdoor_length -> from",
          original,
          "to",
          selected
        ),
    },
  })
  .addItem({
    name: "should_be_the_same_type",
    description: "是否需要是同种门",
    values: [[true], [false]],
    defaultValue: true,
    events: {
      changed: (selected, original) =>
        console.warn(
          "better-door:should_be_the_same_type -> from",
          original,
          "to",
          selected
        ),
    },
  })
