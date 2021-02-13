class Move 
{
    constructor()
    {
        this._isHuman = true
        this.moves= []
    }

    isHuman() {
        return this._isHuman
    }

    add(key, prompt) {
        const obj = { key: key, prompt: prompt }
        this.moves.push(obj)
    }
}

module.exports = {
    Move:Move
}