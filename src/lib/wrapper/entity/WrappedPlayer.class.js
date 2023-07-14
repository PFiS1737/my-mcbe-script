import { Player, GameMode } from "@minecraft/server"

import { Commands } from "../../commands/index.js"
import { each } from "../../util/index.js"

export class WrappedPlayer {
    constructor(player) {
        if (!(player instanceof Player)) throw new TypeError("Parameter is not an instance of Player.")
        
        this.player = player
        this.dimension = player.dimension
    }
    
    getGameMode() {
        const matches = []
        each(GameMode, mode => {
            if (this.testGameMode(mode)) matches.push(mode)
        })
        return matches[0]
    }
    testGameMode(mode) {
        const playersUnderMode = this.dimension.getPlayers({ gameMode: mode })
        return playersUnderMode.some((player => player.id === this.player.id))
    }
    setGameMode(mode) {
        if (!Object.values(GameMode).includes(mode)) throw new TypeError("Unknown gamemode.")
        Commands.run(`gamemode ${mode}`, this.player)
    }
}
