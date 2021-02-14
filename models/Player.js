// Player uses inheritance to separate out Human and Bot.  Common functionality is
// in the top level class.  We call a top level class that has useful functionality an ABSTRACT CLASS.

const ActionCollection = require("./ActionCollection")
const Object = require("./Object")
const Commands = require("./Commands")
const Event = require("./Event")

const LOCATION_JAIL = 20

class Player extends Object.Object
{
  constructor(index, token, balance, squareCount, game) 
  {
    super()
    this.squareCount = squareCount
    this.index = index  // index will start at 1
    this.balance = balance
    this.properties = []
    this.token = token
    this.location = 0
    this.inJail = false
    this.chanceCards = []
    this.communityChest = []
    this.doubleCounter = 0
    this.isHuman = true
    this.game = game
    this.availableMoves = null
    this.isOnDouble = false
  }

  addChance(card) {
    this.notify(new Event.Event(this, "announcement", { text: `Player picked up Chance card: ${card.text}`}))
    if ( typeof(card.usage) == "function" ) {
      if ( !card.action(this) ) {
        this.chanceCards.push(card)
      }
    } else if ( card.usage == "immediate") {
      card.action(this)
    }
  }

  addCommunityChest(card) {
    this.communityChest.push(card)
  }

  addIncome(amount) {
    this.balance += amount
  }

  tax(amount) {
    if ( this.balance < amount ) {
      this.notify(new Event.Event(this, "bankrupt"))
    }
    this.balance -= amount
    this.notify(new Event.Event(this, "announcement", {text: `I had to pay ${amount} in tax! Only got ${this.balance} left to spend.`}))
  }

  isInJail() {
    // TODO isInJail
    return false;
  }

  gotoJail() {
    this.inJail = true
    // TODO Fix this as we can test the square itself to know if its the jail one.
    this.location = LOCATION_JAIL
    this.notify(new Event.Event(this, "announcement", {text: `The ${this.token.name} has gone to jail!`}))
  }

  move(diceRoll) 
  {
    const oldLocation = this.location
    this.location = (this.location + diceRoll.sum - 1) % this.squareCount
    if ( oldLocation > this.location ) {
      this.notify(new Event.Event(this, "passGo", {text: "Player passed Go!", data: this}))
    }
    const square = this.game.squares[this.location]
    this.notify(new Event.Event(this, "announcement", {text: `Player landed on ${square.name}!`}))
    square.visit(this)
  }

  moveTo(squareName)
  {
    const index = this.game.indexOf(squareName)
    this.location = index
    const square = this.game.squares[this.location]
    this.notify(new Event.Event(this, "announcement", {text: `Player landed on ${square.name}!`}))
    square.visit(this)
  }

  hasCard(name) 
  {
    for(let card of this.communityChest) {
      if ( card.name == name ) return true
    }
    return false
  }

  performDoNothingThisGo() {
    console.log("pass")
    this.availableMoves = new ActionCollection.ActionCollection(this)
    if ( this.isOnDouble ) {
      this.availableMoves.add("R", "Roll dice", new Commands.Roll(this))
    }
  }

  performRollOfDiceAction() {
    const rolled = this.game.rollDice()
    console.log(`Player rolled a [${rolled.values.join(',')}] for a total of ${rolled.sum}`)
    this.move(rolled)
    const isDouble = rolled.values[0] == rolled.values[1]
    if (isDouble) {
      this.doubleCounter++;
    }
    if (this.doubleCounter > 2) {
      this.gotoJail()
    }
    if ( isDouble && this.doubleCounter < 3 ) {
      this.notify(new Event.Event(this, "announcement", {text: `${this.token.name} rolled a double` }))
      this.availableMoves = this.generateMoves()
      this.availableMoves.add("R", "Roll dice", new Commands.Roll(this))
      this.isOnDouble = true
    } else {
      this.doubleCounter = 0
      this.availableMoves = this.generateMoves()
      this.isOnDouble = false
    }
  }

  performBuyProperty()
  {
    console.log("buy")
    const square = this.game.squares[this.location]
    this.notify(new Event.Event(this, "purchase", {text: `${this.token.name} attempts to buy the property`, player: this, square: square }))
    this.availableMoves = new ActionCollection.ActionCollection(this)
    if ( this.isOnDouble ) {
      this.availableMoves.add("R", "Roll dice", new Commands.Roll(this))
    }
  }

  performSellProperty()
  {
    console.log("sell")
    const square = this.game.squares[this.location]
    this.notify(new Event.Event(this, "sale", {text: `${this.token.name} attempts to sell the property`, player: this, square: square }))
    this.availableMoves = new ActionCollection.ActionCollection(this)
    if ( this.isOnDouble ) {
      this.availableMoves.add("R", "Roll dice", new Commands.Roll(this))
    }
  }

  generateMoves() 
  {
    const moves = new ActionCollection.ActionCollection(this)
    
    if ( this.inJail ) {
      // player gets to use a get out of jail free card
      if ( this.hasCard("GetOutOfJailFreeCard") ) {
        moves.add("J", "Use get out of jail free card")
      }
      // player gets to pay $50
      moves.add("P", "Pay $50 to leave jail")
      // player can roll and get a double
      moves.add("R", "Attempt to roll a double", new Commands.Roll(this))
      // if you do not throw a double after 3 turns you have to pay $50 to the banker
      // if using the get out of jail free card then they can have their go as usual
    } else {
      const square = this.game.squares[this.location]
      const options = square.getOptions(this)
      moves.addAll(options)
    }
    return moves
  }

  startTurn() 
  {
    this.notify(new Event.Event(this, "announcement", {text: `\n\n${this.token.name} (player ${this.index}) is now the current player` }))
    this.notify(new Event.Event(this, "announcement", {text: `Balance: ${this.balance}` }))
    this.notify(new Event.Event(this, "announcement", {text: `Properties: ${this.properties.map((x) => { return x.name; }).join(",")}` }))
    this.availableMoves = new ActionCollection.ActionCollection(this)
    this.availableMoves.add("R", "Roll dice", new Commands.Roll(this))
  }

  getAvailableMoves() {
    return this.availableMoves;
  }
}



class Human extends Player
{
  constructor(...args) 
  {
    super(...args)
  }
}

class Bot extends Player
{
  constructor(...args) 
  {
    super(...args)
    this.isHuman = false
  }
}

module.exports = {
  Human: Human,
  Bot: Bot
}