/**
 * Token class for the token the player moves about, currently just has a name but could have an image url 
 * associated with it as well or a color etc.
 */
class Token
{
    constructor(tokenData)
    {
        this.name = tokenData.name
    }
}

module.exports = {
    Token: Token
}