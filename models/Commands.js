// Design Pattern used is Command.
// This is used so to separate out the command from the object that fires it.
// You give any dependent state in the constructor and then
// hand control to that when it "fires".  This way in a GUI for instance
// you can have a menu or a popup or a shortcut all carry out the same command.
class Command
{
    constructor(receiver) {
        this.receiver = receiver
        this.permanent = false
    }
    execute() {
        throw new Error("execute called on interface")
    }
}

class Pass extends Command
{
    constructor(...args) {
        super(...args)
    }

    execute(data) {
        this.receiver.performDoNothingThisGo(data)
    }
}

class Roll extends Command
{
    constructor(...args) {
        super(...args)
    }

    execute(data) {
        this.receiver.performRollOfDiceAction(data)
    }
}

class Buy extends Command
{
    constructor(...args) {
        super(...args)
    }

    execute(data) {
        this.receiver.performBuyProperty(data)
    }
}



class Sell extends Command
{
    constructor(...args) {
        super(...args)
    }

    execute(data) {
        this.receiver.performSellProperty(data)
    }
}

class SelectPropertyToSell extends Command
{
    constructor(...args) {
        super(...args)
    }

    execute(data) {
        this.receiver.performSaleOfProperty(data)
    }
}

class Mortgage extends Command
{
    constructor(...args) {
        super(...args)
    }

    execute(data) {
        this.receiver.performMortgage(data)
    }
}

class PropertyList extends Command
{
    constructor(...args) {
        super(...args)
        this.permanent = true
    }

    execute() {
        this.receiver.performListProperties()
    }
}

module.exports = {
    Roll: Roll,
    Buy: Buy,
    Sell: Sell,
    Pass: Pass,
    Mortgage: Mortgage,
    PropertyList: PropertyList,
    SelectPropertyToSell: SelectPropertyToSell
}