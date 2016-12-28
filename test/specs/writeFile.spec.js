
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var utils = require('../../index.js');

describe('writeFile', function () {

    describe('writes a file at the specified destination', function (expect, done) {
        var tmpDir = __dirname + '/../tmp';
        mkdirp.sync(tmpDir + '/sub');

        utils.cleanDir(tmpDir + '/sub');
        expect(utils.listFiles(tmpDir)).toBe([]);

        utils.writeFile(tmpDir + '/sub/foo.bar', 'foobar', function (file) {
            expect(utils.listFiles(tmpDir).length).toBe(1, 'files written');
            expect(file).toBe({
                contents: 'foobar',
                path: path.resolve(tmpDir + '/sub/foo.bar'),
                size: 6
            });
            done();
        });
    });

});
