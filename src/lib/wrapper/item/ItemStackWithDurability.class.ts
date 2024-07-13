import {
  ItemComponentTypes,
  type ItemDurabilityComponent,
  type ItemStack,
} from "@minecraft/server"
import { withProbability } from "../../util/math"
import { WrappedItemStack } from "./WrappedItemStack.class"

export class ItemStackWithDurability extends WrappedItemStack {
  constructor(itemStack: ItemStack) {
    if (!ItemStackWithDurability.match(itemStack))
      throw new TypeError(
        `The "${itemStack.typeId}" doesn't have the "${ItemComponentTypes.Durability}" component.`
      )

    super(itemStack)
  }

  static match(itemStack) {
    return itemStack.hasComponent("minecraft:durability")
  }

  get damage() {
    return (
      this.components.get(
        ItemComponentTypes.Durability
      ) as ItemDurabilityComponent
    ).damage
  }
  set damage(value) {
    ;(
      this.components.get(
        ItemComponentTypes.Durability
      ) as ItemDurabilityComponent
    ).damage = value < 0 ? 0 : value
  }
  get maxDurability() {
    return (
      this.components.get(
        ItemComponentTypes.Durability
      ) as ItemDurabilityComponent
    ).maxDurability
  }
  get durability() {
    return this.maxDurability - this.damage
  }
  set durability(value) {
    this.damage += this.durability - value
  }

  applyDamage(damage: number) {
    const unbreakingLevel = this.enchants.getEnchantment("unbreaking")?.level
    const probability =
      (
        this.components.get(
          ItemComponentTypes.Durability
        ) as ItemDurabilityComponent
      ).getDamageChance(unbreakingLevel) / 100

    for (let i = 0; i < damage; i++) {
      if (withProbability(probability)) this.durability -= 1
    }

    return this
  }
}
