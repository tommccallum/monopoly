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
        this.banker = banker
    }

    addTitleDeed(property)
    {
        this.banker.titleDeeds.push(property)
    }

    payOut(player, amount) {
        try {
            this.banker.changeBalance(-amount)
        } catch( error ) {
            if ( this.banker.balance <= 0 ) {
                this.notify(new Event.Event(this, "announcement", {text: "Quantitative easing" }))
                this.banker.changeBalance(1000000)
                this.notify(new Event.Event(this, "bankBalanceChange", { old: oldBalance, new: this.banker.balance}))
            }
        }
        player.addIncome(amount)
    }

    payIn(amount) {
        const oldBalance = this.banker.balance
        this.banker.balance += amount
        this.notify(new Event.Event(this, "bankBalanceChange", {old:oldBalance, new: this.banker.balance}))
    }

    /**
     * Forward all events from our banker model on to our listeners
     * @param {Event} event 
     */
    onAny(event) {
        if ( event.source == this.banker ) {
            this.notify(event)
        }
    }

    onBankrupt(event) {
        console.log("Bankrupt event fired")
    }

    onPurchase(event) {
        console.log("Purchase event fired")
        if ( event.data.square.owner == null ) {
            if ( event.source.balance >= event.data.square.getPurchasePrice() ) {
                this.payIn(event.data.square.getPurchasePrice())
                event.source.balance -= event.data.square.getPurchasePrice()
                event.source.properties.push(event.data.square)
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
        console.log("Sell event fired")
        if ( event.data.square.owner == event.source ) {
            // TODO fix with proper rules and adjust for houses and hotels
            // simplified to sell at purchase price
            event.source.addIncome(event.data.square.getPurchasePrice())
            event.data.square.owner = null
            this.banker.balance -= event.data.square.getPurchasePrice()
        }
        this.notify(new Event.Event(this, "announcement", {text: `Sale of '${event.data.square.name}' was not successful, you do not own the property`}))
    }
}

module.exports = {
    Controller: BankerController
}