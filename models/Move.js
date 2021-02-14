const random = require("random")

class ActionCollection
{
    constructor(player)
    {
        this.player = player
        this.moves= []
    }

    // this function 'forwards' the call to the player object
    isHuman() {
        return this.player.isHuman
    }

    /**
     * Adds a single command to the collection
     * @param {string} key 
     * @param {string} text 
     * @param {Commmand} command 
     */
    add(key, text, command) {
        const obj = { key: key, text: text, command:command }
        this.moves.push(obj)
    }

    /**
     * Adds multiple options to the collection, assumes that each item consists of {key,text,command} key-value pairs
     * @param {array} choices 
     */
    addAll(choices) 
    {
        for( let choice of choices ) {
            this.moves.push(choice)
        }
    }

    /**
     * Test if collection is empty
     */
    isEmpty() {
        return this.moves.length == 0
    }

    /**
     * Check if a command is mapped to the key value and if so execute, otherwise throw an error.
     * @param {string} userInput 
     */
    findAndExecute(userInput) {
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

    /**
     * getRandom is used to select an action at random for the bots.
     */
    getRandom() 
    {
        const r = random.int(0, this.moves.length-1)
        return this.moves[r].key.toLowerCase()
    }
}

module.exports = {
    Move:ActionCollection
}