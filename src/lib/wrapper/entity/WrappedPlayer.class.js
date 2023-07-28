import { Player, GameMode } from "@minecraft/server"

import { Commands } from "../../commands/index.js"
import { each } from "../../util/index.js"

import { WrappedEntity } from "./WrappedEntity.class.js"

export class WrappedPlayer extends WrappedEntity {
    constructor(player) {
        if (!(player instanceof Player))
            throw new TypeError("Parameter is not an instance of Player.")
        
        super(player)
    }
    
    get player() {
        return this.entity
    }
    
    get inventory() {
        return this.components.get("inventory").container
    }
    get selectedSlot() {
        return this.player.selectedSlot
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
    
    getMainHand() {
        return this.inventory.getItem(this.selectedSlot)
    }
    setMainHand(item) {
        this.inventory.setItem(this.selectedSlot, item)
    }
    
    async useItemFromInventory(slot, callback = async () => {}) {
        let itemStack = this.inventory.getItem(slot)
        
        itemStack = await callback(itemStack)
        
        this.inventory.setItem(slot, itemStack)
    }
    async useMainHandItem(callback = async () => {}) {
        await this.useItemFromInventory(this.selectedSlot, callback)
    }
    
    addExperience(amount = 0) {
        this.player.addExperience(amount)
    }
}
