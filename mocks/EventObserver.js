const Object = require("../models/Object")

class Observer extends Object.Object
{
    constructor()
    {
        super()
        this.callbacks = []
    }

    add(callback)
    {
        this.callbacks.push(callback)
    }

    onAny(event)
    {
        for( let callback of this.callbacks) {
            callback(event)
        }
    }

}

module.exports = 
{
    EventObserver: Observer
}