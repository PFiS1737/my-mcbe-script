import { BlockPermutation } from "@minecraft/server"

// @ts-ignore
import BlockDefinition from "@/data/block/index"

import { NumberRange } from "../../NumberRange.class"
import { removeMinecraftNamespace } from "../../util/game"
import { each } from "../../util/index"
import { binomialDistribution, range } from "../../util/math"

import { LootTable } from "../LootTable.class"

class DropItem {
  constructor({
    // @ts-ignore
    item_id: itemId,
    default_range: defaultRange = [1, 1],
    max_amount: maxAmount = Number.POSITIVE_INFINITY,
    xp_range: xpRange = [0, 0],
    damage = 1,
  } = {}) {
    this.itemId = itemId
    this.range = new NumberRange(...defaultRange)
    this.amountLootTable = new LootTable(this.range.toArray())
    this.maxAmount = maxAmount
    this.xpRange = new NumberRange(...xpRange)
    this.damage = damage
  }

  getResult() {
    return [
      {
        itemId: this.itemId,
        amount: Math.min(this.amountLootTable.getResult(), this.maxAmount),
        xp: new LootTable(this.xpRange.toArray()).getResult(),
        damage: this.damage,
      },
    ]
  }
}

class DropItemGroup {
  constructor(group) {
    this.items = group.map((e) => new DropItem(e))
  }
  getResult() {
    const output = []
    each(this.items, (item) => output.push(...item.getResult()))
    return output
  }
}

export const FORTUNE_RULES = {
  // 掉落一个权重为 2，每级增加一个掉落上限，权重为 1
  ore: "ore",
  // 掉落一个权重为 1，每级增加一个掉落上限，权重为 1，但不超过某上限
  melon: "melon",
  // 是否掉落有一固定概率
  // 如果判定掉落，每级增加两个掉落上限，权重为 1
  grass: "grass",
  // 掉落一个权重为 1，每级增加两个掉落上限，权重为 1
  flower: "flower",
  // 固定掉落一个
  // 额外掉落上限初始为 3，每级增加一个额外掉落上限，额外掉落服从 B(n, 4 / 7)
  crop: "crop",
  // 使用自定义的战利品表
  custom: "custom",
}

export class BlockDrops {
  constructor(blockTypeId, useItem) {
    const identifier = removeMinecraftNamespace(blockTypeId)
    const drops = BlockDefinition[identifier]?.drops

    if (!drops) throw new Error(`Block ${identifier} has not been supported.`)

    this.blockTypeId = blockTypeId
    this.drops = drops

    if (useItem) this.setItemUse(useItem)
  }

  setItemUse(useItem = "<empty>") {
    const dropConfig =
      this.drops.find((e) => {
        const digBy = e.dig_by
        if (Array.isArray(digBy)) return digBy.includes(useItem)
        if (typeof digBy === "string") return digBy === useItem
      }) ?? this.drops.find((e) => e.dig_by === "<default>")

    if (!dropConfig) {
      // throw new Error(`Couldn't find drop config when dig with ${useItem}`)
      return false
    }

    this.blockItem = new DropItem({
      item_id: BlockPermutation.resolve(this.blockTypeId).getItemStack()
        ?.typeId,
    })
    this.rawResource = new DropItem(dropConfig.raw) ?? this.blockItem

    // for ore like
    this.refinedResource = new DropItem(dropConfig.refined)

    // for crop like
    this.seendResource = new DropItem(dropConfig.seed) ?? this.rawResource
    this.immatureResource =
      new DropItem(dropConfig.immature) ?? this.seendResource

    this.fortuneRule = dropConfig.fortune_rule

    // only work with custom rule
    if (this.fortuneRule === FORTUNE_RULES.custom) {
      this.custumLootTable = dropConfig.option?.custom
      if (!this.custumLootTable)
        throw new Error(
          "You must provide a custom loot table for the custom fortune rule."
        )
    }

    return true
  }

  getDrops({ withFortune = 0, withSilkTouch = false, immature = false } = {}) {
    if (withFortune && withSilkTouch)
      throw new Error("Could not call with both fortune and silk_touch.")

    if (immature) {
      return this.immatureResource.getResult()
    }
    if (withSilkTouch) {
      return this.blockItem.getResult()
    }
    if (withFortune !== 0 && this.fortuneRule) {
      const level = withFortune

      switch (this.fortuneRule) {
        case FORTUNE_RULES.ore: {
          const rawResource = this.rawResource.getResult()[0]

          const lootTable = new LootTable([
            ...range(2, level + 2),
            {
              weight: 2,
              value: 1,
            },
          ])
          rawResource.amount *= lootTable.getResult()

          return [rawResource]
        }
        case FORTUNE_RULES.melon: {
          const rawResource = this.rawResource.getResult()[0]

          const lootTable = new LootTable([
            ...this.rawResource.amountLootTable,
            ...range(1, level + 1).map((i) => ({
              weight: 1,
              value: Math.min(
                this.rawResource.maxAmount,
                this.rawResource.range.max + i
              ),
            })),
          ])
          rawResource.amount = lootTable.getResult()

          return [rawResource]
        }
        case FORTUNE_RULES.grass: {
          const rawResource = this.rawResource.getResult()[0]

          if (rawResource.amount === 0) return [rawResource]

          const lootTable = new LootTable(range(1, level * 2 + 2))
          rawResource.amount = lootTable.getResult()
          return [rawResource]
        }
        case FORTUNE_RULES.flower: {
          const rawResource = this.rawResource.getResult()[0]

          const lootTable = new LootTable(range(1, level * 2 + 2))
          rawResource.amount = lootTable.getResult()

          return [rawResource]
        }
        case FORTUNE_RULES.crop: {
          const rawResource = this.rawResource.getResult()[0]

          const distribution = binomialDistribution(level + 3, 4 / 7)
          const lootTable = new LootTable(
            range(0, level + 4).map((i) => ({
              weight: distribution(i),
              value: i,
            }))
          )

          return [
            rawResource,
            {
              // TODO: use class
              itemId: this.seendResource.itemId,
              amount: lootTable.getResult(),
            },
          ]
        }
        case FORTUNE_RULES.custom: {
          const lootTable = new LootTable(this.custumLootTable[level])
          const customItemDrop = new DropItemGroup(lootTable.getResult())
          return customItemDrop.getResult()
        }
      }
      // biome-ignore lint/style/noUselessElse: <explanation>
    } else {
      return this.rawResource.getResult()
    }
  }
}
