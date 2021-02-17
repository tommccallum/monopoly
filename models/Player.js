// Player uses inheritance to separate out Human and Bot.  Common functionality is
// in the top level class.  We call a top level class that has useful functionality an ABSTRACT CLASS.

const { Object } = require("./Object")
const { Event } = require("./Event")

class Player extends Object {
  constructor(index, token, balance) {
    super()
    this.index = index  // index will start at 1
    this.balance = balance
    this.properties = []
    this.token = token
    this.location = -1 // we start off the board
    this.inJail = false
    this.chanceCards = []
    this.communityChestCards = []
    this.doubleCounter = 0
    this.isHuman = true
    this.isOnDouble = false
  }

  hasCompleteUnmortgagedColorGroup() {
    const sorted = this.sortPropertiesByColorGroup()
    for( let s of sorted ) {
      if ( s.length > 0 ) {
        const expectedSize = s[0].colorGroupSize
        if ( s.length == expectedSize ) {
          mortgaged = false
          for( let p of s ) {
            if ( p.isMortgaged ) {
              mortgaged = true
            }
          }
          if (!mortgaged) {
            return true
          }
        }
      }
    }
    return false
  }

  hasCompleteColorGroupIgnoreMortgageStatus() {
    const sorted = this.sortPropertiesByColorGroup()
    for( let s of sorted ) {
      if ( s.length > 0 ) {
        const expectedSize = s[0].colorGroupSize
        if ( s.length == expectedSize ) {
          return true
        }
      }
    }
    return false
  }

  sortPropertiesByColorGroup() {
    const sorted = {}
    for( let p of this.properties) {
        if ( "colorGroup" in p ) {
            if ( p.colorGroup in sorted ) {
                sorted[p.colorGroup].push(p)
            } else {
                sorted[p.colorGroup] = [p]
            }
        }
    }
    return sorted
  }

  /**
   * This is called by PlayerController when we need to unmortgage a property
   * @param {Property} property 
   */
  unmortgageProperty(property) {
    const index = this.properties.indexOf(property)
    if ( index < 0 ) {
      throw new Error("property not found")
    }
    if ( !property.isMortgaged ) {
      throw new Error("property is not mortgaged")
    }
    // TODO move this 10% above mortgage value to gamedata
    const mortgageRate = 0.1
    this.withdraw(property.getMortgageValue() * ( 1 + mortgageRate ))
  }

  addIncome(amount) {
    if (amount < 0) {
      throw new Error("amount must be greater than or equal to zero")
    }
    this.balance += amount
    this.notify(new Event(this, "announcement", { text: `Hooray! ${this.token.name} received ${amount}! I now have ${this.balance} to spend.` }))
  }

  withdraw(amount) {
    if (amount < 0) {
      throw new Error("amount must be greater than or equal to zero")
    }
    if (this.balance < amount) {
      // can we sell any houses or hotels to the bank?
      // if we have property, then can can sell it to the bank for cash?
      // if we have mortgaged property, then we can give that to the other player?
      // fire false back meaning that we are bankrupt and need to sell assets
      return false 
    }
    this.balance -= amount
    this.notify(new Event(this, "announcement", { text: `${this.token.name} has current balance of ${this.balance}.`}))
    return true
  }

  isInJail() {
    // NOTE cannot just test location as you can be on the jail location without being in jail.
    return this.inJail;
  }

  freeFromJail() {
    this.inJail = false
    this.notify(new Event(this, "freeFromJail"))
  }

  useFreeFromJailCard() {
    if (this.isInJail()) {
      for (let index = 0; index < this.chanceCards.length; index++) {
        if ("isFreeFromJailCard" in this.chanceCards[index]) {
          if (this.chanceCards[index].isFreeFromJailCard) {
            this.chanceCards.splice(index, 1)
            this.freeFromJail()
            return true
          }
        }
      }

      for (let index = 0; index < this.communityChestCards.length; index++) {
        if ("isFreeFromJailCard" in this.communityChestCards[index]) {
          if (this.communityChestCards[index].isFreeFromJailCard) {
            this.communityChestCards.splice(index, 1)
            this.freeFromJail()
            return true
          }
        }
      }
    }
    return false
  }

  getHouseCount() {
    let total = 0
    for (let p of this.properties) {
      total += p.houseCount
    }
    return total
  }

  getHotelCount() {
    let total = 0
    for (let p of this.properties) {
      total += p.hotelCount
    }
    return total
  }

  hasCard(name) {
    for (let card of this.communityChestCards) {
      if (card.name == name) {
        return true
      }
    }
    for (let card of this.chanceCards) {
      if (card.name == name) {
        return true
      }
    }
    return false
  }

  sendStatus() 
  {
    this.notify(new Event(this, "announcement", {
      text: `Balance: ${this.balance}\nProperties: ${this.properties.map((x) => { return x.name; }).join(",")}` 
    }))
  }
  
}



class Human extends Player {
  constructor(...args) {
    super(...args)
  }
}

class Bot extends Player {
  constructor(...args) {
    super(...args)
    this.isHuman = false
  }
}

module.exports = {
  Human: Human,
  Bot: Bot
}