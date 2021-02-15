const { Object } = require("../models/Object")
const { Event } = require("../models/Event")

class PlayerController extends Object {
    constructor(playerModel, board, dice) {
        super()
        this.model = playerModel
        this.board = board
        this.dice = dice
        this.availableMoves = null
    }

    startTurn() {
        this.notify(new Event(this, "announcement", { text: `\n\n${this.model.token.name} (player ${this.model.index}) is now the current player` }))
        this.model.sendStatus()
        this.availableMoves = new ActionCollection.ActionCollection(this)
        this.availableMoves.add("R", "Roll dice", new Commands.Roll(this))
    }

    generateMoves() {
        const moves = new ActionCollection.ActionCollection(this)

        if (this.model.isInJail()) {
            // player gets to use a get out of jail free card
            if (this.model.hasCard("GetOutOfJailFreeCard")) {
                moves.add("J", "Use get out of jail free card")
            }
            // player gets to pay $50
            moves.add("P", "Pay $50 to leave jail")
            // player can roll and get a double
            moves.add("R", "Attempt to roll a double", new Commands.Roll(this))
            // if you do not throw a double after 3 turns you have to pay $50 to the banker
            // if using the get out of jail free card then they can have their go as usual
        } else {
            const square = this.board.getSquareAtIndex(this.model.location)
            const options = square.getOptions(this)
            moves.addAll(options)
            if (this.model.properties.length > 0) {
                // we have the option to sell or mortgage any property
                moves.add("M", "Mortgage property", new Commands.Mortgage(this))
                moves.add("S", "Sell property", new Commands.Sell(this))
            }
        }
        return moves
    }

    getAvailableMoves() {
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
        }
        this.model.location = index
        this.visitSquare()
    }

    moveToNearest(squareGroup) {
        const index = this.board.findNearest(squareGroup, this.model.location + 1)
        if (this.model.location > index) {
            // pass go
            this.notify(new Event(this, "passGo", { text: "Player passed Go!" }))
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
    }

    gotoJailWithoutPassingGo() {
        const jailIndex = this.board.findNearest("jail", this.model.location)
        this.model.location = jailIndex
        this.inJail = true
        this.notify(new Event(this, "announcement", { text: `The ${this.model.token.name} has gone to jail!` }))

        this.visitSquare()
    }

    // TODO merge tax and withdraw functions into single function
    payTax(amount) {
        this.model.withdraw(amount)
        this.notify(new Event(this, "payBank", { amount: amount }))
        this.notify(new Event(this, "announcement", { text: `I had to pay ${amount} in tax! Only got ${this.model.balance} left to spend.` }))
    }

    payEveryone(amount) {
        this.notify(new Event(this, "payAllPlayers", { amount: amount }))
        this.notify(new Event(this, "announcement", { text: `I had to pay ${amount} to everyone! Only got ${this.model.balance} left to spend.` }))
    }

    performDoNothingThisGo() {
        console.log("pass")
        this.availableMoves = new ActionCollection.ActionCollection(this)
        if (this.isOnDouble) {
            this.availableMoves.add("R", "Roll dice", new Commands.Roll(this))
        }
    }

    performRollOfDiceAction() {
        const rolled = this.dice.rollDice()
        console.log(`Player rolled a [${rolled.values.join(',')}] for a total of ${rolled.sum}`)
        this.move(rolled.sum)
        const isDouble = rolled.values[0] == rolled.values[1]
        if (isDouble) {
            this.doubleCounter++;
        }
        if (this.doubleCounter > 2) {
            this.gotoJail()
        }
        if (isDouble && this.doubleCounter < 3) {
            this.notify(new Event(this, "announcement", { text: `${this.model.token.name} rolled a double` }))
            this.availableMoves = this.generateMoves()
            this.availableMoves.add("R", "Roll dice", new Commands.Roll(this))
            this.isOnDouble = true
        } else {
            this.doubleCounter = 0
            this.availableMoves = this.generateMoves()
            this.isOnDouble = false
        }
    }

    performBuyProperty() {
        console.log("buy")
        const square = this.board.getSquareAtIndex(this.model.location)
        this.notify(new Event(this, "purchase", { text: `${this.model.token.name} attempts to buy the property`, player: this, square: square }))
        this.availableMoves = new ActionCollection.ActionCollection(this)
        if (this.isOnDouble) {
            this.availableMoves.add("R", "Roll dice", new Commands.Roll(this))
        }
    }

    performSellProperty() {
        console.log("sell")
        const square = this.board.getSquareAtIndex(this.model.location)
        this.notify(new Event(this, "sale", { text: `${this.model.token.name} attempts to sell the property`, player: this, square: square }))
        this.availableMoves = new ActionCollection.ActionCollection(this)
        if (this.isOnDouble) {
            this.availableMoves.add("R", "Roll dice", new Commands.Roll(this))
        }
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

    // forwarded functions to model

    isInJail() {
        return this.model.isInJail()
    }

    addIncome(amount) {
        this.model.addIncome(amount)
    }

    withdraw(amount) {
        this.model.withdraw(amount)
    }
}

module.exports = {
    PlayerController: PlayerController
}