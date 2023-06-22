# commands

## Overview

一个对命令的包装库，用于快速运行和注册命令

~~使用我的另一个库 [mcbe-command-parser]()~~

灵感来源：[commands](https://github.com/JaylyDev/ScriptAPI/tree/main/scripts/commands)

## Usage

### Import

```javascript
// import
import Commands from "./index.js"
```

### Method

- Commands.asyncRun
    - `asyncRun(commandString: string, target: Dimension | Entity): Promise<CommandResult|void>`
    - 异步地执行一个命令，支持运行使用 `Commands.register` 注册的命令
- Commands.register
    - `register(prefix: string, command: string, callback: (argv: string[], sender: Player) => void): void`
    - 注册一个命令
