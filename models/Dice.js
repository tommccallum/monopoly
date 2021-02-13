const random = require("random")

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
class SingleValueDice 
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