
var utils = require('../../index.js');

describe('args', function() {

    describe('finds all passed options', function (expect) {

        process.argv.push('addtl');
        process.argv.push('-a');
        process.argv.push('--foo');
        process.argv.push('--bar=123');
        process.argv.push('--dashed-too=yup');

        expect(utils.args()).toBe({
            _: [ 'addtl' ],
            a: true,
            foo: true,
            bar: '123',
            'dashed-too': 'yup'
        });
    });

});
