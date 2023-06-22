import { asyncRun } from "@/util/game.js"

import { TpxDB } from "./db.js"
import { tpxOption } from "./option.js"

export const setupHandler = async (target, opt) => {
    const tpxDB = await asyncRun(() => new TpxDB(target))
    return {
        async SET({ name = "default", option = {} }) {
            const info = await tpxDB.set(Object.assign({ name }, option))
            if (name !== "__back__") return { info }
        },
        async REMOVE({ name = "default" }) {
            return await tpxDB.remove(name)
        },
        async TELEPORT({ name = "default" }) {
            const info = await tpxDB.get(name)
            if (info) {
                if (
                    tpxOption
                        .getPlayer(target)
                        .getItemVal("enable_auto_back_point")
                ) {
                    await this.SET({
                        name: "__back__",
                        option: {
                            disposable: true,
                            force: true
                        }
                    })
                }
                await asyncRun(() => target.teleport(info.location, {
                    dimension: info.dimension,
                    checkForBlocks: false,
                    keepVelocity: false
                }))
                return { info }
            }
        },
        LIST() {
            const datas = tpxDB.getAll().map(({ text }) => text)
            if (datas.length) return { msg: datas }
        },
        async MAP({ dimension, option = {} }) {
            
        }
    }
}
