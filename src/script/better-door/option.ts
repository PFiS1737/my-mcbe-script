import { optionManager } from "@/lib/option-manager/index"

export const option = optionManager
  .registerNamesapace({ id: "better-door" })
  .addToggleItem({
    name: "door",
    description: "允许双开门",
    defaultValue: false,
    events: {
      changed: (selected, original) =>
        console.warn("better-door:door -> from", original, "to", selected),
    },
  })
  .addToggleItem({
    name: "trapdoor",
    description: "允许多开活板门",
    defaultValue: false,
    events: {
      changed: (selected, original) =>
        console.warn("better-door:trapdoor -> from", original, "to", selected),
    },
  })
  .addRangeItem({
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
  .addToggleItem({
    name: "should_be_the_same_type",
    description: "是否需要是同种门",
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
