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

    function cleanDir (path, onError) {
        try {
            del.sync(path);

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

    function getPropertyIfPresent (object, path, rest) {
        if (!object) { return void 0; }

        if (path.indexOf('.') !== -1) {
            path = path.split('.');
            return getPropertyIfPresent(object, path.shift(), path);

        } else {
            if(!rest || rest.length === 0) {
                return object[path];
            } else {
                if(!object.hasOwnProperty(path) || !exists(object[path])) {
                    return void 0;
                }
                return getPropertyIfPresent(object[path], rest.shift(), rest);
            }
        }
    }

    function listFiles (dir, ext, _list) {
        ext = ext || [];
        _list = _list || [];

        var dirs = [];
        var files = [];

        each(fs.readdirSync(dir), function (item) {
            var path = dir + '/' + item;
            if (fs.statSync(path).isDirectory()) {
                dirs.push(path);
            } else {
                files.push(path);
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
                // write dest file
                fs.writeFile(dest, contents, function (err) {
                    if (err) {
                        onError(err);
                    } else {
                        onSuccess(contents);
                    }
                });
            }
        });
    }

    return {
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
