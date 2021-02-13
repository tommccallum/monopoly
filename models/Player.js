const data = require("./data")
const Move = require("./Move")

const LOCATION_JAIL = 20

class Player
{
  constructor(index, token, balance) 
  {
    this.index = index  // index will start at 1
    this.balance = balance
    this.properties = []
    this.token = token
    this.location = 0
    this.inJail = false
    this.cards = []
  }

  gotoJail() {
    this.inJail = true
    this.location = LOCATION_JAIL
  }

  move(diceRoll) 
  {
    this.location = (this.location + diceRoll.sum) % data.properties.length
  }

  hasCard(name) 
  {
    for(let card of this.cards) {
      if ( card.name == name ) return true
    }
    return false
  }

  generateMoves() 
  {
    const moves = new Move.Move()
    
    if ( this.inJail ) {
      // player gets to use a get out of jail free card
      if ( this.hasCard("GetOutOfJailFreeCard") ) {
        moves.add("J", "Use get out of jail free card")
      }
      // player gets to pay $50
      moves.add("P", "Pay $50 to leave jail")
      // player can roll and get a double
      moves.add("R", "Attempt to roll a double")
      // if you do not throw a double after 3 turns you have to pay $50 to the banker
      // if using the get out of jail free card then they can have their go as usual
    } else {
      moves.add("R", "Roll dice")
      // buy property
      // TODO check we can afford the location we are currently on
      // and if its one of our properties
      moves.add("B", "Buy property")
      moves.add("S", "Sell property")
    }
  }
}

class Human extends Player
{
  constructor(...args) 
  {
    super(...args)
    this._isHuman = true
    console.log(`Creating human ${this.index} with token ${this.token.name} and balance ${this.balance}`)
  }
}

class Bot extends Player
{
  constructor(...args) 
  {
    super(...args)
    this._isHuman = false
    console.log(`Creating bot ${this.index} with token ${this.token.name} and balance ${this.balance}`)
  }
}

module.exports = {
  Human: Human,
  Bot: Bot
}