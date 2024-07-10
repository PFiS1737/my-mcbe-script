import { withProbability } from "../../util/math"
import { WrappedItemStack } from "./WrappedItemStack.class"

export class ItemStackWithDurability extends WrappedItemStack {
  constructor(itemStack) {
    if (!ItemStackWithDurability.match(itemStack))
      throw new TypeError(
        `The "${itemStack.typeId}" doesn't have the "minecraft:durability" component.`
      )

    super(itemStack)
  }

  static match(itemStack) {
    return itemStack.hasComponent("minecraft:durability")
  }

  get damage() {
    return this.components.get("durability").damage
  }
  set damage(value) {
    this.components.get("durability").damage = value < 0 ? 0 : value
  }
  get maxDurability() {
    return this.components.get("durability").maxDurability
  }
  get durability() {
    return this.maxDurability - this.damage
  }
  set durability(value) {
    this.damage += this.durability - value
  }

  applyDamage(damage) {
    const unbreakingLevel = this.enchants.hasEnchantment("unbreaking")
    const probability =
      this.components.get("durability").getDamageChance(unbreakingLevel) / 100

    for (let i = 0; i < damage; i++) {
      if (withProbability(probability)) this.durability -= 1
    }

    return this
  }
}
