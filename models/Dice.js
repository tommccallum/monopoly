const random = require("random")

/**
 * We have implemented a dice class so you could add more than 2 dice or just 1 dice.
 * You can also change the expectation of each value on the dice if you wanted.
 */

class Dice
{
    constructor()
    {
        this.sides = 6
    }

    roll()
    {
        return random.int(1, this.sides)
    }
}

// We always return the same value so that we can test 
// 3 consecutive doubles
class SingleValueDice extends Dice
{
    constructor(...args) {
        super(...args)
        this.value = 3
    }

    roll() 
    {
        return this.value
    }
}

module.exports = {
    SixSidedDice: Dice,
    SingleValueDice: SingleValueDice
}