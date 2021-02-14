/**
 * Basic event class that other objects can listen in on
 */
class Event
{
    constructor(source, name, data)
    {
        this.source = source
        this.name = name
        if ( typeof(data) == "undefined" ) {
            this.data = null
        } else {
            this.data = data
        }
    }

    getExpectedHandlerName() {
        return "on"+this.name.charAt(0).toUpperCase(1) + this.name.slice(1)
    }
}

module.exports = {
    Event: Event
}