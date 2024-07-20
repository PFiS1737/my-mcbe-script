export type Implementable<T> = {
  [K in keyof T]: T[K]
}
