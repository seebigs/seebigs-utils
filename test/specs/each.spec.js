
var utils = require('../../index.js');

describe("each", function() {
    var arr = [1, 2, 3];
    var obj = { abc: 123, def: 456 };

    describe("when given undefined", function() {
        describe("does not iterate", function(expect) {
            var happened = false;
            utils.each(void 0, function () {
                happened = true;
            });
            expect(happened).toBe(false);
        });
    });
    describe("when given an empty array", function() {
        describe("does not iterate", function(expect) {
            var happened = false;
            utils.each([], function () {
                happened = true;
            });
            expect(happened).toBe(false);
        });
    });
    describe("when given an array with length", function() {
        describe("iterates the array", function(expect) {
            var actual = [],
                expected = [
                    { ndx: 0, val: 1, col: arr },
                    { ndx: 1, val: 2, col: arr },
                    { ndx: 2, val: 3, col: arr }
                ];
            utils.each(arr, function(v, k, c) {
                actual.push({ ndx: k, val: v, col: c });
            });
            expect(actual).toEqual(expected);
        });
    });
    describe("when given an arguments object", function() {
        describe("iterates the arguments", function(expect) {
            var each = utils.each;
            var actual = [];
            var expected;

            function someFn () {
                expected = [
                    { ndx: 0, val: arguments[0], col: arguments },
                    { ndx: 1, val: arguments[1], col: arguments }
                ];

                each(arguments, function(v, k, c) {
                    actual.push({ ndx: k, val: v, col: c });
                });
            }

            someFn('arg1', 'arg2');
            expect(actual).toEqual(expected);
        });
    });
    describe("when given an object", function() {
        describe("iterates the object", function(expect) {
            var actual = [],
                expected = [
                    { key: 'abc', val: 123, col: obj },
                    { key: 'def', val: 456, col: obj }
                ];
            utils.each(obj, function(v, k, c) {
                actual.push({ key: k, val: v, col: c });
            });
            expect(actual).toEqual(expected);
        });
    });
    describe("when given an object with length (jquery)", function() {
        describe("iterates the object as it would an array", function(expect) {
            var jq = { 0: 'abc', length: 1 },
                actual = [],
                expected = [
                    { key: 0, val: 'abc', col: jq }
                ];
            utils.each(jq, function(v, k, c) {
                actual.push({ key: k, val: v, col: c });
            });
            expect(actual).toEqual(expected);
        });
    });
    describe("when an iteratee returns false", function() {
        describe("drops out of the loop", function(expect) {
            var lastVal;
            utils.each(arr, function(v) {
                lastVal = v;
                return false;
            });
            expect(lastVal).toBe(1);
        });
    });
});
