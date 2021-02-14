var assert = require('assert');
var Observer = require("../../mocks/EventObserver")
const BankerModel = require("../../models/Banker")

describe('Banker model', () => {
    describe("create a new banker model", () => {
        it('should have default values when created', () => {
            const banker = new BankerModel.Model()
            assert.ok(typeof (banker.balance) == "number")
            assert.ok(banker.balance > 0)
            assert.ok(typeof (banker.titleDeeds) == "object")
            assert.ok(banker.titleDeeds.length == 0)
            assert.ok(typeof (banker.houseCount) == "number")
            assert.ok(banker.houseCount > 0)
            assert.ok(typeof (banker.hotelCount) == "number")
            assert.ok(banker.hotelCount > 0)
        });
    });

    describe("when you add a new title deed", () => {
        it('should increase title deeds by 1', () => {
            const mockProperty = {}
            const banker = new BankerModel.Model()
            const observer = new Observer.EventObserver()
            banker.addListener(observer)
            observer.add((event) => {
                assert.strictEqual(event.name, "newTitleDeed")
                assert.ok(event.data == null)
            })
            assert.strictEqual(banker.titleDeeds.length, 0)
            banker.addTitleDeed(mockProperty)
            assert.strictEqual(banker.titleDeeds.length, 1)

        });
    });

    describe("you change the balance", () => {
        it('should change by positive amount for a positive value', () => {
            const banker = new BankerModel.Model()
            const observer = new Observer.EventObserver()
            banker.addListener(observer)
            observer.add((event) => {
                if (event.name != "beforeBalanceChanged" &&
                    event.name != "afterBalanceChanged") {
                    assert.fail(`event name ${event.name} was unexpected`)
                }
                assert.ok("amount" in event.data)
                assert.ok(typeof (event.data.amount) == "number")
            })
            const original = banker.balance
            const amount = 10
            banker.changeBalance(amount)
            const newBalance = banker.balance
            assert.strictEqual(newBalance - original, amount)
        });

        it('should change by negative amount for a negative value', () => {
            const banker = new BankerModel.Model()
            const observer = new Observer.EventObserver()
            banker.addListener(observer)
            observer.add((event) => {
                if (event.name != "beforeBalanceChanged" &&
                    event.name != "afterBalanceChanged") {
                    assert.fail(`event name ${event.name} was unexpected`)
                }
                assert.ok("amount" in event.data)
                assert.ok(typeof (event.data.amount) == "number")
            })
            const original = banker.balance
            const amount = -10
            banker.changeBalance(amount)
            const newBalance = banker.balance
            assert.strictEqual(newBalance - original, amount)
        });

        it('should change by zero amount for a zero value', () => {
            const banker = new BankerModel.Model()
            const observer = new Observer.EventObserver()
            banker.addListener(observer)
            observer.add((event) => {
                if (event.name != "beforeBalanceChanged" &&
                    event.name != "afterBalanceChanged") {
                    assert.fail(`event name ${event.name} was unexpected`)
                }
                assert.ok("amount" in event.data)
                assert.ok(typeof (event.data.amount) == "number")
            })
            const original = banker.balance
            const amount = 0
            banker.changeBalance(amount)
            const newBalance = banker.balance
            assert.strictEqual(newBalance - original, amount)
        });

        it('should throw an error if amount > balance', () => {
            const banker = new BankerModel.Model()
            const observer = new Observer.EventObserver()
            banker.addListener(observer)
            observer.add((event) => {
                assert.fail("there should be no events in case of bankrupcy")
            })
            const original = banker.balance
            const amount = -original
            try {
                banker.changeBalance(amount)
                assert.fail("banker should have thrown an error")
            } catch( error ) {
                assert.ok(true, "error caught")
            }
            // there should be no change in the balance
            const newBalance = banker.balance
            assert.strictEqual(newBalance - original, 0)
        });
    })
});