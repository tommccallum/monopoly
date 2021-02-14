// Design Pattern used: Observer
// This is used so that an object can listen to anothers events.
// This is normally implemented in one of two forms, listen to ALL events and listen to AN event.
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

    /**
     * Notifies listeners of an event.  This is implemented slightly differently in that
     * we look for a function on* e.g. onPurchase, when an event fires.  Where you cannot
     * do this in the language you might have a onPropertyChange handler that will then
     * contain a switch or if statements to sort the events.
     * @param {object} event 
     */
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