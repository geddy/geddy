#!/usr/bin/env node

var geddy = require('../lib/geddy')
  , fs = require('fs')
  , path = require('path')
  , utils = require('utilities')
  , parseopts = require('../lib/parseopts')
  , cmd = require('../lib/cmd');

var args = process.argv.slice(2);
args = cmd.parseArgs(args);

// Jake commands -- hand off to Jake to load up env
// and run whatever command. Jake parses all the CLI
// args itself
if (args[0] == 'jake') {
  args.shift();
  var c = new cmd.JakeCmd(args);
  c.run();
}
// Generator commands -- the Cmd object will parse
// the args into commands and opts
else if (args[0] == 'gen') {
  args.shift();

  var generatorName = args[0];
  args.shift();

  // try to load the generator module
  var generatorModuleName = 'geddy-gen-' + generatorName;
  var generator;

  loadGenerator(runGenerator, installGenerator);

  function loadGenerator(cbSuccess, cbFail)
  {
    try {
      generator = require(generatorModuleName);

      if (generator) {
        cbSuccess();
        return;
      }
      else {
        cbFail();
        return;
      }

    } catch(error) {
      // generator module could not be found
      if (!generator && error.code && error.code === 'MODULE_NOT_FOUND') {
        cbFail();
        return;
      }
      // module found, but it throwed an error
      else {
        console.log(error.stack);
        process.exit();
        return;
      }
    }
  };

  function installGenerator()
  {
    // try to install the generator module
    console.warn('There is no generator with the name "' + generatorName + '" installed.');
    console.info('I will install it for you now ...');

    var cp = require('child_process');
    cp.exec('npm install ' + generatorModuleName + ' -g', function(error, stdout, stderr) {
      if (stderr && !error) {
        error = stderr;
      }

      if (error) {
        console.log(error);
        console.error('I wasn\'t able to install the generator "' + generatorName + '". Aborting ...');
        process.exit();
        return;
      }

      if (stdout) {
        console.log(stdout);
        console.success('Generator "' + generatorName + '" installed successfully.');

        // try to load it again
        loadGenerator(runGenerator, function() {
          console.error('I wasn\'t able to load the generator "' + generatorName + '". Aborting ...');
          process.exit();
        });
      }
    });
  };

  function runGenerator() {
    if (typeof generator === 'function') {
      var appPath = path.normalize(path.join(__dirname, '..'));
      generator(appPath, args);
    }
  };
}
// Run the server
else {
  (function () {
    var parser
      , optsMap
      , cmds
      , opts
      , usage
      , die;

    // Server options
    optsMap = [
      { full: 'origins'
      , abbr: 'o'
      , args: true
      , canon: 'origins'
      }
    , { full: ['hostname', 'bind']
      , abbr: 'b'
      , args: true
      , canon: 'hostname'
      }
    , { full: 'port'
      , abbr: 'p'
      , args: true
      , canon: 'port'
      }
    , { full: 'workers'
      , abbr: ['n', 'w']
      , args: true
      , canon: 'workers'
      }
    , { full: 'version'
      , abbr: ['v', 'V']
      , args: false
      , canon: 'version'
      }
    , { full: 'help'
      , abbr: 'h'
      , args: false
      , canon: 'help'
      }
    , { full: 'debug'
      , abbr: 'd'
      , args: true
      , canon: 'debug'
      }
    , { full: 'loglevel'
      , abbr: 'l'
      , args: true
      , canon: 'loglevel'
      }
    , { full: 'environment'
      , abbr: 'e'
      , args: true
      , canon: 'environment'
      }
    , { full: 'geddy-root'
      , abbr: 'g'
      , args: true
      , canon: 'geddyRoot'
      }
    , { full: 'spawned'
      , abbr: ['s', 'q', 'Q']
      , args: true
      , canon: 'spawned'
      }
    ];

    // Parse optsMap and generate options and cmd commands
    parser = new parseopts.Parser(optsMap)
    parser.parse(args);
    cmds = parser.cmds;
    opts = parser.opts;

    // Exit the process with a message
    die = function (str) {
      console.log(str);
      process.exit();
    };

    if (opts.help) {
      var usage = fs.readFileSync(path.join(__dirname, '..',
          'usage.txt')).toString();
      return die(usage);
    }

    if (opts.version) {
      return die(geddy.version);
    }

    geddy.startCluster(opts);
  })();
}

