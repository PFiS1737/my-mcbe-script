import { optionManager } from "@/lib/option-manager/index.js"
import { range } from "@/lib/util/math.js"

export const option = optionManager
    .registerNamesapace("better-door")
    .addItem({
        name: "door",
        description: "允许双开门",
        values: [[true], [false]],
        defaultValue: true,
        events: {
            changed: (selected, original) => console.warn("better-door:door -> from", original, "to", selected)
        }
    })
    .addItem({
        name: "trapdoor",
        description: "允许双开活板门",
        values: [[true], [false]],
        defaultValue: false,
        events: {
            changed: (selected, original) => console.warn("better-door:trapdoor -> from", original, "to", selected)
        }
    })
    .addItem({
        name: "max_trapdoor_length",
        description: "允许双开活板门的最大距离",
        values: range(1, 51).map(i => [i]),  // TODO: 因为没有为滑块的专门设置，先暂时这么写
        defaultValue: 3,
        events: {
            changed: (selected, original) => console.warn("better-door:max_trapdoor_length -> from", original, "to", selected)
        }
    })
