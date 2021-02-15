const assert = require('assert');
const Observer = require("../../mocks/EventObserver");
const Player = require('../../models/Player');
const Mocks = require("../../mocks/MockSetup");
const { MockChance } = require('../../mocks/ChanceCard');
const { MockCommunityChest } = require('../../mocks/CommunityChestCard');

describe('Player model', () => {
    describe("when adding income", () => {
        it("should adjust balance", () => {
            const player = new Player.Human(0, {}, 1000)
            player.addIncome(100)
            assert.strictEqual(player.balance, 1100)
        });

        it("should be >= 0 or throw an error", () => {
            const player = new Player.Human(0, {}, 1000)
            try {
                player.addIncome(-100)
                assert.fail("failed to throw error on negative amount")
            } catch( error) {
            }
            assert.strictEqual(player.balance, 1000)
        });

    });

    describe("when making a withdrawal", () => {
        it("should adjust balance", () => {
            const player = new Player.Human(0, {}, 1000)
            player.withdraw(100)
            assert.strictEqual(player.balance, 900)
        });

        it("should be >= 0 or throw an error", () => {
            const player = new Player.Human(0, {}, 1000)
            try {
                player.withdraw(-100)
                assert.fail("failed to throw error on negative amount")
            } catch( error) {
            }
            assert.strictEqual(player.balance, 1000)
        });
    });

    describe("when in jail", () => {
        it("and have free from jail Chance card, should free from jail", () => {
            const player = new Player.Human(0, {}, 1000)
            player.inJail = true
            const propertyData = {
                group: "chance",
                name: "Chance"
            }
            const property = new MockChance(propertyData)
            property.cardIndex = 5
            const card = property.get()
            player.chanceCards.push(card)
            const wasCardUsed = player.useFreeFromJailCard()
            assert.strictEqual(wasCardUsed, true)
            assert.strictEqual(player.inJail, false)
        });

        it("and have free from jail Community Chest card, should free from jail", () => {
            const player = new Player.Human(0, {}, 1000)
            player.inJail = true
            const propertyData = {
                group: "chance",
                name: "Chance"
            }
            const property = new MockCommunityChest(propertyData)
            property.cardIndex = 4
            const card = property.get()
            player.communityChestCards.push(card)
            const wasCardUsed = player.useFreeFromJailCard()
            assert.strictEqual(wasCardUsed, true)
            assert.strictEqual(player.inJail, false)
        });
    });
});