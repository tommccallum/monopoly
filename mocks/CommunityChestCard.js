const data = require("../config/GameData");
const Property = require("../models/Property")

class MockCommunityChest extends Property.CommunityChest
{
    constructor(...args) {
        super(...args)
        this.cardIndex = 0
    }

    get() {
        return this.createNewCard(data.communityChest[this.cardIndex])
    }

    visit(player) {
        if ( data.communityChest.length == 0 ) {
            throw new Error("no community chest cards available")
        }
        if ( data.communityChest.length < this.cardIndex ) {
            throw new Error(`length of community chest cards < cardIndex ${this.cardIndex}`)
        }

        const data = data.communityChest[this.cardIndex]
        const card = this.createNewCard(data)
        player.addCommunityChest(card)
    }

}

module.exports = {
    MockCommunityChest: MockCommunityChest
}