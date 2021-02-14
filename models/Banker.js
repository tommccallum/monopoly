const Object = require("./Object")
const Event = require("./Event")

/**
 * The banker listens to all the players and carries out purchases and mortgages etc.
 * We implement the relationship between player and banker through the Observer pattern
 * so that they are less dependent on each other.
 * 
 * The model should be a simple data structure in essence changed only by the controller.
 */

class BankerModel extends Object.Object  {
    constructor() {
        super()
        this.balance = 1000000
        this.titleDeeds = []
        this.houseCount = 32
        this.hotelCount = 12
    }

    addTitleDeed(property)
    {
        this.titleDeeds.push(property)
        this.notify(new Event.Event(this, "newTitleDeed"))
    }

    changeBalance(amount) 
    {
        if ( this.balance + amount <= 0 ) {
            throw new Error("banker is bankrupt - oops!")
        }
        this.notify(new Event.Event(this, "beforeBalanceChanged", { amount: amount}))
        this.balance += amount;
        this.notify(new Event.Event(this, "afterBalanceChanged", {amount: amount}))
    }
}

module.exports = {
    Model: BankerModel
}