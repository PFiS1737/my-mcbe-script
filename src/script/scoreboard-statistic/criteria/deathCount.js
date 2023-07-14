export default ({ player, callback }) => ({
    events: {
        entityDie: {
            option: {
                entities: [player]
            },
            listener() {
                callback({
                    type: "increase",
                    value: 1
                })
            }
        }
    }
})
