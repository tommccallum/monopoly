const assert = require('assert');
const Property = require('../../models/Property');
const Observer = require("../../mocks/EventObserver");
const Player = require('../../models/Player');
const Mocks = require("../../mocks/MockSetup");
const { MockChance } = require('../../mocks/ChanceCard');

describe('Property model', () => {
    describe("create a new chance", () => {
        it('check defaults', () => {
            const propertyData = {
                group: "chance",
                name: "Chance"
            }
            const property = Property.create(propertyData)
            assert.strictEqual(property.group, "chance")
            assert.strictEqual(property.name, "Chance")
        });

        it('check Chance Card 1, advance to go', () => {
            const monopoly = Mocks.MockSetup()
            const player = monopoly.players[0]
            const propertyData = {
                group: "chance",
                name: "Chance"
            }
            const property = new MockChance(propertyData)
            property.cardIndex = 0
            const oldBalance = player.balance
            property.visit(player)
            const newBalance = player.balance
            assert.strictEqual(player.location, 0) // should be at Go
            assert.strictEqual(newBalance - oldBalance, 200)
        });

        it('check Chance Card 2, advance to Trafalgar Square, do not pass go', () => {
            const monopoly = Mocks.MockSetup()
            const player = monopoly.players[0]
            const propertyData = {
                group: "chance",
                name: "Chance"
            }
            const property = new MockChance(propertyData)
            property.cardIndex = 1
            const oldBalance = player.balance
            player.location = 1
            property.visit(player)
            const newBalance = player.balance
            assert.strictEqual(player.location, 23) // should be at Trafalgar Square
            assert.strictEqual(newBalance - oldBalance, 0)
        });

        it('check Chance Card 2, advance to Trafalgar Square, do pass go', () => {
            const monopoly = Mocks.MockSetup()
            const player = monopoly.players[0]
            const propertyData = {
                group: "chance",
                name: "Chance"
            }
            const property = new MockChance(propertyData)
            property.cardIndex = 1
            const oldBalance = player.balance
            player.location = 24
            property.visit(player)
            const newBalance = player.balance
            assert.strictEqual(player.location, 23) // should be at Trafalgar Square
            assert.strictEqual(newBalance - oldBalance, 200)
        });

        it('check Chance Card 3, Advance to nearest utility. Not passing go.', () => {
            const monopoly = Mocks.MockSetup()
            const player = monopoly.players[0]
            const propertyData = {
                group: "chance",
                name: "Chance"
            }
            const property = new MockChance(propertyData)
            property.cardIndex = 2
            const oldBalance = player.balance
            player.location = 2
            property.visit(player)
            const newBalance = player.balance
            assert.strictEqual(player.location, 11) // should be at Trafalgar Square
            assert.strictEqual(newBalance - oldBalance, 0)
        });

        it('check Chance Card 3, Advance to nearest utility. Passing go.', () => {
            const monopoly = Mocks.MockSetup()
            const player = monopoly.players[0]
            const propertyData = {
                group: "chance",
                name: "Chance"
            }
            const property = new MockChance(propertyData)
            property.cardIndex = 2
            const oldBalance = player.balance
            player.location = 33
            property.visit(player)
            const newBalance = player.balance
            assert.strictEqual(player.location, 11) // should be at Trafalgar Square
            assert.strictEqual(newBalance - oldBalance, 200)
        });


        it('check Chance Card 3, Advance to nearest station. Not passing go.', () => {
            const monopoly = Mocks.MockSetup()
            const player = monopoly.players[0]
            const propertyData = {
                group: "chance",
                name: "Chance"
            }
            const property = new MockChance(propertyData)
            property.cardIndex = 3
            const oldBalance = player.balance
            player.location = 2
            property.visit(player)
            const newBalance = player.balance
            assert.strictEqual(player.location, 4) // should be at Trafalgar Square
            assert.strictEqual(newBalance - oldBalance, 0)
        });

        it('check Chance Card 3, Advance to nearest station. Passing go.', () => {
            const monopoly = Mocks.MockSetup()
            const player = monopoly.players[0]
            const propertyData = {
                group: "chance",
                name: "Chance"
            }
            const property = new MockChance(propertyData)
            property.cardIndex = 3
            const oldBalance = player.balance
            player.location = 34
            property.visit(player)
            const newBalance = player.balance
            assert.strictEqual(player.location, 4) // should be at Trafalgar Square
            assert.strictEqual(newBalance - oldBalance, 200)
        });

        it('check Chance Card 4, Bank pays Dividend.', () => {
            const monopoly = Mocks.MockSetup()
            const player = monopoly.players[0]
            const propertyData = {
                group: "chance",
                name: "Chance"
            }
            const property = new MockChance(propertyData)
            property.cardIndex = 4
            const oldBalance = player.balance
            player.location = 6
            property.visit(player)
            const newBalance = player.balance
            assert.strictEqual(player.location, 6) 
            assert.strictEqual(newBalance - oldBalance, 50)
        });

        it('check Chance Card 5, Get out of jail free.', () => {
            const monopoly = Mocks.MockSetup()
            const player = monopoly.players[0]
            const propertyData = {
                group: "chance",
                name: "Chance"
            }
            const property = new MockChance(propertyData)
            property.cardIndex = 5
            const oldBalance = player.balance
            player.location = 6
            property.visit(player)
            const newBalance = player.balance
            assert.strictEqual(player.location, 6) 
            assert.strictEqual(newBalance - oldBalance, 0)
            assert.strictEqual(player.chanceCards.length, 1)
        });

        it('check Chance Card 6, go back 3 spaces.', () => {
            const monopoly = Mocks.MockSetup()
            const player = monopoly.players[0]
            const propertyData = {
                group: "chance",
                name: "Chance"
            }
            const property = new MockChance(propertyData)
            property.cardIndex = 6
            const oldBalance = player.balance
            player.location = 6
            property.visit(player)
            const newBalance = player.balance
            assert.strictEqual(player.location, 3) 
            assert.strictEqual(newBalance - oldBalance, 0)
            assert.strictEqual(player.chanceCards.length, 0)
        });

        it('check Chance Card 7, go to jail without passing go.', () => {
            const monopoly = Mocks.MockSetup()
            const player = monopoly.players[0]
            const propertyData = {
                group: "chance",
                name: "Chance"
            }
            const property = new MockChance(propertyData)
            property.cardIndex = 7
            const oldBalance = player.balance
            player.location = 6
            property.visit(player)
            const newBalance = player.balance
            assert.strictEqual(player.location, 9) 
            assert.strictEqual(newBalance - oldBalance, 0)
            assert.strictEqual(player.chanceCards.length, 0)
        });

        it('check Chance Card 8, Make general repairs to your properties..', () => {
            const monopoly = Mocks.MockSetup()
            const player = monopoly.players[0]
            const propertyData = {
                group: "chance",
                name: "Chance"
            }
            const property = new MockChance(propertyData)
            property.cardIndex = 8
            const oldBalance = player.balance
            const oldBanker = monopoly.banker.model.balance
            player.location = 6
            // overwrite original function
            player.getHouseCount = () => 3
            player.getHotelCount = () => 4
            // expected repairs is 475
            property.visit(player)
            const newBalance = player.balance
            const newBanker = monopoly.banker.model.balance
            assert.strictEqual(player.location, 6) 
            assert.strictEqual(newBalance - oldBalance, -475)
            assert.strictEqual(player.chanceCards.length, 0)
            assert.strictEqual(newBanker - oldBanker, 475)
        });

        it('check Chance Card 9, pay poor tax of $15.', () => {
            const monopoly = Mocks.MockSetup()
            const player = monopoly.players[0]
            const propertyData = {
                group: "chance",
                name: "Chance"
            }
            const property = new MockChance(propertyData)
            property.cardIndex = 9
            const oldBalance = player.balance
            const oldBanker = monopoly.banker.model.balance
            player.location = 6
            property.visit(player)
            const newBalance = player.balance
            const newBanker = monopoly.banker.model.balance
            assert.strictEqual(player.location, 6) 
            assert.strictEqual(newBalance - oldBalance, -15)
            assert.strictEqual(player.chanceCards.length, 0)
            assert.strictEqual(newBanker - oldBanker, 15)
        });

        it('check Chance Card 10, advance to King\'s Cross Station, do pass go', () => {
            const monopoly = Mocks.MockSetup()
            const player = monopoly.players[0]
            const propertyData = {
                group: "chance",
                name: "Chance"
            }
            const property = new MockChance(propertyData)
            property.cardIndex = 10
            const oldBalance = player.balance
            player.location = 24
            property.visit(player)
            const newBalance = player.balance
            assert.strictEqual(player.location, 4) 
            assert.strictEqual(newBalance - oldBalance, 200)
        });
    });
});