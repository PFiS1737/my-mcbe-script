export default ({ player, target, callback }) => ({
    events: {
        blockBreak: {
            listener(event) {
                const blockPermutation = event.brokenBlockPermutation
                const source = event.player
                if (
                    source.id === player.id &&
                    blockPermutation.type.id === target
                ) callback({
                    type: "increase",
                    value: 1
                })
            }
        },
        blockPlace: {
            listener(event) {
                const block = event.block
                const source = event.player
                if (
                    source.id === player.id &&
                    block.typeId === target
                ) callback({
                    type: "decrease",
                    value: 1
                })
            }
        }
    }
})