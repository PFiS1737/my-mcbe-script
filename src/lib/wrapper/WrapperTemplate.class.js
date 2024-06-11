export class WrapperTemplate {
  static wrap(...args) {
    return new WrapperTemplate(...args)
  }
  static tryWrap(...args) {
    try {
      return new WrapperTemplate(...args)
    } catch (err) {}
  }

  static match() {
    throw new Error("Call without override.")
  }
}
