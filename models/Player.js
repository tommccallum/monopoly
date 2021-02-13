class Player
{
  constructor(index, token, balance) 
  {
    this.index = index  // index will start at 1
    this.balance = balance
    this.properties = []
    this.token = token
  }
}

class Human extends Player
{
  constructor(...args) 
  {
    super(...args)
    this._isHuman = true
    console.log(`Creating human ${this.index} with token ${this.token.name} and balance ${this.balance}`)
  }
}

class Bot extends Player
{
  constructor(...args) 
  {
    super(...args)
    this._isHuman = false
    console.log(`Creating bot ${this.index} with token ${this.token.name} and balance ${this.balance}`)
  }
}

module.exports = {
  Human: Human,
  Bot: Bot
}