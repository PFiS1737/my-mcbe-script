/**
 * Class representing an N-dimensional vector.
 */
export class VectorN {
  /**
   * Create a vector.
   * @param {...number} axes - The axes of the vector.
   */
  constructor(...axes) {
    this.axes = axes
  }

  /**
   * Create a vector.
   * @param {Array<number>|string} vector - The vector wrote in array or string.
   * @returns {VectorN} The vector.
   */
  static create(vector) {
    if (Array.isArray(vector)) return new this(...vector)
    if (typeof vector === "string") return this.parse(vector)
  }

  /**
   * Parse a string to vector.
   * @param {string} vectorStr - The string to parse.
   * @returns {VectorN} The vector.
   */
  static parse(vectorStr) {
    return this.create(vectorStr.split(" ").map(Number))
  }

  /**
   * Convert the vector to a string.
   * @returns {string} The string representation of the vector.
   */
  stringify() {
    // @ts-ignore
    return this[Symbol.toPrimitive]("string")
  }

  /**
   * Convert the vector to an array.
   * @returns {Array<number>} The array representation of the vector.
   */
  toArray() {
    return [...this]
  }

  /**
   * Convert the vector to a primitive value.
   * @param {string} hint - The type hint.
   * @returns {string|VectorN} The string representation or the vector itself.
   */
  [Symbol.toPrimitive](hint) {
    if (hint === "string") return this.axes.join(" ")
    return this
  }

  /**
   * Iterator for the vector axes.
   * @returns {Iterator<number>} The iterator for the axes.
   */
  [Symbol.iterator]() {
    return this.axes[Symbol.iterator]()
  }

  /**
   * Get the number of dimensions of the vector.
   * @returns {number} The number of dimensions.
   */
  get dimensions() {
    return this.axes.length
  }

  /**
   * Get an axis of the vector by index.
   * @param {number} index - The index of the component.
   * @returns {number} The component value.
   */
  get(index) {
    return this.axes[index]
  }

  /**
   * Set an axis of the vector by index.
   * @param {number} index - The index of the component.
   * @param {number} value - The value to set.
   */
  set(index, value) {
    this.axes[index] = value
  }

  /**
   * Apply a function to each axes of the vector and return a new vector.
   * @param {function(number, number): number} callbackfn - The function to apply.
   * @returns {VectorN} The new vector.
   */
  map(callbackfn) {
    return VectorN.create(this.axes.map(callbackfn))
  }
}
