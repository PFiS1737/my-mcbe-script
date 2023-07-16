import { Player, GameMode } from "@minecraft/server"

import { Commands } from "../../commands/index.js"
import { each } from "../../util/index.js"

export class WrappedPlayer {
    constructor(player) {
        if (!(player instanceof Player)) throw new TypeError("Parameter is not an instance of Player.")
        
        this.player = player
        this.dimension = player.dimension
    }
    
    getFacing() {
        const rotation = this.player.getRotation().y
        
        if (rotation > -135 && rotation <= -45) return 0  // east (x+)
        else if (rotation > -45 && rotation <= 45) return 1  // south (z+)
        else if (rotation > 45 && rotation <= 135) return 2  // west (x-)
        else if (rotation > 135 || rotation <= -135) return 3  // north (z-)
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
