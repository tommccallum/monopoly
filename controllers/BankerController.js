const Object = require("../models/Object")
const Event = require("../models/Event")

/**
 * The banker listens to all the players and carries out purchases and mortgages etc.
 * We implement the relationship between player and banker through the Observer pattern
 * so that they are less dependent on each other.
 * 
 * This has direct access to the Model and receives events on behalf of the model.
 * A View will listen to the control for changes.
 */

class BankerController extends Object.Object {
    constructor(banker) {
        super()
        this.model = banker
    }

    addTitleDeed(property)
    {
        this.model.titleDeeds.push(property)
    }

    payOut(player, amount) {
        try {
            this.model.changeBalance(-amount)
        } catch( error ) {
            if ( this.model.balance <= 0 ) {
                this.notify(new Event.Event(this, "announcement", {text: "Quantitative easing" }))
                this.model.changeBalance(1000000)
                this.notify(new Event.Event(this, "bankBalanceChange", { old: oldBalance, new: this.model.balance}))
            }
        }
        player.addIncome(amount)
    }

    payIn(amount) {
        const oldBalance = this.model.balance
        this.model.balance += amount
        this.notify(new Event.Event(this, "bankBalanceChange", {old:oldBalance, new: this.model.balance}))
    }

    /**
     * Forward all events from our banker model on to our listeners
     * @param {Event} event 
     */
    onAny(event) {
        if ( event.source == this.model ) {
            this.notify(event)
        }
    }

    onPayBank(event) {
        if ( !("amount" in event.data) ) {
            throw new Error("amount property not set in event.data")
        }
        this.payIn(event.data.amount)
    }

    onBankrupt(event) {
        console.log("Bankrupt event fired")
    }

    onPurchase(event) {
        if ( !("square" in event.data) ) {
            throw new Error("square property not set in event.data")
        }
        if ( event.data.square.owner == null ) {
            if ( event.source.getBalance() >= event.data.square.getPurchasePrice() ) {
                this.payIn(event.data.square.getPurchasePrice())
                event.source.withdraw(event.data.square.getPurchasePrice())
                event.source.addProperty(event.data.square)
                this.notify(new Event.Event(this, "announcement", {text: `Purchase of '${event.data.square.name}' was successful`}))
                return
            } else {
                this.notify(new Event.Event(this, "announcement", {text: `Purchase of '${event.data.square.name}' was not successful, too expensive`}))
                return
            }
        }
        this.notify(new Event.Event(this, "announcement", {text: `Purchase of '${event.data.square.name}' was not successful, property already owned`}))
    }

    onSale(event) {
        if ( !("square" in event.data) ) {
            throw new Error("square property not set in event.data")
        }
        const property = event.data.square
        if ( property.owner == event.source ) {
            // TODO adjust for real selling price
            this.model.balance -= property.getPurchasePrice()
            event.source.addIncome(property.getPurchasePrice())
            event.source.removeProperty(property)
            this.notify(new Event.Event(this, "announcement", {text: `Congratulations, the sale of '${property.name}' was successful.`}))
        } else {
            this.notify(new Event.Event(this, "announcement", {text: `Sale of '${property.name}' was not successful, you do not own the property`}))
        }
    }

    onBuyHouse(event) {
        if ( !("square" in event.data) ) {
            throw new Error("square property not set in event.data")
        }
        const player = event.source
        const property = event.data.square
        if ( property.owner == player ) {
            // TODO remove this magic number and get it from the gamedata
            if ( property.houseCount >= 4 ) {
                this.notify(new Event.Event(this, "announcement", {text: `Purchase of a house for '${event.data.square.name}' was not successful, you already have 4 houses`}))
                return
            }
            if ( player.getBalance() >= property.getHousePurchasePrice() ) {
                this.payIn(property.getHousePurchasePrice())
                player.withdraw(property.getHousePurchasePrice())
                property.houseCount++
                this.notify(new Event.Event(this, "announcement", {text: `Purchase of a house for '${event.data.square.name}' was successful`}))
                return
            } else {
                this.notify(new Event.Event(this, "announcement", {text: `Purchase of a house for '${event.data.square.name}' was not successful, too expensive`}))
                return
            }
        }
        this.notify(new Event.Event(this, "announcement", {text: `Purchase of a house for '${event.data.square.name}' was not successful, property already owned`}))
    }

    onBuyHotel(event)
    {
        if ( !("square" in event.data) ) {
            throw new Error("square property not set in event.data")
        }
        const player = event.source
        const property = event.data.square
        if ( property.owner == player ) {
            // TODO remove this magic number and get it from the gamedata
            if ( property.houseCount < 4 ) {
                // TODO remote the magic 4 from this
                this.notify(new Event.Event(this, "announcement", {text: `Purchase of a house for '${event.data.square.name}' was not successful, it requires 4 houses for a hotel`}))
                return
            }
            if ( player.getBalance() >= property.getHotelPurchasePrice() ) {
                this.payIn(property.getHotelPurchasePrice())
                player.withdraw(property.getHotelPurchasePrice())
                property.houseCount=0
                property.hotelCount++
                this.notify(new Event.Event(this, "announcement", {text: `Purchase of a hotel for '${event.data.square.name}' was successful`}))
                return
            } else {
                this.notify(new Event.Event(this, "announcement", {text: `Purchase of a hotel for '${event.data.square.name}' was not successful, too expensive`}))
                return
            }
        }
        this.notify(new Event.Event(this, "announcement", {text: `Purchase of a hotel for '${event.data.square.name}' was not successful, property already owned`}))
    }


    onPayDividend(event) {
        if ( !("amount" in event.data) ) {
            throw new Error("amount property not set in event.data")
        }
        this.payOut(event.source, event.data.amount)
    }
}

module.exports = {
    Controller: BankerController
}