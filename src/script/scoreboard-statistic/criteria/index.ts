import { types } from "./statistic/types/index"

import deathCount from "./deathCount"
import health from "./health"
import playerKillCount from "./playerKillCount"
import totalKillCount from "./totalKillCount"

// @ts-ignore
export default new Map([
  ...Object.entries(types),

  ["deathCount", deathCount],
  ["playerKillCount", playerKillCount],
  ["totalKillCount", totalKillCount],
  ["health", health],
])
