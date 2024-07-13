import type { Container, ItemStack } from "@minecraft/server"

import { WrapperTemplate } from "../WrapperTemplate.class"

export class WrappedContainer extends WrapperTemplate {
  _container: Container

  constructor(container: Container) {
    super()

    this._container = container
  }

  get size() {
    return this._container.size
  }
  get emptySlotsCount() {
    return this._container.emptySlotsCount
  }

  getItem(slot: number) {
    return this._container.getItem(slot)
  }
  setItem(slot: number, itemStack: ItemStack) {
    return this._container.setItem(slot, itemStack)
  }
  tryAddItem(itemStack: ItemStack) {
    return this._container.addItem(itemStack)
  }
}
