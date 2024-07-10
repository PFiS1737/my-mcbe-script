import { GameMode } from "@minecraft/server"

import { Commands } from "../../commands/index"
import { each } from "../../util/index"

import { EntityContainer } from "../container/index"

import { WrappedEntity } from "./WrappedEntity.class"

export class WrappedPlayer extends WrappedEntity {
  constructor(player) {
    super(player)

    this.name = player.name
  }

  static match(entity) {
    return entity.typeId === "minecraft:player"
  }

  get _player() {
    return this._entity
  }

  get experience() {
    return this.addExperience(0)
  }
  get level() {
    return this._player.level
  }
  get inventory() {
    return new EntityContainer(this, this.components.get("inventory").container)
  }
  get selectedSlotIndex() {
    return this._player.selectedSlotIndex
  }

  getGameMode() {
    const matches = []
    each(GameMode, (mode) => {
      if (this.testGameMode(mode)) matches.push(mode)
    })
    return matches[0]
  }
  testGameMode(mode) {
    const playersUnderMode = this.dimension.getPlayers({ gameMode: mode })
    return playersUnderMode.some((player) => player.id === this.id)
  }
  setGameMode(mode) {
    if (!Object.values(GameMode).includes(mode))
      throw new TypeError("Unknown gamemode.")
    Commands.run(`gamemode ${mode}`, this._player)
  }

  getMainHandItem() {
    return this.inventory.getItem(this.selectedSlotIndex)
  }
  setMainHandItem(item) {
    this.inventory.setItem(this.selectedSlotIndex, item)
  }

  async useItemFromInventory(slot, callback = async (_) => {}) {
    let itemStack = this.inventory.getItem(slot)

    itemStack = await callback(itemStack)

    this.inventory.setItem(slot, itemStack)
  }
  async useMainHandItem(callback = async () => {}) {
    await this.useItemFromInventory(this.selectedSlotIndex, callback)
  }

  addExperience(amount = 0, { useXpOrb = false } = {}) {
    if (useXpOrb && amount >= 0) {
      while (amount--)
        this.dimension.spawnEntity("minecraft:xp_orb", this.location)

      return this.experience
    }
    return this._player.addExperience(amount)
  }
  addLevels(amount = 0) {
    return this._player.addLevels(amount)
  }
}
