var fsh = (function (module){var fs = require('fs')
  , exec = require('child_process').exec;

var fsh = module.exports;
fsh.separator = '/';
fsh.debug = false;

fsh.mkdirpSync = function (path, mode){
  var parts = path.split(this.separator);
  for (var i = 0, ii = parts.length; i < ii; ++i){
    var newpath = parts[i] + this.separator;
    if (!fsh.existsSync(newpath)){
      fs.mkdirSync(newpath, mode);
    }
  }
  return true;
}

fsh.existsSync = function (path){
  var stat;
  try {
    stat = fs.statSync(path);
  } catch (e){
    if (e.type == 'ENOENT'){
      return false;
    }
  }
  return stat;
}

fsh.isDirectorySync = function (path){
  return _isStatSync(path, 'isDirectory');
}

fsh.isSymbolicLinkSync = function (path){
  return _isStatSync(path, 'isSymbolicLink');
}

var _isStatSync = function (path, func){
  try {
    var stat = fs.lstatSync(path);
    return stat[func]();
  } catch (e) {}
  return false;
}


// FIXME: This fails silently... BAAAAAAAAAAAAAAD
fsh.copyFileSync = function (source, dest){
  var cmd = 'cp ' + source + ' ' + dest;
  exec(cmd);
}


// TODO: Add option for following symlinks
fsh.findSync = function (basedir, pattern, options){
  var matches = []
    , defaults = { includeDirs: false };

  var _mixin = function (target, source){
    for (var p in source){
      if (source.hasOwnProperty(p)){
        target[p] = source[p];
      }
    }
    return target;
  }

  var _find = function (dir, options){
    var files = fs.readdirSync(dir);
    for (var i = 0, ii = files.length; i < ii; ++i){
      var file = files[i]
        , fullPath = fsh.join(dir, file);

      if (!fsh.isSymbolicLinkSync(fullPath) && fsh.isDirectorySync(fullPath)){
        if (options.includeDirs){
          matches.push(fullPath);
        }
        _find(fullPath, options);
      } else if (file.match(pattern)){
        matches.push(fullPath);
      }
    }
  }

  options = _mixin(defaults, options || {});
  _find(basedir, options);
  return matches;
}

fsh.join = function (){
  var parts = Array.prototype.slice.apply(arguments);
  return parts.join(this.separator);
}

 return module.exports; })({ exports: {} });

var assertPatch = (function (module){// https://github.com/ry/node/blob/23cf938e4f7272635a50f8be9a5d99d40d60e0da/lib/assert.js

// These patches are "cherry-picked" from node's master (2/3/2011)
// and fix bugs in node's assert.throws and assert.doesNotThrow in node version 0.2.6

// Hack in our patches to node's assert.  This works because
// node apparently doesn't reload a file once it has been
// loaded, so require('assert') in the matchers.js file will include
// our patched methods.
var assert = require('assert');
var pSlice = Array.prototype.slice;

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}


function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (expected instanceof RegExp) {
    return expected.test(actual);
  } else if (actual instanceof expected) {
    return true;
  } else if ( expected.call({}, actual) === true ) {
    return true;
  }

  return false;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  try {
    block();
  } catch (e) {
    actual = e;
  }

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
    (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail('Missing expected exception' + message);
  }

  if (!shouldThrow && expectedException(actual, expected)) {
    fail('Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
        !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [true].concat(pSlice.call(arguments)));
};

assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [false].concat(pSlice.call(arguments)));
};

 return module.exports; })({ exports: {} });

var colors = (function (){
  var sys = require('sys');

  var self = this;

  self.putsRed = function (str){
    sys.puts('\33[31m' + str + '\33[39m');
  }

  self.printYellow = function (str){
    sys.print('\33[33m' + str + '\33[39m');
  }

  self.putsYellow = function (str){
    sys.puts('\33[33m' + str + '\33[39m');
  }

  self.printGreen = function (str){
    sys.print('\33[32m' + str + '\33[39m');
  }

  self.putsGreen = function (str){
    sys.puts('\33[32m' + str + '\33[39m');
  }

  self.highlightSpecs = function (stack){
    var lines = stack.split("\n");
    for (var i = 0, ii = lines.length; i < ii; ++i){
      var line = lines[i];
      if (line.match(/_spec\.js/)){
        printYellow(line + "\n");
      } else {
        sys.puts(line);
      }
    }
  }

  return self;
})();
var foounit = require('./foounit');

// This is a little weird, but fsh will get baked into
// the foounit-node build.
//, fsh = require('../build/fsh');
if (typeof fsh === 'undefined'){
  throw new Error('Looks like there was a problem ' +
    'building foounit-node. ' +
    'fsh should have been baked in.');
}



var adapter = (function (){
  var sys = require('sys')
    , fs  = require('fs')
    , runInThisContext = process.binding('evals').Script.runInThisContext;

  // Private variables
  var self = {},  _specdir, _codedir;

  // Private functions
  var _translate = function(str, tvars){
    return str.replace(/:(\w+)/g, function(match, ref){
        return tvars[ref];
      });
  };

  /**
   * Override foounit.require
   */
  self.require = function (path){
    path = foounit.translatePath(path);
    return require(path);
  }

  /**
   * Override foouint.load
   */
  self.load = function (path){
    path = foounit.translatePath(path) + '.js';
    var code = fs.readFileSync(path);
    runInThisContext(code, path, true); 
  }

  /**
   * Default runner
   */
  self.run = function (specdir, codedir, pattern) {
    _specdir = specdir;
    _codedir = codedir;

    var specs = fsh.findSync(_specdir, pattern);
    for (var i = 0, ii = specs.length; i < ii; ++i){
      var specFile = specs[i].replace(/\.js$/, '');
      console.log('running spec: ', specFile);
      var spec = require(specFile);
    }
    foounit.execute(foounit.build());
  }

  /*
   * Reporting
   */
  self.reportExample = function (example){
    if (example.isFailure()){
      colors.putsRed('F');
      colors.putsRed(example.getFullDescription());
      sys.puts(new Array(example.getFullDescription().length+1).join('='));
      highlightSpecs(example.getException().stack);
    } else if (example.isSuccess()){
      colors.printGreen('.');
    } else if (example.isPending()){
      colors.printYellow('P');
    }
  }

  self.report = function (info){
    if (info.pending.length){
      var pending = info.pending;
      console.log("\n");
      for (var i = 0, ii = pending.length; i < ii; ++i){
        colors.putsYellow('PENDING: ' + pending[i]);
      }
    }

    if (info.failCount){
      colors.putsRed("\n" + info.failCount + ' test(s) FAILED');
    } else {
      colors.putsGreen("\nAll tests passed.");
    }

    var endMessage = info.totalCount + ' total.';
    if (info.pending.length){
      endMessage += ' ' + info.pending.length + ' pending.';
    }
    endMessage += ' runtime ' + info.runMillis + 'ms';
    console.log(endMessage);
  }

  return self;
})();

foounit.mixin(foounit, adapter);
module.exports = foounit;

// TODO: Launch if file was not required
// TODO: Parse params from cmd-line
//run('../', /_spec\.js$/, '../../dist');

