const Object = require("./Object")
const GameData = require("../config/GameData")
const Property = require("./Property")

/**
 * The banker listens to all the players and carries out purchases and mortgages etc.
 * We implement the relationship between player and banker through the Observer pattern
 * so that they are less dependent on each other.
 * 
 * The model should be a simple data structure in essence changed only by the controller.
 */

class BankerModel {
    constructor() {
        this.balance = 1000000
        this.titleDeeds = []
        this.houseCount = 32
        this.hotelCount = 12
    }

    addTitleDeed(property)
    {
        this.titleDeeds.push(property)
    }
}

module.exports = {
    Model: BankerModel
}