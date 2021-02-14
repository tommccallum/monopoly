class Command
{
    constructor(receiver) {
        this.receiver = receiver
    }
    execute() {
        throw new Error("execute called on interface")
    }
}

class Roll extends Command
{
    constructor(...args) {
        super(...args)
    }

    execute() {
        this.receiver.performRollOfDiceAction()
    }
}

class Buy extends Command
{
    constructor(...args) {
        super(...args)
    }

    execute() {
        this.receiver.performBuyProperty()
    }
}

class Sell extends Command
{
    constructor(...args) {
        super(...args)
    }

    execute() {
        this.receiver.performSellProperty()
    }
}

module.exports = {
    Roll: Roll,
    Buy: Buy,
    Sell: Sell
}