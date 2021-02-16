const { Human, Bot } = require("./Player")
const { PlayerController } = require("../controllers/PlayerController")
const { Object } = require("./Object")
const { Token } = require("./Token")
const { Dice } = require("./Dice")
const { Event } = require("./Event")
const { Board } = require("./Board")
const { DiceCollection } = require("./DiceCollection")

class Monopoly extends Object {
  constructor(gameData, banker, realPlayerCount) {
    super()
    this.playerCount = gameData.playerCount
    this.realPlayerCount = realPlayerCount
    this.players = []
    this.currentPlayer = 0
    this.gameData = gameData
    this.doubleCounter = 0
    this.lastMovesGenerated = null

    this.banker = banker
    this.board = new Board(this.gameData, this.banker)
    this.diceCollection = new DiceCollection([new Dice(), new Dice()])
  }

  setup() {
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
      p.addListener("passGo", this.board.getSquareAtIndex(0))
      p.addListener(this.banker)
    }
  }

  createPlayers() {
    for (let ii = 0; ii < this.playerCount; ii++) {
      let player = null;
      if (ii < this.realPlayerCount) {
        player = new Human(ii + 1, new Token(this.gameData.tokens[ii]), this.gameData.startingMoneyAmount)
      } else {
        player = new Bot(ii + 1, new Token(this.gameData.tokens[ii]), this.gameData.startingMoneyAmount)
      }
      const playerController = new PlayerController(player, this.board, this.diceCollection)
      this.players.push(playerController)
      this.notify(new Event(this, "announcement", { text: `Creating human ${player.index} with token ${player.token.name} and balance ${player.balance}`}))
    }
  }

  whoStarts() {
    let maxSoFar = 0
    let starter = 0
    for (let index in this.players) {
      const result = this.diceCollection.rollDice()
      this.notify(new Event(this, "announcement", {text: `Player ${this.players[index].index} rolled a ${result.values[0]}` }))
      if (maxSoFar < result.values[0]) {
        maxSoFar = result.values[0]
        starter = index
      }
    }
    this.currentPlayer = starter
    const player = this.players[this.currentPlayer]
    this.notify(new Event(this, "announcement", {text: `Player ${player.index} won the highest roll and will start` }))
  }

  _checkUserInput(userInput)
  {
    if ( !this.lastMovesGenerated.isEmpty() ) {
      if (userInput == null || userInput.trim().length == 0) {
        this.notify(new Event(this, "announcement", {text: "Invalid action specified, please try again." }))
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
          this.notify(new Event(this, "announcement", { text:error.message}))
        }
      }
    } else {
      // we are here as the user just hit return
      this.nextPlayersTurn()
      return this.lastMovesGenerated
    }


    let player = this.players[this.currentPlayer]
    this.lastMovesGenerated = player.getAvailableMoves()
    if ( this.lastMovesGenerated.isEmpty() ) {
      this.nextPlayersTurn()
    }
    return this.lastMovesGenerated
  }

  nextPlayersTurn() {
    this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
    const nextPlayer = this.players[this.currentPlayer]
    nextPlayer.startTurn()
    this.lastMovesGenerated = nextPlayer.getAvailableMoves()
  }

  onPayAllPlayers(event) {
    for( let p of this.players ) {
      if ( event.source != p ) {
        p.addIncome(event.data.amount)
        event.source.withdraw(event.data.amount)
      }
    }
  }

  onPayMe(event) {
    for( let p of this.players ) {
      if ( event.source != p ) {
        p.withdraw(event.data.amount)
        event.source.addIncome(event.data.amount)
      }
    }
  }
}

module.exports = {
  Monopoly: Monopoly
}