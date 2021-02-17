const readline = require('readline') // builtin library (https://nodejs.org/api/readline.html)
const Monopoly = require('../../models/Game.js')
const Board = require("../../models/Board.js")
const GameData = require("../../config/GameData")
const assert = require("assert")
const Banker = require("../../models/Banker")
const BankerController = require("../../controllers/BankerController")

/**
 * Views are the objects that actually display the information when 
 * necessary.  These can have access to the model via the controller but do not change it.
 */

class BoardView
{
    /**
     * Create new BoardView object
     * @param {BoardController} board 
     */
    constructor(board) {
        this.boardController = board;
    }

    render() {
        console.log("this is the current state of the board")
    }
}

/**
 * This is really MV as there is no controller for the moves.
 */
class PromptView 
{
    constructor(prompt) {
        this.promptModel = prompt
    }

    render() 
    {
        let result = ""
        for( let move of this.promptModel.moves) 
        {
            result += `Press ${move.key} to ${move.text}`
            result += '\n'
        }
        result += "> "
        return result
    }
}

class BotView 
{
    constructor(prompt) {
        this.promptModel = prompt
    }

    render() 
    {
        let result = ""
        for( let move of this.promptModel.moves) 
        {
            result += `Press ${move.key} to ${move.text}`
            result += '\n'
        }
        return result
    }
}


const Object = require("../../models/Object");
class Logger extends Object.Object
{
    onAnnouncement(event) 
    {
        console.log(`\x1b[33m${event.data.text}\x1b[0m`)
    }

    onBankBalanceChange(event)
    {
        console.log(`\x1b[31mBanker's balance has changed from ${event.data.old} to ${event.data.new}\x1b[0m`)
    }
}

// REPL = READ-EVAL-PROMPT-LOOP and is the common term for a console based interactive application
function replPrompt(rl)
{
    const logger = new Logger()

    const bankerModel = new Banker.Model()
    const banker = new BankerController.Controller(bankerModel)
    banker.addListener(logger)
    
    // here we use the Dependency Injection design pattern to inject
    // the banker into the Monopoly class.  This way we can 
    // use a Mock banker in testing or change the banker functionality without the
    // Monopoly caring.
    const monopoly = new Monopoly.Monopoly(GameData, banker, numPlayers)
    monopoly.addListener(logger)
    monopoly.setup()

    const infiniteReadLoop = (userInput) => {

        // print out the new state of the board
        const boardView = new BoardView(monopoly)
        boardView.render()
        
        // process the last userInput if there was any
        const move = monopoly.takeTurn(userInput)
        assert(move != null)

        if ( move.isHuman() ) {
            const promptView = new PromptView(move)
            // when the callback returns undefined/false
            // the loop will break
            rl.question(promptView.render(), resp => { 
                resp = resp.trim()
                if ( resp == "q" ) {
                    rl.close()
                    return false
                }
                if ( resp.length > 0) {
                    console.log(`You entered '${resp}'`)
                }
                infiniteReadLoop(resp); // Q: why does this not grow the stack like a recursive function?
                                        // A: rl.question registers the call back and returns IMMEDIATELY
                                        //    when the callback is run THEN infiniteReadLoop is called,
                                        //    so this is not actually a recursive call.
                                        //    You can see this by doing the following:
                                        //    const stack = new Error().stack; console.log(stack);
            } )
        } else {
            // generate random move for automated player
            const key = move.getRandom()  
            const promptView = new BotView(move)
            console.log(promptView.render())
            rl.question("Hit any to continue...", res => {
                infiniteReadLoop(key);
            });
        }
    }

    infiniteReadLoop(null)          // start our infinite loop
}

// TODO check for arguments about which language to use
// and load appropriate language strings

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// ask the player to select how many players they want to use
rl.question("How many real players do you want to play [1-4]? ", resp => {
    const val = parseInt(resp)
    if ( val >= 1 && val <= 4 ) {
        numPlayers = val
    }
    replPrompt(rl, numPlayers)
})


