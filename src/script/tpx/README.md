# Tpx

> 快捷传送

## Grammar

- !tpx set|-s [name] [disposable]
    - 设置一个传送点，
    - name: 传送点名称，默认为 `"default"`，下同
    - disposable: 是否为一次性传送点，默认为 `false`
- !tpx remove|rm|-r [name]
    - 删除一个传送点
- !tpx list|ls|-l
    - 列出所有传送点
- !tpx option|opt|-o
    - 打开设置页面
- !tpx back|kb|-b
    - 返回上一个传送位置
- !tpx map|-m
    - 在主世界和地狱直接映射
    - 仅旁观者模式并飞行时
- !tpx help|-h
    - 打印帮助

### 可选
- !home set
    - 设置家
    - !tpx set default_home
- !home
    - 回家
    - !tpx default_home
- !back
    - 返回
    - !tpx back

## Option

- 见 `./option.js`

## 多人使用

其他玩家加入游戏后，使用 `/reload` 刷新脚本即可。
