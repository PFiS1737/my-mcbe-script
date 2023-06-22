# database

## Overview

一个基于记分版的数据库，用于持续保存数据

灵感来源：[jaylydb](https://github.com/JaylyDev/ScriptAPI/tree/main/scripts/jaylydb)

## Usage

### Import

```javascript
// import
import Database from "./index.js"

// create or open a database
const db = Database.open("my-db")
```

### Method

- open
    - `static open(player, dbName): Database`
- set
    - `set(key: string, value: any): void`
    - 添加一组数据
- get
    - `get(key: string): any`
    - 获得指定的数据
- has
    - `has(key: string): boolean`
    - 检查数据是否存在
- delete
    - `delete(key: string): boolean`
    - 删除一组数据
- clear
    - `clear(): void`
    - 清空数据库
- entries
    - `entries(): IterableIterator<[string, any]>`
    - return the entries of the database
- keys
    - `keys(): IterableIterator<string>`
    - return the keys
- values
    - `values(): IterableIterator<any>`
    - return the values
- Symbol.iterator
    - `[Symbol.iterator](): Symbol.iterator<[string, any]>`
    - iterate over the entries

### Notes

- 创建的所有记分版以 `db:` 开头