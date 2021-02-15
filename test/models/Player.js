const assert = require('assert');
const Observer = require("../../mocks/EventObserver");
const Player = require('../../models/Player');
const Mocks = require("../../mocks/MockSetup");

describe('Player model', () => {
    describe("create a new player", () => {
        it("should create new human", () => {
            const monopoly = Mocks.MockSetup()
            const player = new Player.Human(0, {}, 1000, 40, monopoly)
            assert.ok(player)
        });
    });
});