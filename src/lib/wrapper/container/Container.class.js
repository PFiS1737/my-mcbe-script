import { WrapperTemplate } from "../WrapperTemplate.class.js"

export class Container extends WrapperTemplate {
  constructor(container) {
    super()

    this._container = container
  }

  get size() {
    return this._container.size
  }
  get emptySlotsCount() {
    return this._container.emptySlotsCount
  }

  getItem(slot) {
    return this._container.getItem(slot)
  }
  setItem(slot, itemStack) {
    return this._container.setItem(slot, itemStack)
  }
  tryAddItem(itemStack) {
    return this._container.addItem(itemStack)
  }
}
