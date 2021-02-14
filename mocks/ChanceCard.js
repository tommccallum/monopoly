const data = require("../config/GameData");
const Property = require("../models/Property")

class MockChance extends Property.Chance
{
    constructor(...args) {
        super(...args)
        this.cardIndex = 0
    }

    visit(player) {
        if ( data.chance.length == 0 ) {
            throw new Error("no chance cards available")
        }
        if ( data.chance.length < this.cardIndex ) {
            throw new Error(`length of chance cards < cardIndex ${this.cardIndex}`)
        }

        const chanceData = data.chance[this.cardIndex]
        const card = this.createNewCard(chanceData)
        player.addChance(card)
    }

}

module.exports = {
    MockChance: MockChance
}