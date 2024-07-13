import type { Vector3 as IVector3 } from "@minecraft/server"

import { serialize } from "../util"

/**
 * Class representing an N-dimensional vector.
 */
export class VectorN implements IVector3 {
  axes: number[]

  /**
   * Create a vector.
   * @param axes - The axes of the vector.
   */
  constructor(...axes: number[]) {
    this.axes = axes
  }

  get x() {
    return this.get(0)
  }
  set x(value) {
    this.set(0, value)
  }
  get y() {
    return this.get(1)
  }
  set y(value) {
    this.set(1, value)
  }
  get z() {
    return this.get(2)
  }
  set z(value) {
    this.set(2, value)
  }
  get w() {
    return this.get(3)
  }
  set w(value) {
    this.set(3, value)
  }

  /**
   * Create a vector.
   * @param vector - The vector wrote in array or string.
   * @returns The vector.
   */
  static create(vector: number[] | string): VectorN {
    if (Array.isArray(vector)) return new this(...vector)
    if (typeof vector === "string") return this.parse(vector)

    throw new Error(`Can't create vector for ${serialize(vector)}`)
  }

  /**
   * Parse a string to vector.
   * @param vectorStr - The string to parse.
   * @returns The vector.
   */
  static parse(vectorStr: string): VectorN {
    return this.create(vectorStr.split(" ").map(Number))
  }

  /**
   * Convert the vector to a string.
   * @returns The string representation of the vector.
   */
  stringify(): string {
    // @ts-ignore
    return this[Symbol.toPrimitive]("string")
  }

  /**
   * Convert the vector to an array.
   * @returns The array representation of the vector.
   */
  toArray(): Array<number> {
    return [...this]
  }

  /**
   * Convert the vector to a primitive value.
   * @param hint - The type hint.
   * @returns The string representation or the vector itself.
   */
  [Symbol.toPrimitive](hint: string): string | VectorN {
    if (hint === "string") return this.axes.join(" ")
    return this
  }

  /**
   * Iterator for the vector axes.
   * @returns The iterator for the axes.
   */
  [Symbol.iterator](): Iterator<number> {
    return this.axes[Symbol.iterator]()
  }

  /**
   * Get the number of dimensions of the vector.
   * @returns The number of dimensions.
   */
  get dimensions(): number {
    return this.axes.length
  }

  /**
   * Get an axis of the vector by index.
   * @param index - The index of the component.
   * @returns The component value.
   */
  get(index: number): number {
    return this.axes[index]
  }

  /**
   * Set an axis of the vector by index.
   * @param index - The index of the component.
   * @param value - The value to set.
   */
  set(index: number, value: number) {
    this.axes[index] = value
  }

  /**
   * Apply a function to each axes of the vector and return a new vector.
   * @param callbackfn - The function to apply.
   * @returns The new vector.
   */
  map(
    callbackfn: (vale: number, index: number, array: number[]) => number
  ): VectorN {
    return VectorN.create(this.axes.map(callbackfn))
  }
}
