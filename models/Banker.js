const Object = require("./Object")
const GameData = require("./data")
const Property = require("./Property")

class Banker extends Object.Object {
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
    }

    payOut(player, amount) {
        this.balance -= amount
        player.addIncome(amount)
        if ( this.balance < 0 ) {
            notify({ name: "announcement", text: "Quantitative easing" })
            this.balance = 1000000
        }
    }

    payIn(amount) {
        this.balance += amount
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
        }
        this.notify({name: "announcement", text: `Sale of '${event.square.name}' was not successful, you do not own the property`})
    }
}

module.exports = {
    Banker: Banker
}