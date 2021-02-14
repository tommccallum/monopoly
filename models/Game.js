const Player = require("./Player")
const Object = require("./Object")
const Token = require("./Token")
const Dice = require("./Dice")
const Property = require("./Property")
const Event = require("./Event")

class Monopoly extends Object.Object {
  constructor(gameData, banker, realPlayerCount) {
    super()
    this.playerCount = gameData.playerCount
    this.realPlayerCount = realPlayerCount
    this.players = []
    this.currentPlayer = 0
    this.squares = []
    this.banker = banker
    this.dice = [new Dice.Dice(), new Dice.Dice()]
    this.gameData = gameData
    this.doubleCounter = 0
    this.lastMovesGenerated = null
  }

  setup() {
    this.createBoardSquares()
    this.createPlayers()
    this.addPlayerListeners()
    this.whoStarts()
  }

  onAny(event) {
    this.notify(event)
  }

  addPlayerListeners() {
    // make the Go space a listener on all the players 
    // so we can detect when they have gone round the board
    for (let p of this.players) {
      p.addListener(this)
      p.addListener("passGo", this.squares[0])
      p.addListener("purchase", this.banker)
      p.addListener("sale", this.banker)
      p.addListener("bankrupt", this.banker)
    }
  }

  createPlayers() {
    for (let ii = 0; ii < this.playerCount; ii++) {
      if (ii < this.realPlayerCount) {
        this.players.push(new Player.Human(ii + 1, new Token.Token(this.gameData.tokens[ii]), this.gameData.startingMoneyAmount, this.squares.length, this ))
      } else {
        this.players.push(new Player.Bot(ii + 1, new Token.Token(this.gameData.tokens[ii]), this.gameData.startingMoneyAmount, this.squares.length, this))
      }
    }
  }

  createBoardSquares() {
    for (let squareData of this.gameData.squares) {
      const square = Property.create(squareData)
      square.setBanker(this.banker)
      this.squares.push(square)
      if (square.isSellable()) {
        this.banker.addTitleDeed(square)
      }
    }
  }

  rollDice() {
    let total = {
      sum: 0,
      values: []
    }
    for (let die of this.dice) {
      const val = die.roll()
      total.values.push(val)
      total.sum += val
    }
    return total
  }

  whoStarts() {
    let maxSoFar = 0
    let starter = 0
    for (let index in this.players) {
      const result = this.rollDice()
      this.notify(new Event.Event(this, "announcement", {text: `Player ${this.players[index].index} rolled a ${result.values[0]}` }))
      if (maxSoFar < result.values[0]) {
        maxSoFar = result.values[0]
        starter = index
      }
    }
    this.currentPlayer = starter
    const player = this.players[this.currentPlayer]
    this.notify(new Event.Event(this, "announcement", {text: `Player ${player.index} won the highest roll and will start` }))
  }

  _checkUserInput(userInput)
  {
    if ( !this.lastMovesGenerated.isEmpty() ) {
      if (userInput == null || userInput.trim().length == 0) {
        this.notify(new Event.Event(this, "announcement", {text: "Invalid action specified, please try again." }))
        return false
      }
    }
    return true
  }

  takeTurn(userInput) {
    if (this.lastMovesGenerated == null) {
      // this is the first time we have been called so we
      // load the first players options
      this.players[this.currentPlayer].startTurn()
      this.lastMovesGenerated = this.players[this.currentPlayer].getAvailableMoves()
      return this.lastMovesGenerated
    }

    if ( this._checkUserInput(userInput))
    {
      if ( !this.lastMovesGenerated.isEmpty() ) {
        try {
          this.lastMovesGenerated.findAndExecute(userInput)
        } catch( error ) {
          this.notify(new Event.Event(this, "announcement", { text:error.message}))
        }
      }
    } else {
      // we are here as the user just hit return
      this.next()
      return this.lastMovesGenerated
    }


    let player = this.players[this.currentPlayer]
    this.lastMovesGenerated = player.getAvailableMoves()
    if ( this.lastMovesGenerated.isEmpty() ) {
      this.next()
    }
    return this.lastMovesGenerated
  }

  next() {
    this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
    const nextPlayer = this.players[this.currentPlayer]
    nextPlayer.startTurn()
    this.lastMovesGenerated = nextPlayer.getAvailableMoves()
  }
}

module.exports = {
  Monopoly: Monopoly
}