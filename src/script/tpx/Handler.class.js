import { asyncRun } from "@/util/game.js"

import { option } from "./option.js"
import { ALL_PLAYER_DATABASES } from "./db.js"

export class Handler {
    constructor(player) {
        this.player = player
        this.playerOption = option.getPlayer(player)
        this.playerDB = ALL_PLAYER_DATABASES.get(player)
    }
    
    async set({ name = "default", option = {} }) {
        const info = await this.playerDB.set(Object.assign({ name }, option))
        if (name !== "__back__" && name !== "__death__") return { info }
    }
    async remove({ name = "default" }) {
        return await this.playerDB.remove(name)
    }
    async teleport({ name = "default" }) {
        const info = await this.playerDB.get(name)
        if (info) {
            if (
                this.playerOption.getItemVal("auto_back_point") &&
                name !== "__death__"
            ) {
                await this.set({
                    name: "__back__",
                    option: {
                        disposable: true,
                        force: true
                    }
                })
            }
            await asyncRun(() => this.player.teleport(info.location, {
                dimension: info.dimension,
                checkForBlocks: false,
                keepVelocity: false
            }))
            return { info }
        }
    }
    async tryTeleport({ names = [] }) {
        for (const name of names) {
            const result = await this.teleport({ name })
            if (result) return result
        }
    }
    list() {
        const datas = this.playerDB.getAll().map(({ text }) => text)
        if (datas.length) return { msg: datas }
    }
}
