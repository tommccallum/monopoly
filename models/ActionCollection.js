const random = require("random")

class ActionCollection
{
    constructor(human)
    {
        this.human = human
        this.moves= []
    }

    // this function 'forwards' the call to the player object
    isHuman() {
        return this.human
    }

    exists( key ) {
        for( let move of this.moves ) {
            if ( move.key.toUpperCase() == key.toUpperCase() ) {
                return true
            }
        }
        return false
    }

    size() {
        return this.moves.length
    }

    /**
     * Removes a move and returns the removed move
     * @param {string} key 
     */
    remove(key) {
        // we need to remove Pass when we are rolling a dice again
        for( let index in this.moves ) {
            if ( this.moves[index].key.toUpperCase() == key.toUpperCase() ) {
                const items = this.moves.splice(index, 1)
                return items[0]
            }
        }
        return null
    }

    containsOnlyPermanentActionsOrPass() {
        for( let index in this.moves ) {
            if ( !this.moves[index].command.permanent 
                && this.moves[index].key.toUpperCase() != "P" ) {
                return false
            }
        }
        return true
    }

    removePermanentActions() {
        const newMovesArray = []
        for( let index in this.moves ) {
            if ( !this.moves[index].command.permanent ) {
                newMovesArray.push(this.moves[index])
            }
        }
        this.moves = newMovesArray
    }

    removePass() {
        const newMovesArray = []
        for( let index in this.moves ) {
            if ( this.moves[index].key.toUpperCase() != "P" ) {
                newMovesArray.push(this.moves[index])
            }
        }
        this.moves = newMovesArray
    }

    removeListIndices() {
        const newMovesArray = []
        for( let index in this.moves ) {
            if ( this.moves[index].command.isListIndex == false ) {
                newMovesArray.push(this.moves[index])
            }
        }
        this.moves = newMovesArray
    }

    isOnlyPassRemaining() {
        if ( this.moves.length == 0 ) {
            return false
        }
        if ( this.moves.length > 1 ) {
            return false
        }
        if ( this.moves[0].key.toUpperCase() == "P" ) {
            return true
        }
        return false
    }

    /**
     * Adds a single command to the collection
     * @param {string} key 
     * @param {string} text 
     * @param {Commmand} command 
     */
    add(key, text, command, data) {
        let obj = null
        if ( typeof(key) == "object" ) {
            obj = key
            obj.key = obj.key.toUpperCase()
        } else {
            obj = { key: key.toUpperCase(), text: text, command:command, data: data }
        }
        if ( !this.exists(obj.key) ) {
            if ( obj.key.toUpperCase() == "P" ) {
                this.remove("R")
            } else if ( obj.key.toUpperCase() == "R" ) {
                this.remove("P")
            } 
            this.moves.push(obj)
        }
    }

    /**
     * Adds multiple options to the collection, assumes that each item consists of {key,text,command} key-value pairs
     * @param {array} choices 
     */
    addAll(choices) 
    {
        for( let choice of choices ) {
            if ( !this.exists(choice.key) ) {
                this.add(choice)
            }
        }
    }

    /**
     * Test if collection is empty
     */
    isEmpty() {
        return this.moves.length == 0
    }

    contains(key) {
        for( let move of this.moves) {
            if ( move.key.toLowerCase() == key.toLowerCase() ) {
                return true
            }
        }
        return false
    }

    /**
     * Check if a command is mapped to the key value and if so execute, otherwise throw an error.
     * @param {string} userInput 
     */
    findAndExecute(userInput) {
        for( let move of this.moves) {
            if ( move.key.toLowerCase() == userInput.toLowerCase() ) {
                if ( "command" in move ) {
                    move.command.execute(move.data)
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
        if ( this.moves.length == 0 ) {
            throw new Error("no moves available")
        }
        const r = random.int(0, this.moves.length-1)
        return this.moves[r].key.toLowerCase()
    }
}

module.exports = {
    ActionCollection:ActionCollection
}