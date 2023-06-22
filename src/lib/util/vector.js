export function parse(vecStr, __constructor) {
    return new __constructor(...vecStr.split(" ").map(e => Number(e)))
}

export function stringify(vec) {
    return `${vec.x} ${vec.y} ${vec.z}`
}

export function normalized(vec, __constructor) {
    return new __constructor(vec.x, vec.y, vec.z)
}
