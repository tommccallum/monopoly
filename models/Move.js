const random = require("random")

class Move 
{
    constructor(player)
    {
        this.human = player.isHuman
        this.moves= []
    }

    isHuman() {
        return this.human
    }

    add(key, prompt, command) {
        const obj = { key: key, text: prompt, command:command }
        this.moves.push(obj)
    }

    addAll(choices) 
    {
        for( let choice of choices ) {
            this.moves.push(choice)
        }
    }

    isEmpty() {
        return this.moves.length == 0
    }

    execute(userInput) {
        for( let move of this.moves) {
            if ( move.key.toLowerCase() == userInput.toLowerCase() ) {
                if ( "command" in move ) {
                    move.command.execute()
                }
                return
            }
        }
        throw new Error(`invalid input, not command registered for '${userInput}'`)
    }

    getRandom() 
    {
        const r = random.int(0, this.moves.length-1)
        return this.moves[r].key.toLowerCase()
    }
}

module.exports = {
    Move:Move
}