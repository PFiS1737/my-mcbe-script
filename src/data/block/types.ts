import type { MinecraftItemTypes } from "@minecraft/vanilla-data"

import type { ILootTableItemConfig } from "@/lib/wrapper/LootTable.class"

export type ItemDropConfig = {
  item_id: MinecraftItemTypes
  default_range?: [number, number] // default [1, 1]
  max_amount?: number // default Number.POSITIVE_INFINITY
  xp_range?: [number, number] // default [0, 0]
  damage?: number // default 1
}

export enum FortuneRules {
  // 掉落一个权重为 2，每级增加一个掉落上限，权重为 1
  Ore = 0,
  // 掉落一个权重为 1，每级增加一个掉落上限，权重为 1，但不超过某上限
  Melon = 1,
  // 是否掉落有一固定概率
  // 如果判定掉落，每级增加两个掉落上限，权重为 1
  Grass = 2,
  // 掉落一个权重为 1，每级增加两个掉落上限，权重为 1
  Flower = 3,
  // 固定掉落一个
  // 额外掉落上限初始为 3，每级增加一个额外掉落上限，额外掉落服从 B(n, 4 / 7)
  Crop = 4,
  // 使用自定义的战利品表
  Custom = 5,
}

export type BlockDropsConfigOption = {
  // necessary if the fortune rule is custom
  custom?: Record<
    "0" | "1" | "2" | "3",
    Array<ILootTableItemConfig<ItemDropConfig[]>>
  >
}

export type BlockDropsConfig = Array<{
  // when dig with item
  // use "<empty>" for empty-handed
  // use "<default>" if none of the other items meet the requirements
  dig_by:
    | MinecraftItemTypes
    | Array<MinecraftItemTypes | "<empty>">
    | {
        item_group: string
      }
    | "<empty>"
    | "<default>"

  // the raw resource that drop
  // default to use the block item (if has)
  raw?: ItemDropConfig

  // for ore like
  // refined resource
  refined?: ItemDropConfig

  // for crop like
  // seend resource, default to use raw resource
  seed?: ItemDropConfig
  // immature resource, default to use seed resource
  immature?: ItemDropConfig

  // the rule template for fortune enchantment
  fortune_rule?: FortuneRules

  option?: BlockDropsConfigOption
}>

export type BlockConfig = {
  drops: BlockDropsConfig
}
