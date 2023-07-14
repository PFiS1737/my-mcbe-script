# scoreboard-statistic

记分板统计

## Syntax

> 注意：请避免同时开启多个统计或频繁触发更新，这可能导致卡顿

- `!scoreboard objectives add <objectiveId> <criteria> [displayName]`
    - 设置一个新的统计记分板，并将自己添加进去
    - 对于未进入此记分板的玩家，使用同样的命令既可进入
    - 已进入的玩家再次是一会报错
- `!scoreboard objectives add <objectiveId>`
    - 将自己从一个统计记分板中移除（**统计数据不会被保留**）
    - 若此记分板中只有一个玩家，将会删除此记分板
    - **注意：请勿仅使用原版命令删除记分板**

### Criteria

> 注意：对于 dummy 准则，请使用原版命令

#### Single criteria

- `deathCount`
    - 当玩家死亡时加分
- `playerKillCount`
    - 当玩家杀死其他玩家时加分
- `totalKillCount`
    - 当玩家杀死其他生物（包括玩家）时加分
- `health`
    - 将同步玩家的生命值
    - 在第一次改变生命之前为 0

#### Compound criteria

- `[minecraft.]killed:<entity>`
    - 当玩家杀死指定的实体时加分
- `[minecraft.]killed_by:<entity>`
    - 当玩家被指定的实体杀死时加分
- `[minecraft.]killed_for:<damage cause>`
    - 当玩家由于指定的原因死亡时加分
- `[minecraft.]mined:<block>`
    - 当玩家挖掘指定的方块时加分
    - 抵消：当玩家放置指定的方块时减分
- `[minecraft.]placed:<block>`
    - 当玩家放置指定的方块时加分
    - 抵消：当玩家挖掘指定的方块时减分

## Option

- 见 [option.js](./option.js)
- `enable_creative`
    - 允许统计创造模式下的行为
    - 默认：开启
- `enable_cancel_out`
    - 对部分统计项启用抵消
    - 默认：关闭
- `enable_confirm`
    - 启用删除记分板时的警告
    - 默认：开启
