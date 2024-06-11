export class WrapperTemplate {
  static wrap(...args) {
    // return the class extending this
    // @ts-ignore
    return new this(...args)
  }
  static tryWrap(...args) {
    try {
      // return the class extending this
      // @ts-ignore
      return new this(...args)
    } catch (err) {}
  }

  static match() {
    throw new Error("Call without override.")
  }
}
