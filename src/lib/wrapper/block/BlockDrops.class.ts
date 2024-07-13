import {
  type BlockDropsConfig,
  type BlockDropsConfigOption,
  FortuneRules,
  type ItemDropConfig,
} from "@/data/block/types"
import { BlockPermutation } from "@minecraft/server"
import type { MinecraftItemTypes } from "@minecraft/vanilla-data"

import BlockDefinition from "../../../data/block/index"
import { NumberRange } from "../../NumberRange.class"
import { removeMinecraftNamespace } from "../../util/game"
import { binomialDistribution, range } from "../../util/math"
import { LootTable } from "../LootTable.class"

class DropItem {
  itemId: MinecraftItemTypes
  range: NumberRange
  amountLootTable: LootTable
  maxAmount: number
  xpRange: NumberRange
  damage: number

  constructor({
    item_id: itemId,
    default_range: defaultRange = [1, 1],
    max_amount: maxAmount = Number.POSITIVE_INFINITY,
    xp_range: xpRange = [0, 0],
    damage = 1,
  }: ItemDropConfig) {
    this.itemId = itemId
    this.range = new NumberRange(...defaultRange)
    this.amountLootTable = new LootTable(this.range.toArray())
    this.maxAmount = maxAmount
    this.xpRange = new NumberRange(...xpRange)
    this.damage = damage
  }

  getResult(): Array<{
    itemId: MinecraftItemTypes
    amount: number
    xp?: number
    damage?: number
  }> {
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
  items: DropItem[]

  constructor(group: ItemDropConfig[]) {
    this.items = group.map((e) => new DropItem(e))
  }
  getResult() {
    const output: ReturnType<DropItem["getResult"]> = []

    for (const item of this.items) output.push(...item.getResult())

    return output
  }
}

export class BlockDrops {
  blockTypeId: string
  drops: BlockDropsConfig

  blockItem: DropItem
  rawResource: DropItem
  refinedResource: DropItem | undefined
  seedResource: DropItem
  immatureResource: DropItem

  fortuneRule: BlockDropsConfig[number]["fortune_rule"]

  custumLootTables: BlockDropsConfigOption["custom"]

  constructor(
    blockTypeId: string,
    useItem: MinecraftItemTypes | "<empty>" = "<empty>"
  ) {
    const identifier = removeMinecraftNamespace(blockTypeId)
    const drops = BlockDefinition[identifier]?.drops

    if (!drops) throw new Error(`Block ${identifier} has not been supported.`)

    this.blockTypeId = blockTypeId
    this.drops = drops

    const dropConfig = this.getDropConfig(useItem)
    if (!dropConfig) {
      throw new Error(`Couldn't find drop config when dig with ${useItem}`)
    }

    this.blockItem = new DropItem({
      item_id: BlockPermutation.resolve(this.blockTypeId).getItemStack()
        ?.typeId as MinecraftItemTypes,
    })
    this.rawResource = dropConfig.raw
      ? new DropItem(dropConfig.raw)
      : this.blockItem

    // for ore like
    this.refinedResource =
      dropConfig.refined && new DropItem(dropConfig.refined)

    // for crop like
    this.seedResource = dropConfig.seed
      ? new DropItem(dropConfig.seed)
      : this.rawResource
    this.immatureResource = dropConfig.immature
      ? new DropItem(dropConfig.immature)
      : this.seedResource

    this.fortuneRule = dropConfig.fortune_rule

    // only work with custom rule
    if (this.fortuneRule === FortuneRules.Custom) {
      if (!dropConfig.option?.custom)
        throw new Error(
          "You must provide a custom loot table for the custom fortune rule."
        )

      this.custumLootTables = dropConfig.option.custom
    }
  }

  getDropConfig(useItem: MinecraftItemTypes | "<empty>") {
    return (
      this.drops.find((e) => {
        const digBy = e.dig_by
        if (Array.isArray(digBy)) return digBy.includes(useItem)
        if (typeof digBy === "string") return digBy === useItem
      }) ?? this.drops.find((e) => e.dig_by === "<default>")
    )
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
    if (withFortune !== 0 && this.fortuneRule !== undefined) {
      const level = withFortune

      switch (this.fortuneRule) {
        case FortuneRules.Ore: {
          const rawResource = this.rawResource.getResult()[0]

          const lootTable = new LootTable([
            ...range(2, level + 2).map((i) => ({
              weight: 1,
              value: i,
            })),
            {
              weight: 2,
              value: 1,
            },
          ])
          rawResource.amount *= lootTable.getResult()

          return [rawResource]
        }
        case FortuneRules.Melon: {
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
        case FortuneRules.Grass: {
          const rawResource = this.rawResource.getResult()[0]

          if (rawResource.amount === 0) return [rawResource]

          const lootTable = new LootTable(range(1, level * 2 + 2))
          rawResource.amount = lootTable.getResult()
          return [rawResource]
        }
        case FortuneRules.Flower: {
          const rawResource = this.rawResource.getResult()[0]

          const lootTable = new LootTable(range(1, level * 2 + 2))
          rawResource.amount = lootTable.getResult()

          return [rawResource]
        }
        case FortuneRules.Crop: {
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
              itemId: this.seedResource.itemId,
              amount: lootTable.getResult(),
            },
          ]
        }
        case FortuneRules.Custom: {
          const lootTable = new LootTable<ItemDropConfig[]>(
            this.custumLootTables![`${level}` as "0" | "1" | "2" | "3"]
          )
          const customItemDrop = new DropItemGroup(lootTable.getResult())
          return customItemDrop.getResult()
        }
      }
    }

    return this.rawResource.getResult()
  }
}
