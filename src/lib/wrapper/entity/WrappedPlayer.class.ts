import type { GameMode, ItemStack, Player } from "@minecraft/server"

import { EntityContainer } from "../container/index"
import { WrappedEntity } from "./WrappedEntity.class"

export class WrappedPlayer extends WrappedEntity {
  name: Player["name"]

  constructor(player: Player) {
    super(player)

    this.name = player.name
  }

  get _player() {
    return this._entity as Player
  }

  get experience() {
    return this.addExperience(0)
  }
  get level() {
    return this._player.level
  }
  get inventory() {
    return new EntityContainer(
      this._player,
      this.components.get("inventory").container
    )
  }
  get selectedSlotIndex() {
    return this._player.selectedSlotIndex
  }

  getGameMode() {
    return this._player.getGameMode()
  }
  testGameMode(mode: GameMode) {
    return this.getGameMode() === mode
  }
  setGameMode(mode: GameMode) {
    this._player.setGameMode(mode)
  }

  getMainHandItem() {
    return this.inventory.getItem(this.selectedSlotIndex)
  }
  setMainHandItem(item: ItemStack) {
    this.inventory.setItem(this.selectedSlotIndex, item)
  }

  async useItemFromInventory(
    slot: number,
    callback: (itemStack: ItemStack | undefined) => Promise<ItemStack>
  ) {
    let itemStack = this.inventory.getItem(slot)

    itemStack = await callback(itemStack)

    this.inventory.setItem(slot, itemStack)
  }
  async useMainHandItem(
    callback: (itemStack: ItemStack | undefined) => Promise<ItemStack>
  ) {
    await this.useItemFromInventory(this.selectedSlotIndex, callback)
  }

  addExperience(amount = 0, { useXpOrb = false } = {}): number {
    let xpAmount = amount

    if (useXpOrb && amount >= 0) {
      while (xpAmount--)
        this.dimension.spawnEntity("minecraft:xp_orb", this.location)

      return this.experience
    }

    return this._player.addExperience(amount)
  }
  addLevels(amount = 0) {
    return this._player.addLevels(amount)
  }
}
