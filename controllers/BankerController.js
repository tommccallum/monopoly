const Object = require("../models/Object")

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
        const oldBalance = this.banker.balance
        this.banker.balance -= amount
        this.notify({ name: "bankBalanceChange", old:oldBalance, new: this.banker.balance})
        player.addIncome(amount)
        if ( this.banker.balance < 0 ) {
            this.notify({ name: "announcement", text: "Quantitative easing" })
            this.banker.balance = 1000000
            this.notify({ name: "bankBalanceChange", old: oldBalance, new: this.banker.balance})
        }
    }

    payIn(amount) {
        const oldBalance = this.banker.balance
        this.banker.balance += amount
        this.notify({ name: "bankBalanceChange", old:oldBalance, new: this.banker.balance})
    }

    onBankrupt(event) {
        console.log("Bankrupt event fired")
    }

    onPurchase(event) {
        console.log("Purchase event fired")
        if ( event.square.owner == null ) {
            if ( event.player.balance >= event.square.getPurchasePrice() ) {
                this.payIn(event.square.getPurchasePrice())
                event.player.balance -= event.square.getPurchasePrice()
                event.player.properties.push(event.square)
                this.notify({name: "announcement", text: `Purchase of '${event.square.name}' was successful`})
                return
            } else {
                this.notify({name: "announcement", text: `Purchase of '${event.square.name}' was not successful, too expensive`})
                return
            }
        }
        this.notify({name: "announcement", text: `Purchase of '${event.square.name}' was not successful, property already owned`})
    }

    onSale(event) {
        console.log("Sell event fired")
        if ( event.square.owner == event.player ) {
            // TODO fix with proper rules and adjust for houses and hotels
            // simplified to sell at purchase price
            event.player.addIncome(event.square.getPurchasePrice())
            event.square.owner = null
            this.banker.balance -= event.square.getPurchasePrice()
        }
        this.notify({name: "announcement", text: `Sale of '${event.square.name}' was not successful, you do not own the property`})
    }
}

module.exports = {
    Controller: BankerController
}