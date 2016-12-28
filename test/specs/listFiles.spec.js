
var utils = require('../../index.js');

describe('listFiles', function() {

    var list = utils.listFiles(__dirname);

    describe('list has multiple files', function (expect) {
        expect(list.length).toBeGreaterThan(1);
    });

    describe('contains at least one correct file', function (expect) {
        expect(list.indexOf(__dirname + '/listFiles.spec.js') !== -1).toBe(true);
    });

});
