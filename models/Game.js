const Banker = require("./Banker")
const Move = require("./Move")
const Player = require("./Player")
const data = require("./data")
const Token = require("./Token")
const Dice = require("./Dice")

class Monopoly
{
  constructor(realPlayerCount) 
  {
    this.startingMoney = 1500 // as per the game but we could change this if we wanted
    this.playerCount = 4
    this.realPlayerCount = realPlayerCount
    this.players = []
    this.currentPlayer = 0
    this.availableProperties = []
    this.banker = new Banker.Banker()
    this.dice = [new Dice.SixSidedDice(), new Dice.SixSidedDice()]
    
    for(let ii=0; ii < this.playerCount; ii++ ) {
      if ( ii < this.realPlayerCount ) {
        this.players.push( new Player.Human(ii+1, new Token.Token(data.tokens[ii]), this.startingMoney))
      } else {
        this.players.push( new Player.Bot(ii+1, new Token.Token(data.tokens[ii]), this.startingMoney))
      }
    }
  }

  rollDice() 
  {
    let total = {
      sum: 0,
      values: []
    }
    for( let die of this.dice ) {
      const val = die.roll()
      total.values.push(val)
      total.sum += val
    }
    return total
  }

  takeTurn()
  {
    const player = this.players[this.currentPlayer]

    if ( player.isInJail() ) {
      
    }

    let consecutiveDoubles = 0
    let isDouble = false
    do {
      const rolled = this.rollDice()
      console.log("Player rolled "+rolled.sum)
      console.log(rolled.values)
      player.move(rolled)
      isDouble = rolled.values[0] == rolled.values[1]
      if ( isDouble ) {
        consecutiveDoubles++ 
      }
    } while ( consecutiveDoubles < 3 && isDouble )

    if ( consecutiveDoubles > 2 ) {
      player.gotoJail()
    } else {
      // player.selectAction()
      // player.performAction()
    }
    this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
    console.log(this.currentPlayer)
    return this.players[this.currentPlayer].generateMoves()
  }
}

module.exports = {
  Monopoly: Monopoly
}