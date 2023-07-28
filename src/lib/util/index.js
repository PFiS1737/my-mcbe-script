export function each(target, callbackfn, thisArg) {
    if (Array.isArray(target)) target.forEach(callbackfn, thisArg)
    else if (target && target[Symbol.iterator]) for (let item of target) callbackfn.call(thisArg, item, target)
    else if (typeof target === "object") each(Object.keys(target), (key, i) => callbackfn.call(thisArg, target[key], key, i, target))
}

export async function eachAsync(target, asyncfn, thisArg) {
    if (Array.isArray(target)) for (let i = 0; i < target.length; i++) await asyncfn.call(thisArg, target[i], i, target)
    else if (target && target[Symbol.iterator]) for (let item of target) await asyncfn.call(thisArg, item, target)
    else if (typeof target === "object") await eachAsync(Object.keys(target), async (key, i) => await asyncfn.call(thisArg, target[key], key, i, target))
}

export function safeEval(code, context = {}) {
    const fn = new Function(...Object.keys(context), `return ${code}`)
    return fn(...Object.values(context))
}

export function deserialize(str) {
    try {
        return JSON.parse(str)
    } catch (err) {
        // console.warn(`Could not use \`JSON.parse()\` to deserialise the string, trying \`safeEval()\`.`, { string: str })
        return safeEval(`(${str})`)
    }
}

export const AsyncFunction = (async function() {}).constructor

export function arraySample(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
}

export function arrayAt(arr, index) {
    return index >= 0
        ? arr[index]
        : arr[arr.length + index]
}

export function toCamelCase(str) {
    return str.replace(/(\w)[\. _-](\w)/g, (_, $1, $2) => $1 + $2.toUpperCase())
}
