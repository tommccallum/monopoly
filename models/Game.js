const Banker = require("./Banker")
const Move = require("./Move")
const Player = require("./Player")
const data = require("./data")
const Token = require("./Token")

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
    this.dice = []
    
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
    let total = 0
    for( let dice in this.dice ) {
      total += dice.roll()
    }
    return total
  }

  takeTurn()
  {
    const player = this.players[this.currentPlayer]
    // player.selectAction()
    // player.performAction()
    this.currentPlayer++;
    return new Move.Move()
  }
}

module.exports = {
  Monopoly: Monopoly
}