class Move 
{
    constructor()
    {
        this._isHuman = true
    }

    isHuman() {
        return this._isHuman
    }
}

module.exports = {
    Move:Move
}