class DiceCollection {
    constructor(arrayOfDice) {
        this.dice = arrayOfDice
    }

    rollDice() {
        let total = {
            sum: 0,
            values: []
        }
        for (let die of this.dice) {
            const val = die.roll()
            total.values.push(val)
            total.sum += val
        }
        return total
    }
}

module.exports = {
    DiceCollection: DiceCollection
}