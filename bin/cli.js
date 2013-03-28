#!/usr/bin/env node

// Dependencies
var nails = require('../lib/nails')
  , path = require('path')
  , utils = require('utilities')
  , parseopts = require('../lib/parseopts');

// Variables
var cwd = process.cwd()
  , args = process.argv.slice(2)
  , parser
  , optsMap
  , cmds
  , opts
  , usage
  , cmd
  , engineCmd
  , rtCmd
  , modelCmd
  , filepath
  , die
  , jake
  , jakeArgs
  , jakeProgram
  , jakeLoader
  , start;

// Usage dialog
usage = [
    'Nails web framework for Node.js'
  , ''
  , 'Usage:'
  , '  nails [options/commands] [arguments]'
  , ''
  , 'Options:'
  , '  --environment, -e   Environment to use'
  , '  --hostname, -b      Host name or IP to bind the server to (default: localhost)'
  , '  --port, -p          Port to bind the server to (default: 4000)'
  , '  --workers, -w       Number of worker processes to start (default: 1)'
  , '  --debug, -d         Sets the log level to output debug messages to'
  , '                        the console'
  , '  --realtime, -rt     When generating or scaffolding, take realtime into account'
  , '  --jade, -j          When generating views this will create Jade'
  , '                        templates(Default: EJS)'
  , '  --handle, -H        When generating views this will create Handlebars'
  , '                        templates(Default: EJS)'
  , '  --mustache, -m      When generating views this will create Mustache'
  , '                        templates(Default: EJS)'
  , '  --help, -h          Output this usage dialog'
  , '  --version, -v       Output the version of Nails that\'s installed'
  , ''
  , 'Commands:'
  , '  console                     Start up the Nails REPL'
  , '  app <name>                  Create a new Nails application'
  , '  resource <name> [attrs]     Create a new resource. A resource includes'
  , '                                a model, controller and route'
  , '  scaffold <name> [attrs]     Create a new scaffolding. Scaffolding includes'
  , '                                the views, a model, controller and route'
  , '  secret                      Generate a new application secret in'
  , '                                `config/secret`'
  , '  controller <name>           Generate a new controller including an index view'
  , '                                and and a route'
  , '  model <name> [attrs]        Generate a new model'
  , '  routes [query]              Shows routes for a given resource route or all '
  , '                                routes if empty'
  , '  auth[:update]               Creates user authentication for you, using Passport.'
  , ''
  , 'Examples:'
  , '  nails                    Start Nails on localhost:4000 in development mode'
  , '                             or if the directory isn\'t a Nails app it\'ll'
  , '                             display a prompt to use "nails -h"'
  , '  nails -p 3000            Start Nails on port 3000'
  , '  nails -e production      Start Nails in production mode'
  , '  nails -j scaffold user   Generate a users scaffolding using Jade templates'
  , '  nails resource user name admin:boolean'
  , '                           Generate a users resource with the model properties'
  , '                             name as a string and admin as a boolean'
  , '  nails scaffold user name:string:default'
  , '                           Generate a users scaffolding user name as the default'
  , '                             value to display data with'
  , '  nails routes user        Show all routes for the user resource'
  , '  nails routes user.index  Show the index route for the user resource'
  , ''
].join('\n');

// Options available
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
, { full: 'nails-root'
  , abbr: 'g'
  , args: true
  , canon: 'nailsRoot'
  }
, { full: 'spawned'
  , abbr: ['s', 'q', 'Q']
  , args: true
  , canon: 'spawned'
  }
, { full: 'jade'
  , abbr: 'j'
  , args: false
  , canon: 'jade'
  }
, { full: ['handle', 'handlebars']
  , abbr: 'H'
  , args: false
  , canon: 'handlebars'
  }
, { full: 'mustache'
  , abbr: 'm'
  , args: false
  , canon: 'mustache'
  }
, { full: 'realtime'
  , abbr: 'rt'
  , args: false
  , canon: 'realtime'
  }
];

// Parse optsMap and generate options and cmd commands
parser = new parseopts.Parser(optsMap);
parser.parse(args);
cmds = parser.cmds;
opts = parser.opts;

// Set handlebars option to handle option
opts.handle = opts.handlebars || opts.handle;

// Exit the process with a message
die = function (str) {
  console.log(str);
  process.exit();
};

// Start Nails with options
start = function () {
  nails.startCluster(opts);
};

if (opts.help) {
  die(usage);
}
if (opts.version) {
  die(nails.version);
}

// `nails app foo` or `nails resource bar` etc. -- run generators
if (cmds.length) {
  // Get templates Jake file
  filepath = path.normalize(path.join(__dirname, '..', 'templates', 'Jakefile'));

  cmd = '';

  // Some commands take only one arg
  if (!(cmds[0] == 'jake' ||
      cmds[0] == 'secret' ||
      cmds[0] == 'db:init' ||
      cmds[0] == 'auth' ||
      cmds[0] == 'auth:update' ||
      cmds[0] == 'console' ||
      cmds[0] == 'routes')
      && !cmds[1]) {
    throw new Error(cmds[0] + ' command requires another argument.');
  }

  // Add engines to command
  if (opts.jade) {
    engineCmd = ',' + 'jade';
  } else if (opts.handle) {
    engineCmd = ',' + 'handlebars';
  } else if (opts.mustache) {
    engineCmd = ',' + 'mustache';
  } else engineCmd = ',default';

  if (opts.realtime) {
    rtCmd = ',' + 'realtime';
  }
  else {
    rtCmd = ',default';
  }

  // Get the model properties
  if (cmds.slice(2).length > 0) {
    modelCmd = ',' + cmds.slice(2).join('%');
  } else modelCmd = '';

  // Add Jake argument based on commands
  switch (cmds[0]) {
    case 'jake':
      cmd = 'jake';
      jakeArgs = cmds.slice(1);
      break;
    case 'console':
      // Start console
      cmd += 'console:start[' + (cmds[1] || 'development') + ']';
      break;
    case 'auth':
      // Create authentication
      cmd += 'auth:init[' + engineCmd.substr(1) + ']';
      break;
    case 'auth:update':
      // Update authentication
      cmd += 'auth:update';
      break;
    case 'db:init':
      // Create DBs
      cmd += 'db:init';
      break;
    case 'db:createTable':
      // Create DBs
      cmd += 'db:createTable[' + cmds[1].replace(/,/g, '%') + ']';
      break;
    case 'app':
      // Generating application
      cmd += 'gen:app[' + cmds[1] + engineCmd + rtCmd + ']';
      break;
    case 'resource':
      // Generating resource
      cmd += 'gen:resource[' + cmds[1] + modelCmd + ']';
      break;
    case 'scaffold':
      // Generating application
      cmd += 'gen:scaffold[' + cmds[1] + rtCmd + engineCmd + modelCmd + ']';
      break;
    case 'controller':
      // Generating controller
      cmd += 'gen:bareController[' + cmds[1] + engineCmd + ']';
      break;
    case 'model':
      // Generating model
      cmd += 'gen:model[' + cmds[1] + modelCmd + ']';
      break;
    case 'secret':
      // Generating new app secret
      cmd += 'gen:secret';
      break;
    case 'routes':
      // Show routes(Optionally empty)
      cmd += 'routes:show[' + (cmds[1] || '') + ']';
      break;
    default:
      die(cmds[0] + ' is not a Nails command.');
  }

  jake = require('jake');
  jakeProgram = jake.program;
  jakeLoader = jake.loader;
  // Load Nails's bundled Jakefile
  jakeLoader.loadFile(filepath);
  if (cmd == 'jake') {
    jakeProgram.parseArgs(jakeArgs);
    // Load Jakefile and jakelibdir files for app
    jakeLoader.loadFile(jakeProgram.opts.jakefile);
    jakeLoader.loadDirectory(jakeProgram.opts.jakelibdir);
    // Prepend env:init to load Nails env
    jakeProgram.taskNames.unshift('env:init');
    jakeProgram.init();
  }
  else {
    jakeProgram.init({
      quiet: !opts.debug
    , trace: true
    });
    jakeProgram.setTaskNames([cmd]);
  }
  jakeProgram.run();
}
// Just `nails` -- start the server
else {
  start();
}
