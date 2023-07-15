export default ({ player, callback }) => ({
    events: {
        entityHealthChanged: {
            option: {
                entities: [player]
            },
            listener(event) {
                callback({
                    type: "reset",
                    value: event.newValue
                })
            }
        },
        playerSpawn: {
            listener() {
                callback({
                    type: "reset",
                    value: 20
                })
            }
        }
    }
})
