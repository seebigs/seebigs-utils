
var utils = require('../../index.js');

describe('args', function() {

    describe('finds all passed options', function (expect) {

        process.argv.push('addtl');
        process.argv.push('-a');
        process.argv.push('--foo');
        process.argv.push('--bar=123');

        process.env.npm_config_argv = '{"original":["ignored","test","-more","--better=stuff"]}';

        expect(utils.args()).toBe({
            _: [ 'addtl', 'test' ],
            a: true,
            foo: true,
            bar: '123',
            more: true,
            better: 'stuff'
        });
    });

});
