const { Object } = require("../models/Object")
const { Event } = require("../models/Event")
const { ActionCollection } = require("../models/ActionCollection")
const Commands = require("../models/Commands")

class PlayerController extends Object {
    constructor(playerModel, board, dice, requiredHousesBeforeBuyHotel) {
        super()
        this.model = playerModel
        playerModel.addListener(this)

        // this state is transient and would not be required to 
        // load a player from a "save" game.
        this.board = board
        this.dice = dice
        this.lastThrow = null       // could this be owned by dice?
        this.availableMoves = new ActionCollection(this.model.isHuman)

        // this comes from game state
        this.requiredHousesBeforeBuyHotel = requiredHousesBeforeBuyHotel
    }

    getLastThrow() {
        return this.lastThrow
    }

    getIndex() {
        return this.model.index
    }

    getBalance() {
        return this.model.balance
    }


    isInJail() {
        return this.model.isInJail()
    }

    addIncome(amount) {
        this.model.addIncome(amount)
    }

    withdraw(amount) {
        this.model.withdraw(amount)
    }

    addProperty(property) {
        property.owner = this
        this.model.properties.push(property)
    }

    removeProperty(property) {
        const index = this.model.properties.indexOf(property)
        if ( index > -1 ) {
            property.owner = null
            this.model.properties.splice(index,1)
        } else {
            throw new Error("player does not own property!")
        }
    }

    startTurn() {
        this.notify(new Event(this, "announcement", { text: `\n${this.model.token.name} (player ${this.model.index}) is now the current player` }))
        this.model.sendStatus()
        this.availableMoves = new ActionCollection(this.model.isHuman)
        this.availableMoves.add("L", "List Properties", new Commands.PropertyList(this))
        this.availableMoves.add("R", "Roll dice", new Commands.Roll(this))
    }

    // TODO make sure that we continue until the user chooses Pass otherwise when actions fail they cannot sell stuff to get money
    generateMoves() {
        this.availableMoves.add("L", "List Properties", new Commands.PropertyList(this))
        if (this.model.isInJail()) {
            // player gets to use a get out of jail free card
            if (this.model.hasCard("GetOutOfJailFreeCard")) {
                this.availableMoves.add("J", "Use get out of jail free card")
            }
            // player gets to pay $50
            this.availableMoves.add("P", "Pay $50 to leave jail")
            // player can roll and get a double
            this.availableMoves.add("R", "Attempt to roll a double", new Commands.Roll(this))
            // if you do not throw a double after 3 turns you have to pay $50 to the banker
            // if using the get out of jail free card then they can have their go as usual
        } else {
            const square = this.board.getSquareAtIndex(this.model.location)
            const options = square.getOptions(this)
            this.availableMoves.addAll(options)
            if (this.model.properties.length > 0) {
                // we have the option to sell or mortgage any property and to pass of course
                this.availableMoves.add("M", "Mortgage property", new Commands.Mortgage(this))
                this.availableMoves.add("S", "Sell property", new Commands.Sell(this))

                if ( this.model.hasCompleteUnmortgagedColorGroup() ) {
                    this.availableMoves.add("H", "Buy a house", new Commands.BuyHouse(this))

                    // we can only buy a hotel if ANY of our properties have 4 houses
                    let canBuyAHotel = false
                    for( let p of this.model.properties ) {
                        if ( p.getHouseCount() >= this.requiredHousesBeforeBuyHotel ) { 
                            canBuyAHotel = true
                            break
                        }
                    }
                    if ( canBuyAHotel ) {
                        this.availableMoves.add("O", "Buy a hotel", new Commands.BuyHotel(this))
                    }
                }
            }
        }
        this.availableMoves.add("P", "Pass", new Commands.Pass(this))
        return this.availableMoves
    }

    /**
     * Get the available moves that the player could do.  For humans we remove any extra sets where the only
     * reasonable move is Pass.  For bots we remove all permanent actions which are for the human users only e.g.
     * listing properties.
     */
    getAvailableMoves() {
        if ( this.availableMoves.containsOnlyPermanentActionsOrPass() ) {
            this.availableMoves.removePermanentActions()
        }
        if ( !this.model.isHuman ) {
            this.availableMoves.removePermanentActions()
        }
        if ( this.availableMoves.isOnlyPassRemaining() ) {
            this.availableMoves.removePass()
        }
        return this.availableMoves;
    }

    // TODO check this works when we go backwards from e.g. 3 to N-3
    move(amount) {
        const oldLocation = this.model.location
        this.model.location = (this.model.location + amount) % this.board.size()
        if (oldLocation > this.model.location && amount > 0) {
            this.notify(new Event(this, "passGo", { text: "Player passed Go!" }))
        }
        this.visitSquare()
    }

    moveTo(squareName) {
        const index = this.board.indexOf(squareName)
        if (this.model.location > index) {
            // pass go
            this.notify(new Event(this, "passGo", { text: "Player passed Go!" }))
        } else {
            this.notify(new Event(this, "announcement", { text: "Player did not pass Go!" }))
        }
        this.model.location = index
        this.visitSquare()
    }

    moveToNearest(squareGroup) {
        const index = this.board.findNearest(squareGroup, this.model.location + 1)
        if (this.model.location > index) {
            // pass go
            this.notify(new Event(this, "passGo", { text: "Player passed Go!" }))
        } else {
            this.notify(new Event(this, "announcement", { text: "Player did not pass Go!" }))
        }
        this.model.location = index
        this.visitSquare()
    }

    makeRepairs(houseCost, hotelCost) {
        const amount = houseCost * this.model.getHouseCount() + hotelCost * this.model.getHotelCount()
        this.model.withdraw(amount)
        this.notify(new Event(this, "payBank", { amount: amount }))
        this.notify(new Event(this, "announcement", { text: `I had to pay ${amount} in repairs! Only got ${this.model.balance} left to spend.` }))
    }

    visitSquare() {
        const square = this.board.getSquareAtIndex(this.model.location)
        this.notify(new Event(this, "announcement", { text: `Player landed on ${square.name}!` }))
        square.visit(this)
        this.generateMoves()
    }

    gotoJailWithoutPassingGo() {
        const jailIndex = this.board.findNearest("jail", this.model.location)
        this.model.location = jailIndex
        this.inJail = true
        this.notify(new Event(this, "announcement", { text: `The ${this.model.token.name} has gone to jail!` }))

        this.visitSquare()
    }

    payTax(amount) {
        this.model.withdraw(amount)
        this.notify(new Event(this, "payBank", { amount: amount }))
        this.notify(new Event(this, "announcement", { text: `I had to pay ${amount} in tax! Only got ${this.model.balance} left to spend.` }))
    }

    payEveryone(amount) {
        this.notify(new Event(this, "payAllPlayers", { amount: amount }))
        this.notify(new Event(this, "announcement", { text: `I had to pay ${amount} to everyone! Only got ${this.model.balance} left to spend.` }))
    }

    payAnotherPlayer(other, amount) {
        if ( !other ) {
            throw new Error("other player is null!")
        }
        if ( amount == 0 ) {
            return;
        }
        if ( amount < 0 ) {
            throw new Error("amount should be a positive value")
        }
        this.withdraw(amount)
        other.addIncome(amount)
        this.notify(new Event(this, "announcement", { text: `I had to pay ${amount} to ${other.model.token.name}! Only got ${this.model.balance} left to spend.` }))
    }

    performDoNothingThisGo() {
        this.availableMoves = new ActionCollection(this.model.isHuman)
        if (this.isOnDouble) {
            this.availableMoves.add("R", "Roll dice", new Commands.Roll(this))
        }
    }

    // TODO think about if we can extract this logic from player and move it perhaps into a Dice result.
    performRollOfDiceAction() {
        this.availableMoves.remove("R") 
        const rolled = this.dice.rollDice()
        this.lastThrow = rolled
        this.notify(new Event(this, "announcement", { text:`Player rolled a [${rolled.values.join(',')}] for a total of ${rolled.sum}`}))
        this.move(rolled.sum)
        const isDouble = rolled.values[0] == rolled.values[1]
        if (isDouble) {
            this.doubleCounter++;
        }
        if (this.doubleCounter > 2) {
            this.gotoJail()
            this.isOnDouble = false
            return
        }
        if (isDouble && this.doubleCounter < 3) {
            this.notify(new Event(this, "announcement", { text: `${this.model.token.name} rolled a double` }))
            this.availableMoves.add("R", "Roll dice", new Commands.Roll(this))
            this.isOnDouble = true
        } else {
            this.doubleCounter = 0
            this.isOnDouble = false
        }
    }

    performBuyProperty() {
        this.availableMoves.remove("B")
        const square = this.board.getSquareAtIndex(this.model.location)
        this.notify(new Event(this, "purchase", { text: `${this.model.token.name} attempts to buy the property`, player: this, square: square }))
    }

    performSellProperty() {
        this.availableMoves.remove("S")
        if ( this.model.properties.length == 0 ) {
            this.notify(new Event(this, "announcement", { text: "No properties are owned yet!" }))
        } else {
            const propertyList = this.model.properties.map((property, index) => {
                return { key: (index+1).toString(), text: property.name, 
                    command: new Commands.SelectPropertyToSell(this),
                    data: { property: property }
                }
            })
            this.availableMoves.addAll(propertyList)
            this.notify(new Event(this, "announcement", { text: "Select a property to sell" }))
        }
    }

    performSaleOfProperty(data) {
        this.availableMoves.removeListIndices()
        this.notify(new Event(this, "sale", { text: `${this.model.token.name} attempts to sell the property`, square: data.property }))        
    }

    performListProperties() {
        // TODO list by color group
        if ( this.model.properties.length == 0 ) {
            this.notify(new Event(this, "announcement", { text: "No properties are owned yet!" }))
        } else {
            const propertyList = this.model.properties.map((property) => {
                return property.name
            }).join("\n")
            this.notify(new Event(this, "announcement", { text: propertyList }))
        }
    }

    performBuyHouse() {
        // TODO only list those that we have a full colorgroup for
        if ( this.model.properties.length == 0 ) {
            this.notify(new Event(this, "announcement", { text: "No properties are owned yet!" }))
        } else {
            let index = 0
            const propertyList = this.model.properties.map((property) => {
                if ( "getHousePurchasePrice" in property) {
                    index++
                    return { key: (index+1).toString(), text: property.name, 
                        command: new Commands.SelectPropertyToBuyHouseFor(this),
                        data: { property: property }
                    }
                }
            })
            this.availableMoves.addAll(propertyList)
            this.notify(new Event(this, "announcement", { text: "Select a property to buy a house for" }))
        }
    }

    performBuyHouseForProperty(data) {
        this.availableMoves.removeListIndices()
        this.notify(new Event(this, "buyHouse", { text: `${this.model.token.name} attempts to buy a house for property '${data.property.name}'`, square: data.property }))        
    }

    performBuyHotel() {
        // TODO only list those that we have a full colorgroup for
        if ( this.model.properties.length == 0 ) {
            this.notify(new Event(this, "announcement", { text: "No properties are owned yet!" }))
        } else {
            let index = 0
            const propertyList = this.model.properties.map((property) => {
                if ( "getHotelPurchasePrice" in property) {
                    index++
                    return { key: (index+1).toString(), text: property.name, 
                        command: new Commands.SelectPropertyToBuyHotelFor(this),
                        data: { property: property }
                    }
                }
            })
            this.availableMoves.addAll(propertyList)
            this.notify(new Event(this, "announcement", { text: "Select a property to buy a hotel for" }))
        }
    }

    performBuyHotelForProperty(data) {
        this.availableMoves.removeListIndices()
        this.notify(new Event(this, "buyHotel", { text: `${this.model.token.name} attempts to buy a hotel for property '${data.property.name}'`, square: data.property }))        
    }

    addChance(card) {
        this.notify(new Event(this, "announcement", { text: `Player picked up Chance card: ${card.text}` }))
        if (typeof (card.usage) == "function") {
            if (!card.usage(this)) {
                this.model.chanceCards.push(card)
            }
        } else if (card.usage == "immediate") {
            card.action(this)
        }
    }

    addCommunityChest(card) {
        this.notify(new Event(this, "announcement", { text: `Player picked up Community Chest card: ${card.text}` }))
        if (typeof (card.usage) == "function") {
            if (!card.usage(this)) {
                this.model.communityChest.push(card)
            }
        } else if (card.usage == "immediate") {
            card.action(this)
        }
    }


    /**
     * Forward all player events on to listeners
     * @param {Event} event 
     */
    onAny(event) {
        this.notify(event)
    }
}

module.exports = {
    PlayerController: PlayerController
}