
var utils = require('../../index.js');

describe('getPropertyIfPresent', function() {
    var obj = {
        one: {
            two: {
                three: 3
            }
        }
    };
    describe("gets a property when one is set", function(expect) {
        expect(utils.getPropertyIfPresent(obj, 'one.two.three')).toBe(3);
    });
    describe("fails gracefully when the path doesn't exist", function(expect) {
        expect(utils.getPropertyIfPresent(obj, 'one.not.found')).toBe(void 0);
    });
    describe('fails gracefully when the object doesnt exist', function (expect) {
        expect(utils.getPropertyIfPresent(undefined, 'one.two.three')).toBe(void 0);
    });
});
