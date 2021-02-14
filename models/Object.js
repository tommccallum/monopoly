class Object
{
    constructor() {
        this.listeners = {}
        this.listenerToEverything = []
    }

    addListener(eventName, object) 
    {
        if ( typeof(object) == "undefined" ) {
            this.listenerToEverything.push(eventName)
            return
        }
        if ( eventName in this.listeners) {
            this.listeners[eventName].push(object)
        } else {
            this.listeners[eventName] = []
            this.listeners[eventName].push(object)
        }
    }

    notify(event) 
    {
        const eventFn = "on"+event.name.charAt(0).toUpperCase(1) + event.name.slice(1)
        for(let listener of this.listenerToEverything) {
            if (eventFn in listener) {
                listener[eventFn](event)
            } else if ( "onAny" in listener ) {
                listener.onAny(event)
            }
        }
        if ( event.name in this.listeners ) {
            const eventFn = "on"+event.name.charAt(0).toUpperCase(1) + event.name.slice(1)
            for(let listener of this.listeners[event.name]) {
                if (eventFn in listener) {
                    listener[eventFn](event)
                }
            }
        }
    }
}

module.exports = {
    Object: Object
}