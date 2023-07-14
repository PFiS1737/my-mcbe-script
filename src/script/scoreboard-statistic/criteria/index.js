import { types } from "./statistic/types/index.js"

import deathCount from "./deathCount.js"
import playerKillCount from "./playerKillCount.js"
import totalKillCount from "./totalKillCount.js"
import health from "./health.js"

export default new Map([
    ...Object.entries(types),
    
    ["deathCount", deathCount],
    ["playerKillCount", playerKillCount],
    ["totalKillCount", totalKillCount],
    ["health", health]
])
