/**
 * My Standard Utils
 *  for use in Node.js
 */

var del = require('del');
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');

module.exports = (function () {

    var hasProp = Object.prototype.hasOwnProperty;

    function args () {
        var a = { _: [] };
        var rawArgs = process.argv.slice(2);
        var npmConfigArgv = process.env.npm_config_argv;
        if (npmConfigArgv) {
            var npmArgs = JSON.parse(npmConfigArgv).original;
            npmArgs.shift(); // first arg is always the command to be run, not an arg
            rawArgs = rawArgs.concat(npmArgs);
        }

        rawArgs.forEach(function (raw) {
            var pair = raw.split('=');
            var argName;
            if (pair[0].charAt(0) === '-') {
                argName = pair[0].split('-').pop();
                a[argName] = pair[1] || true;

            } else {
                a._.push(pair[0]);
            }
        });

        return a;
    }

    function cleanDir (pathname, onError) {
        try {
            del.sync(pathname);

        } catch (err) {
            typeof onError === 'function' ? onError(err) : console.log(err);
        }
    }

    function debug (obj, label) {
        var pre = label || '';
        console.log('\n' + pre + '\n' + JSON.stringify(obj, null, 4) + '\n\n');
    }

    function each (collection, iteratee, thisArg) {
        if (collection) {
            if (typeof collection.length !== 'undefined') {
                for (var i = 0, len = collection.length; i < len; i++) {
                    if (iteratee.call(thisArg, collection[i], i, collection) === false) {
                        return;
                    }
                }

            } else {
                for (var prop in collection) {
                    if (hasProp.call(collection, prop)) {
                        if (iteratee.call(thisArg, collection[prop], prop, collection) === false) {
                            return;
                        }
                    }
                }
            }
        }
    }

    function exists (thing) {
        return typeof thing !== 'undefined' && thing !== '' && thing !== null;
    }

    function getPropertyIfPresent (object, pathname, rest) {
        if (!object) { return void 0; }

        if (pathname.indexOf('.') !== -1) {
            pathname = pathname.split('.');
            return getPropertyIfPresent(object, pathname.shift(), pathname);

        } else {
            if(!rest || rest.length === 0) {
                return object[pathname];
            } else {
                if(!object.hasOwnProperty(pathname) || !exists(object[pathname])) {
                    return void 0;
                }
                return getPropertyIfPresent(object[pathname], rest.shift(), rest);
            }
        }
    }

    function listFiles (dir, ext, _list) {
        dir = path.resolve(dir);
        ext = ext || [];
        _list = _list || [];

        var dirs = [];
        var files = [];

        each(fs.readdirSync(dir), function (item) {
            var pathname = dir + '/' + item;
            if (fs.statSync(pathname).isDirectory()) {
                dirs.push(pathname);
            } else {
                files.push(pathname);
            }
        });

        each(dirs, function (d) {
            listFiles(d, ext, _list);
        });

        each(files, function (f) {
            if (!ext.length || ext.indexOf(f.split('.').pop()) !== -1) {
                _list.push(f);
            }
        });

        return _list;
    }

    function pathExists (filepath) {
        try {
            fs.statSync(filepath).isDirectory();
            return true;

        } catch (e) {
            if (e.code !== 'ENOENT') {
                throw e;
            }
            return false;
        }
    }

    function readFile (filepath, onError) {
        try {
            return fs.readFileSync(filepath, 'utf8');

        } catch (err) {
            typeof onError === 'function' ? onError(err) : console.log(err);
            return '';
        }
    }

    // stripped down from John Resig's micro templating: http://ejohn.org/blog/javascript-micro-templating/
    function template (str, data) {
        // escape single quotes (that aren't already escaped)
        str = str.replace(/([^\\])\'/g, "$1\\'");
        // replace consecutive spaces and line breaks
        str = str.replace(/[\s\t\r\n\f]+/g, ' ');
        // replace macros with data values
        str = str.replace(/\{\{(.*?)\}\}/g, "',$1,'");

        // Introduce the data as local variables using with(obj){}
        var templateFn = new Function("obj", "var p=[];with(obj){p.push('" + str + "');}return p.join('');");

        return data ? templateFn(data) : templateFn;
    }

    function writeFile (dest, contents, onSuccess, onError) {
        dest = path.resolve(dest);

        if (typeof onSuccess !== 'function') {
            onSuccess = function () {};
        }

        if (typeof onError !== 'function') {
            onError = function (e) { console.log(e); };
        }

        mkdirp(path.dirname(dest), function (err) {
            if (err) {
                onError(err);
            } else {
                fs.writeFile(dest, contents, function (err) {
                    if (err) {
                        onError(err);
                    } else {
                        fs.stat(dest, function (err, stats) {
                            onSuccess({
                                contents: contents,
                                path: dest,
                                size: stats.size
                            });
                        });
                    }
                });
            }
        });
    }

    return {
        args: args,
        cleanDir: cleanDir,
        debug: debug,
        each: each,
        getPropertyIfPresent: getPropertyIfPresent,
        listFiles: listFiles,
        pathExists: pathExists,
        readFile: readFile,
        template: template,
        writeFile: writeFile
    };

})();
