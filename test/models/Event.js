var assert = require('assert');
const Event = require('../../models/Event');

describe('Event model', () => {
    describe("create a new event model", () => {
        it('should have the name set', () => {
            class Test {}
            const object = new Test()
            const ev = new Event.Event(object, "test")
            assert.strictEqual(ev.name, "test")
            assert.ok(ev.data == null)
            assert.strictEqual(ev.source, object)
        });

        it('should have handler name onTest', () => {
            const object = {}
            const ev = new Event.Event(object, "test")
            assert.strictEqual(ev.getExpectedHandlerName(), "onTest")
        });
    });
});