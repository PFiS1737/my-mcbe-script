export class BetterConsole {
    static error(err) {
        console.error(`${err}\n${err.stack}`)
    }
}
