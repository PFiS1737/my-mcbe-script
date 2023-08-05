# vein-mining

连锁挖矿，连锁砍树

## Usage

目前支持的方块：
- 所有原木
- 所有菌柄（不是蘑菇柄）
- 所有矿石
    - 包括远古残骸
    - 由于红石的特殊 id，目前无法生效
    - 虽然修起来很简单，但我决定摆了
- 黑曜石（发光黑曜石除外）
- 水晶块

## Option

见 [option.js](./option.js)

- `condition`
    - 触发条件
    - 默认：仅潜行时
- `max_amount`
    - 最多检测的方块数量（并非最终挖掘的方块数）
    - 默认：64
- `auto_collection`
    - 自动收集掉落物及经验（绕过经验修补）
    - 默认：关闭
- `protect_tools`
    - 保护工具，防止其损坏
    - 默认：关闭
- `enable_edge`
    - 是否检测仅棱相连的方块
    - 默认：关闭
- `enable_diagonal`
    - 是否检测仅角相连的方块
    - 默认：关闭

## 多人使用

其他玩家加入游戏后，需使用 `/reload` 刷新脚本。