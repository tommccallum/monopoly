var assert = require('assert');
const Dice = require('../../models/Dice');

describe('Dice model', () => {
    describe("create a new default dice", () => {
        it('should have property sides = 6', () => {
            const dice = new Dice.Dice()
            assert.strictEqual(dice.sides, 6)
        });
    });

    describe("create a new default dice with a string", () => {
        it('should have property sides = "6"', () => {
            try {
                const dice = new Dice.Dice("6")
                assert.fail("this should have thrown an error")
            } catch(error) {
            }
        });
    });

    describe("create a new default dice with a floating point number", () => {
        it('should have property sides = 6.2', () => {
            try {
                const dice = new Dice.Dice(6.2)
                assert.fail("this should have thrown an error")
            } catch(error) {
            }
        });
    });

    describe("create a new dice with 12 sides", () => {
        it('should have property sides = 12', () => {
            const dice = new Dice.Dice(12)
            assert.strictEqual(dice.sides, 12)
        });
    
        it('should roll values between 1 and 12', () => {
            const dice = new Dice.Dice(12)
            for( let ii=0; ii < 1000; ii++ ) {
                const value = dice.roll()
                assert.ok( value >= 1 && value <= 12)
            }
        });
    });
});