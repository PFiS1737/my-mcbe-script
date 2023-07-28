import { Entity } from "@minecraft/server"

import { each } from "../../util/index.js"
import { removeMinecraftNamespace } from "../../util/game.js"
import { Location, Directions } from "../../location/index.js"

import { WrapperTemplate } from "../WrapperTemplate.class.js"

export class WrappedEntity extends WrapperTemplate {
    constructor(entity) {
        if (!(entity instanceof Entity))
            throw new TypeError("Parameter is not an instance of Entity.")
        
        super()
        
        this.entity = entity
        this.id = entity.id
        this.location = Location.create(entity.location)
        this.dimension = entity.dimension
        
        const components = entity.getComponents()
        each(components, component => {
            this.components.set(removeMinecraftNamespace(component.typeId), component)
        })
    }
    
    components = new Map()
    
    get isSneaking() {
        return this.entity.isSneaking
    }
    
    getFacingDirectionXZ() {
        const rotation = this.entity.getRotation().y
        
        if (rotation > -135 && rotation <= -45) return Directions.East
        else if (rotation > -45 && rotation <= 45) return Directions.South
        else if (rotation > 45 && rotation <= 135) return Directions.West
        else if (rotation > 135 || rotation <= -135) return Directions.North
    }
}
