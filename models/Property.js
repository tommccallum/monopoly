// OOP technique used in Single Inheritance
// Visitor pattern used where the player visits the location to have something done to it.
// We override the functions in the Square interface.
// An interface is EITHER a defined item in the language, 
//                 OR its a class with maybe data members and empty/error throwing methods.
// When you inherit in some languages you should try and keep all the methods in all the parents and children so
// that an item of the top level type is no different, in the set of methods, than the children.
// In some languages you can bend this requirement.

const Commands = require("./Commands")
const random = require("random")
const data = require("../config/GameData")

class Square {
    constructor(propertyData) {
        this.group = propertyData.group
        this.name = propertyData.name
        this.banker = null
    }

    
    setBanker(banker) {
        this.banker = banker
    }

    getRentAmount() {
        throw new Error("Unsupported method")
    }

    getPurchasePrice() {
        throw new Error("Unsupported method")
    }

    getText() {
        throw new Error("Unsupported method")
    }

    getValue() {
        throw new Error("Unsupported method")
    }

    visit(player) {
        throw new Error("Unsupported method")
    }

    isSellable() {
        return false
    }

    getOptions(player) {
        return []
    }

}

class Mortgage extends Square {
    constructor(propertyData) {
        super(propertyData)
        this.owner = null
        this.isMortgaged = false
        this.purchasePrice = propertyData.purchase_value
    }

    getPurchasePrice() {
        return this.purchasePrice
    }

    isSellable() {
        return true
    }

    calculateRent(diceValue) {
        return 0
    }

    visit(player) {
        if (this.isMortgaged) return
        if (this.owner == player) return;
        if (!this.owner) {
            return;
        }
        const diceValue = player.getLastThrow()
        player.payAnotherPlayer(this.owner, this.calculateRent(diceValue.sum))
    }


    getOptions(player) {
        let choices = []
        if (this.owner == null && player.getBalance() >= this.purchasePrice) {
            choices.push({ key: "B", text: "Buy property", command: new Commands.Buy(player) })
        }
        if (this.owner == player) {
            choices.push({ key: "M", text: "Mortgage property", command: new Commands.Mortgage(player) })
            choices.push({ key: "S", text: "Sell property", command: new Commands.Sell(player) })
        }
        return choices
    }
}

class Property extends Mortgage {
    constructor(propertyData) {
        super(propertyData)
        this.houseCount = 0
        this.hotelCount = 0
        this.housePurchasePrice = propertyData.house_purchase_price
        this.hotelPurchasePrice = propertyData.hotel_purchase_price
        this.rent = propertyData.rent
        this.rentPerHotel = propertyData.rent[propertyData.rent.length - 1]
        this.rentEmpty = propertyData.rent[0]
        this.owner = null
        this.isMortgaged = false
        this.colorGroup = propertyData.colorgroup
        this.colorGroupSize = propertyData.colorgroup_size
    }

    getHousePurchasePrice() {
        return this.housePurchasePrice
    }

    getHotelPurchasePrice() {
        return this.hotelPurchasePrice
    }

    isSellable() {
        return true
    }

    getMortgageValue() {
        return this.purchasePrice / 2
    }

    calculateRent(diceValue) {
        if (this.houses == 0 && this.hotels == 0) {
            return this.rentEmpty
        }
        return this.houseCount * this.rent[this.houseCount] + this.hotelCount * this.rentPerHotel
    }
}

class FourGroup extends Mortgage {
    constructor(propertyData) {
        super(propertyData)
    }

    getCount(player) { 
        return 0 
    }

    
}

class Station extends FourGroup {
    constructor(propertyData) {
        super(propertyData)
        this.rent = propertyData.rent
        this.colorGroup = propertyData.colorgroup
        this.colorGroupSize = propertyData.colorgroup_size
    }

    getCount(player) {
        let count = 0
        for (let p of player.model.properties) {
            if (p.group == "station") {
                count++;
            }
        }
        return count
    }

    calculateRent(diceValue) {
        if ( this.owner == null ) {
            return 0
        }
        const count = this.getCount(this.owner)
        return this.rent[count-1]
    }
}

class Utility extends FourGroup {
    constructor(propertyData) {
        super(propertyData)
        this.rent_multiplier = propertyData.rent_multiplier
        this.colorGroup = propertyData.colorgroup
        this.colorGroupSize = propertyData.colorgroup_size
    }

    getCount(player) {
        let count = 0
        for (let p of player.model.properties) {
            if (p.group == "utility") {
                count++;
            }
        }
        return count
    }

    calculateRent(diceValue) {
        if ( this.owner == null ) {
            return 0
        }
        const count = this.getCount(this.owner)
        return this.rent_multiplier[count-1] * diceValue
    }
}


class Card extends Square {
    constructor(propertyData) {
        super(propertyData)

        this.text = null
        this.usage = null
        this.canBeSold = false
        this.action = null
        this.isFreeFromJailCard= false
    }

    fillCard(card, data) {
        card.text = data.text
        card.value = data.value
        card.action = data.action
        card.usage = data.usage
        card.canBeSold = data.canBeSold
        card.isFreeFromJailCard = data.isFreeFromJailCard
    }

    getData() { throw new Error("this function should not be called")  }
    addCardToPlayer() { throw new Error("this function should not be called") }

    visit(player) {
        const data = this.getData()
        const card = this.createNewCard(data)
        this.addCardToPlayer(player, card)
    }
}

class Chance extends Card {
    constructor(propertyData) {
        super(propertyData)
    }

    createNewCard(data) {
        const card = new Chance(data)
        this.fillCard(card, data)
        return card
    }

    getData() {
        return data.chance[random.int(0, data.chance.length)]
    }

    addCardToPlayer(player, card) {
        player.addChance(card)
    }
}

class CommunityChest extends Card {
    constructor(propertyData) {
        super(propertyData)
    }

    createNewCard(data) {
        const card = new CommunityChest(data)
        this.fillCard(card, data)
        return card
    }

    getData() {
        return data.communityChest[random.int(0, data.communityChest.length)]
    }

    addCardToPlayer(player, card) {
        player.addCommunityChest(card)
    }
}

class Go extends Square {
    constructor(propertyData) {
        super(propertyData)
        this.purchasePrice = propertyData.purchase_value
    }

    getPurchasePrice() {
        return this.purchasePrice
    }

    visit(player) {
        this.banker.payOut(player, this.purchasePrice)
    }

    onPassGo(event) {
        const player = event.source
        this.visit(player)
    }
}

class Jail extends Square {
    constructor(propertyData) {
        super(propertyData)
    }

    visit(player) {
        // nothing happens here I don't think
    }
}

class GotoJail extends Square {
    constructor(propertyData) {
        super(propertyData)
    }

    visit(player) {
        player.gotoJailWithoutPassingGo()
    }
}


class FreeParking extends Square {
    constructor(propertyData) {
        super(propertyData)
    }

    visit(player) {
        // nothing happens here according to the rules
        // but some people play that any money from tax
        // can go in here and if you land on it then
        // you get all that lovely money...
    }
}

class Tax extends Square {
    constructor(propertyData) {
        super(propertyData)
        this.purchasePrice = propertyData.purchase_value
    }

    visit(player) {
        player.withdraw(this.purchasePrice)
        this.banker.payIn(this.purchasePrice)
    }
}

// Design Pattern: Factory Method
/**
 * Creates a property object.  Any property should be able to be used identically after
 * this function has been called.
 * @param {object} propertyData 
 */
function createProperty(propertyData) {
    let property = null
    const type = propertyData.group.toLowerCase()
    if (type == "chance") {
        property = new Chance(propertyData)
    } else if (type == "go") {
        property = new Go(propertyData)
    } else if (type == "communitychest") {
        property = new CommunityChest(propertyData)
    } else if (type == "jail") {
        property = new Jail(propertyData)
    } else if (type == "gotojail") {
        property = new GotoJail(propertyData)
    } else if (type == "station") {
        property = new Station(propertyData)
    } else if (type == "utility") {
        property = new Utility(propertyData)
    } else if (type == "freeparking") {
        property = new FreeParking(propertyData)
    } else if (type == "tax") {
        property = new Tax(propertyData)
    } else if ( type == "property") {
        property = new Property(propertyData)
    } else {
        throw new Error(`invalid property data ${propertyData.group}`)
    }
    return property
}

module.exports = {
    create: createProperty,
    Chance: Chance,
    CommunityChest: CommunityChest
}