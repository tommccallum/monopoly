var assert = require('assert');
var { EventObserver } = require("../../mocks/EventObserver")
var Mocks = require("../../mocks/MockSetup")
const BankerModel = require("../../models/Banker")
const { Event } = require("../../models/Event")
const BankerController = require("../../controllers/BankerController")

describe('Banker Controller', () => {
    describe("create a new banker controller", () => {
        it("should be given a banker", () => {
            const bankerModel = new BankerModel.Model()
            assert.ok(bankerModel)
            const controller = new BankerController.Controller(bankerModel)
            assert.ok(controller)
        })

        it("should fail it not given a banker object", () => {
            try {
                const controller = new BankerController()
                assert.fail("no exception could be thrown")
            } catch( error ) {
                assert.ok(true, "exception was correctly thrown")
            }
        });
    });

    describe("banker can", () => {
        it("pay in an amount of money", () => {
            const bankerModel = new BankerModel.Model()
            const controller = new BankerController.Controller(bankerModel)
            const oldBalance = controller.model.balance
            controller.payIn(10)
            const newBalance = controller.model.balance
            assert.strictEqual(newBalance - oldBalance, 10)
        });

        it("pay in an amount of money to a player", () => {
            const monopoly = Mocks.MockSetup()
            const playerController = monopoly.players[0]
            const bankerModel = new BankerModel.Model()
            const controller = new BankerController.Controller(bankerModel)
            const oldBalance = controller.model.balance
            const playerOldBalance = playerController.model.balance
            controller.payOut(playerController, 10)
            const newBalance = controller.model.balance
            const playerNewBalance = playerController.model.balance
            assert.strictEqual(newBalance - oldBalance, -10)
            assert.strictEqual(playerNewBalance - playerOldBalance, +10)
        });
    });

    describe("banker will receive events", () => {
        it("it will pass all BankerModel events on to listener", () => {
            const observer = new EventObserver()
            const bankerModel = new BankerModel.Model()
            const controller = new BankerController.Controller(bankerModel)
            const event = new Event(bankerModel, "test")
            observer.add((event) => {
                assert.strictEqual(event.name, "test")
                assert.strictEqual(event.source, bankerModel)
            })
            controller.addListener(observer)
            controller.onAny(event)
            assert.strictEqual(observer.getEventsCaught(), 1)
        })

        it("it will not pass other events on to listener", () => {
            const observer = new EventObserver()
            const bankerModel = new BankerModel.Model()
            const controller = new BankerController.Controller(bankerModel)
            const event = new Event({}, "test")
            observer.add((event) => {
                assert.fail("signal sent in error")
            })
            controller.addListener(observer)
            controller.onAny(event)
            assert.strictEqual(observer.getEventsCaught(), 0)
        })

        it("should handle an onPayBank event", () => {
            const observer = new EventObserver()
            const bankerModel = new BankerModel.Model()
            const controller = new BankerController.Controller(bankerModel)
            const event = new Event(bankerModel, "payBank", { amount: 10 })
            const oldBalance = controller.model.balance
            controller.onPayBank(event)
            const newBalance = controller.model.balance
            assert.strictEqual(newBalance - oldBalance, 10)
        });

        it("should throw onPayBank event if no amount property set", () => {
            const observer = new EventObserver()
            const bankerModel = new BankerModel.Model()
            const controller = new BankerController.Controller(bankerModel)
            const event = new Event(bankerModel, "payBank")
            const oldBalance = controller.model.balance
            try {
                controller.onPayBank(event)
                assert.fail("this should have thrown an error as no amount was specified")
            } catch(error) {
                const newBalance = controller.model.balance
                assert.strictEqual(newBalance - oldBalance, 0)    
            }
        });

        it("should buy on an onPurchase event if player has enough money", () => {
            const observer = new EventObserver()
            const monopoly = Mocks.MockSetup()
            const playerController = monopoly.players[0]
            const bankerModel = new BankerModel.Model()
            const controller = new BankerController.Controller(bankerModel)
            const square = monopoly.board.getSquareAtIndex(1)
            const event = new Event(playerController, "purchase", {square: square})
            const oldBalance = controller.model.balance
            const playerOldBalance = playerController.model.balance
            controller.onPurchase(event)
            const newBalance = controller.model.balance
            const playerNewBalance = playerController.model.balance
            assert.strictEqual(newBalance - oldBalance, 60)    
            assert.strictEqual(playerNewBalance - playerOldBalance, -60) 
            assert.strictEqual(playerController.model.properties.length, 1)   
        });

        it("should not buy on an onPurchase event if player does not have money", () => {
            const observer = new EventObserver()
            const monopoly = Mocks.MockSetup()
            const playerController = monopoly.players[0]
            playerController.model.balance = 59
            const bankerModel = new BankerModel.Model()
            const controller = new BankerController.Controller(bankerModel)
            const square = monopoly.board.getSquareAtIndex(1)
            square.purchasePrice = 60 // make sure this does not change as our game data will change
            const event = new Event(playerController, "purchase", {square: square})
            const oldBalance = controller.model.balance
            const playerOldBalance = playerController.model.balance
            controller.onPurchase(event)
            const newBalance = controller.model.balance
            const playerNewBalance = playerController.model.balance
            assert.strictEqual(newBalance - oldBalance, 0)    
            assert.strictEqual(playerNewBalance - playerOldBalance, 0) 
            assert.strictEqual(playerController.model.properties.length, 0)   
        });

        it("should give money to a player on an onPayDividend event", () => {
            const observer = new EventObserver()
            const monopoly = Mocks.MockSetup()
            const playerController = monopoly.players[0]
            const bankerModel = new BankerModel.Model()
            const controller = new BankerController.Controller(bankerModel)
            const event = new Event(playerController, "payDividend", {amount: 10})
            const oldBalance = controller.model.balance
            const playerOldBalance = playerController.model.balance
            controller.onPayDividend(event)
            const newBalance = controller.model.balance
            const playerNewBalance = playerController.model.balance
            assert.strictEqual(newBalance - oldBalance, -10)    
            assert.strictEqual(playerNewBalance - playerOldBalance, 10)  
        });

        it("should throw onPayDividend event if no amount property set", () => {
            const observer = new EventObserver()
            const bankerModel = new BankerModel.Model()
            const controller = new BankerController.Controller(bankerModel)
            const event = new Event(bankerModel, "payDividend")
            const oldBalance = controller.model.balance
            try {
                controller.onPayDividend(event)
                assert.fail("this should have thrown an error as no amount was specified")
            } catch(error) {
                const newBalance = controller.model.balance
                assert.strictEqual(newBalance - oldBalance, 0)    
            }
        });

        // TODO test player bankrupcy
        // TODO test bank bankrupcy
        // TODO test onSale
    });



});