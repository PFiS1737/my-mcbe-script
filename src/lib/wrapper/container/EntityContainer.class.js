import { Container } from "./Container.class.js"

export class EntityContainer extends Container {
    constructor(entity, container) {
        super(container)
        
        this._entity = entity
    }
    
    get location() {
        return this._entity.location
    }
    get dimension() {
        return this._entity.dimension
    }
    
    addItem(itemStack) {
        const success = this.tryAddItem(itemStack)
        
        if (!success) this.dimension.spawnItem(
            itemStack, this.location
        )
    }
}