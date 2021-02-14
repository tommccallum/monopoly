const Dice = require("../models/Dice")

// We always return the same value so that we can test 
// 3 consecutive doubles
class SingleValueDice extends Dice.SixSidedDice
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
    Dice: SingleValueDice
}
