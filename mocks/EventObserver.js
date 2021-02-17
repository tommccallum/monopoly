const Object = require("../models/Object")

class Observer extends Object.Object
{
    constructor()
    {
        super()
        this.callbacks = []
        this.eventsCaught = 0
    }

    getEventsCaught() {
        return this.eventsCaught
    }

    add(callback)
    {
        this.callbacks.push(callback)
    }

    onAny(event)
    {
        for( let callback of this.callbacks) {
            this.eventsCaught++
            callback(event)
        }
    }

}

module.exports = 
{
    EventObserver: Observer
}