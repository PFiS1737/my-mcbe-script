import { EntityDamageCause } from "@minecraft/server"

export default ({ player, target, callback }) => ({
    events: {
        entityDie: {
            option: {
                entityTypes: [target]
            },
            listener(event) {
                const cause = event.damageSource.cause
                const source = event.damageSource.damagingEntity
                if (
                    cause === EntityDamageCause.entityAttack &&
                    source.id === player.id
                ) callback({
                    type: "increase",
                    value: 1
                })
            }
        }
    }
})
