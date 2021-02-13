const readline = require('readline') // builtin library (https://nodejs.org/api/readline.html)
const Monopoly = require('../../models/Game.js')
const Board = require("../../models/Board.js")

class BoardView
{
    /**
     * Create new BoardView object
     * @param {BoardModel} board 
     */
    constructor(board) {
        this.boardModel = board;
    }

    render() {
        console.log("this is the current state of the board")
    }
}

class PromptView 
{
    constructor(prompt) {
        this.promptModel = prompt
    }

    render() 
    {
        return "Next Move? "
    }
}

// REPL = READ-EVAL-PROMPT-LOOP and is the common term for a console based interactive application
function replPrompt(rl)
{
    const monopoly = new Monopoly.Monopoly(numPlayers)

    const infiniteReadLoop = (userInput) => {

        // print out the new state of the board
        const boardView = new BoardView(monopoly)
        boardView.render()
        
        // process the last userInput if there was any
        const move = monopoly.takeTurn(userInput)
        
        if ( move.isHuman() ) {
            const promptView = new PromptView(move)
            // when the callback returns undefined/false
            // the loop will break
            rl.question(promptView.render(), resp => { 
                console.log(resp); 
                if ( resp == "q" ) {
                    rl.close()
                    return false
                }
                console.log("received "+resp)
                infiniteReadLoop(resp); // Q: why does this not grow the stack like a recursive function?
                                        // A: rl.question registers the call back and returns IMMEDIATELY
                                        //    when the callback is run THEN infiniteReadLoop is called,
                                        //    so this is not actually a recursive call.
                                        //    You can see this by doing the following:
                                        //    const stack = new Error().stack; console.log(stack);
            } )
        } else {
            // generate random move for automated player
            infiniteReadLoop(null)     
        }
    }

    infiniteReadLoop(null)          // start our infinite loop
}

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


