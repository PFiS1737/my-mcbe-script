# Tpx

> 快捷传送

## Grammar

- `!tpx set|-s [name] [disposable]`
    - 设置一个传送点，
    - name: 传送点名称，默认为 `"default"`，下同
    - disposable: 是否为一次性传送点，默认为 `false`
- `!tpx remove|rm|-r [name]`
    - 删除一个传送点
- `!tpx list|ls|-l`
    - 列出所有传送点
- `!tpx option|opt|-o`
    - 打开设置页面
- `!tpx back|kb|-b`
    - 返回死亡点（如果有）
    - 返回上一个传送位置
- `!tpx map|-m`
    - 在主世界和地狱直接映射
    - 仅旁观者模式并飞行时
- `!tpx help|-h`
    - 打印帮助

### 可选
- `!home set`
    - 设置家
    - `!tpx set __home__`
- `!home`
    - 回家
    - `!tpx __home__`
- `!back`
    - 返回
    - `!tpx back`

## Option

- 见 [option.js](./option.js)
- `auto_back_point`
    - 允许使用 tpx 传送时自动添加返回点
- `back_after_death`
    - 允许死亡时自动添加返回点
    - 使用 back 命令返回死亡点时，不会在原地添加返回点
- `back_cmd`
    - 允许使用独立的 back 命令
- `home_cmd`
    - 允许使用独立的 home 命令

## 多人使用

其他玩家加入游戏后，使用 `/reload` 刷新脚本即可。
