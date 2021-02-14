const random = require("random")

/**
 * We have implemented a dice class so you could add more than 2 dice or just 1 dice.
 * You can also change the expectation of each value on the dice if you wanted.
 */

class Dice
{
    constructor(sides)
    {
        
        if ( typeof(sides) == "undefined" ) {
            sides = 6
        }
        if ( typeof(sides) != "number" ) {
            throw new Error("number of sides must be an integer")
        }
        if ( Math.floor(sides) != sides ) {
            throw new Error("number of sides must be an integer, not a floating point")
        }
        this.sides = sides
    }

    roll()
    {
        return random.int(1, this.sides)
    }
}


module.exports = {
    Dice: Dice,
}