
var utils = require('../../index.js');

describe('readFile', function() {

    describe('reads a file that does exist', function (expect) {
        var thisFile = utils.readFile(__dirname + '/readFile.spec.js');
        expect(typeof thisFile).toBe('string');
        expect(thisFile.length).toBeGreaterThan(0);
    });

    describe('handles files that do not exist', function (expect) {
        var onError = function () {};
        expect(utils.readFile('badpath', onError)).toBe('');
    });

});
