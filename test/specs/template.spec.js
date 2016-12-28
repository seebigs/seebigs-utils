
var utils = require('../../index.js');

describe("template", function () {

    var templateData = {
        foo: {
            bar: 'BLAM'
        }
    };

    describe("replaces line breaks", function (expect) {
        expect(utils.template("foo\n\r\t      bar", templateData)).toBe("foo bar");
    });

    describe("escapes unescaped single quotes", function (expect) {
        expect(utils.template("fooo's bar not faaa\\'s bar", templateData)).toBe("fooo's bar not faaa's bar");
    });

    describe("replaces macros with data", function (expect) {
        expect(utils.template("x-{{foo.bar}}-x", templateData)).toBe("x-BLAM-x");
    });

});
