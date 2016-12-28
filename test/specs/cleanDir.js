
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var utils = require('../../index.js');

describe('cleanDir', function () {

    describe('deletes all files from a directory', function (expect) {
        var tmpDir = __dirname + '/../tmp';
        mkdirp.sync(tmpDir + '/sub');

        fs.writeFileSync(tmpDir + '/sub/foo.bar', 'foobar');
        expect(utils.listFiles(tmpDir).length).toBe(1);

        utils.cleanDir(tmpDir + '/sub');
        expect(utils.listFiles(tmpDir)).toBe([]);
    });

});
