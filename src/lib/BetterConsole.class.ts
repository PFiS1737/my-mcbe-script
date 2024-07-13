export class BetterConsole {
  static error(err: Error) {
    console.error(`${err}\n${err.stack}`)
  }
}
