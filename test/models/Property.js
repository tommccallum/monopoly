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

        
    });
});