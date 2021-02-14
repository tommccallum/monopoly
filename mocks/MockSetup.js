const Monopoly = require('../models/Game.js')
const GameData = require("../config/GameData")
const Banker = require("../models/Banker")
const BankerController = require("../controllers/BankerController")
const Observer = require("./EventObserver")

/**
 * We are using this to mock up a given scenario.
 */
function MockSetup(bankerModel, numPlayers, gameData, observer) 
{
    if ( typeof(bankModel) == "undefined" || bankModel == null ) {
        bankerModel = new Banker.Model()
    }
    if ( !gameData) {
        gameData = GameData
    }
    if ( !numPlayers ) {
        numPlayers = 1
    }

    const banker = new BankerController.Controller(bankerModel)
    if ( observer ) {
        banker.addListener(logger)
    }
    
    const monopoly = new Monopoly.Monopoly(gameData, banker, numPlayers)
    if ( observer ) {
        monopoly.addListener(logger)
    }
    monopoly.setup()

    return monopoly
}

module.exports = {
    MockSetup: MockSetup
}