import { each, eachAsync } from "../util/index.js"
import { waitForFirstPlayerInitialSpawn } from "../util/game.js"

import { PlayerOption } from "./PlayerOption.class.js"

export class OptionNamespace {
    constructor(name) {
        this.name = name
    }
    
    players = new Map()
    _items = new Set()
    
    addItem(opts) {
        this._items.add(opts)
        return this
    }
    applyPlayer(player) {
        if (this.players.has(player)) return this.players.get(player)
        const playerOpt = new PlayerOption(player, this.name)
        each(this._items, item => {
            item._player = player
            playerOpt.addItem(item)
        })
        this.players.set(player, playerOpt)
        return playerOpt
    }
    async applyMainPlayer() {
        const player = await waitForFirstPlayerInitialSpawn()
        return this.applyPlayer(player)
    }
    async init() {
        const valueMap = new Map()
        await eachAsync(this.players, async ([ player, playerOpt ]) => {
            const result = await playerOpt.init()
            valueMap.set(player, result)
        })
        delete this.applyPlayer
        return valueMap
    }
    
    getPlayer(player) {
        return this.players.get(player)
    }
}
