const Property = require("./Property")

class Board {

    // A board only makes sense if the squares
    // have been setup so we have this in the
    // constructor.
    constructor(gameData, banker) {
        this.squares = []

        for (let squareData of gameData.squares) {
            const square = Property.create(squareData)
            square.setBanker(banker)
            this.squares.push(square)
            if (square.isSellable()) {
                banker.addTitleDeed(square)
            }
        }
    }

    size() {
        return this.squares.length
    }

    getSquareAtIndex(index) {
        if ( index < 0 || index >= this.squares.length) {
            throw new Error(`invalid square index specified, should be between 0 and $(this.squares.count)`)
        }
        return this.squares[index]
    }

    indexOf(squareName) {
        for (let index = 0; index < this.squares.length; index++) {
            if (this.squares[index].name.toLowerCase() == squareName.toLowerCase()) {
                return index
            }
        }
        throw new Error(`square name '${squareName}' was not found`)
    }

    findNearest(squareGroup, start) {
        if (typeof (start) == "undefined") {
            throw new Error("start location is undefined")
        }
        for (let index = start; index < this.squares.length; index++) {
            if (this.squares[index].group.toLowerCase() == squareGroup.toLowerCase()) {
                return index
            }
        }
        if (start > 0) {
            for (let index = 0; index < start; index++) {
                if (this.squares[index].group.toLowerCase() == squareGroup.toLowerCase()) {
                    return index
                }
            }
        }
        throw new Error(`square group '${squareGroup}' was not found`)
    }
}

module.exports = {
    Board: Board
}