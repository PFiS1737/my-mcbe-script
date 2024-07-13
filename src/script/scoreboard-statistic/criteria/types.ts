import type { Player, WorldAfterEvents } from "@minecraft/server"

export type Criteria = ({
  player,
  target,
  callback,
}: {
  player: Player
  target?: string
  callback: (result: {
    type: "increase" | "decrease" | "reset"
    value: number
  }) => void
}) => {
  events: {
    [P in keyof WorldAfterEvents]: {
      options: Parameters<WorldAfterEvents[P]["subscribe"]>[1]
      listener: Parameters<WorldAfterEvents[P]["subscribe"]>[0]
    }
  }
}
