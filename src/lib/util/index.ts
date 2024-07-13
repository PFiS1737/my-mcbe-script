export function each(target, callbackfn, thisArg) {
  if (Array.isArray(target)) target.forEach(callbackfn, thisArg)
  else if (target?.[Symbol.iterator])
    for (const item of target) callbackfn.call(thisArg, item, target)
  else if (typeof target === "object")
    each(Object.keys(target), (key, i) =>
      callbackfn.call(thisArg, target[key], key, i, target)
    )
}

export async function eachAsync(target, asyncfn, thisArg) {
  if (Array.isArray(target))
    for (let i = 0; i < target.length; i++)
      await asyncfn.call(thisArg, target[i], i, target)
  else if (target?.[Symbol.iterator])
    for (const item of target) await asyncfn.call(thisArg, item, target)
  else if (typeof target === "object")
    await eachAsync(
      Object.keys(target),
      async (key, i) => await asyncfn.call(thisArg, target[key], key, i, target)
    )
}

export function safeEval(code: string, context = {}) {
  const fn = new Function(...Object.keys(context), `return ${code}`)
  return fn(...Object.values(context))
}

export type Serializable =
  | Set<Serializable>
  | Map<Serializable, Serializable>
  | { [key: string]: Serializable }
  | Array<Serializable>
  | string
  | number
  | boolean

export function serialize(obj: Serializable): string {
  if (obj instanceof Set) return `new Set(${serialize(Array.from(obj))})`

  if (obj instanceof Map)
    return `new Map(${serialize(Array.from(obj.entries()))})`

  if (Array.isArray(obj)) return `[${obj.map(serialize).join(",")}]`

  if (typeof obj === "object" && obj !== null) {
    return `{${Object.entries(obj)
      .map(([key, value]) => `${serialize(key)}: ${serialize(value)}`)
      .join(",")}}`
  }
  return JSON.stringify(obj)
}

export function deserialize(str: string): Serializable {
  try {
    return JSON.parse(str)
  } catch (err) {
    // console.warn(`Could not use \`JSON.parse()\` to deserialise the string, trying \`safeEval()\`.`, { string: str })
    return safeEval(`(${str})`)
  }
}

export function isAsyncFunc(func: Function): boolean {
  return Object.prototype.toString.call(func) === "[object AsyncFunction]"
}

export function arraySample<T>(arr: Array<T>): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function toCamelCase(str: string) {
  return str.replace(/(\w)[\. _-](\w)/g, (_, $1, $2) => $1 + $2.toUpperCase())
}
