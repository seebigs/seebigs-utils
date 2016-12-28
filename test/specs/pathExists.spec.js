
var utils = require('../../index.js');

describe('pathExists', function() {

    describe('detects when a path does exist', function (expect) {
        expect(utils.pathExists(__dirname)).toBe(true);
    });

    describe('detects when a path does NOT exist', function (expect) {
        expect(utils.pathExists(__dirname + '/badpath')).toBe(false);
    });

});
