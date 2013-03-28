
var nails = global.nails || {}
  , utils = require('utilities')
  , pkg = require('../package');

// Set the One True Nails Global
global.nails = nails;

utils.mixin(nails, {version: pkg.version});

utils.mixin(nails, utils);

utils.mixin(nails, new (function () {
  var _started = false;

  this.start = function (options) {
    var opts = options || {}
      , App
      , app
      , config = require('./config')
      , c = config.readConfig(opts);

    nails.config = c;

    App = require('./app.js').App;

    worker = require('../lib/cluster/worker');
    w = new worker.Worker();
    nails.worker = w;

    w.init({clustered: false, logger: c.logger || utils.log}, function () {
      utils.mixin(nails, w);

      app = new App();
      app.init(function () {
        w.startServer();
        utils.mixin(nails, app);
      });
    });
    w.configure(c);
  };

  this.startCluster = function (options) {
    var opts = options || {}
      , cluster = require('cluster')
      , master
      , worker
      , m
      , w
      , App
      , app;

    // No repeatsies
    if (_started) {
      return;
    }

    nails.isMaster = cluster.isMaster;

    // Master-process, start workers
    if (nails.isMaster) {
      master = require('../lib/cluster/master');
      m = new master.Master();
      m.start(opts);
    }
    // Worker-process, start up an app
    else {
      App = require('./app.js').App;

      worker = require('../lib/cluster/worker');
      w = new worker.Worker();
      nails.worker = w;

      w.init({clustered: true}, function () {
        utils.mixin(nails, w);

        app = new App();
        app.init(function () {
          w.startServer();
          utils.mixin(nails, app);
        });
      });
    }
  };

})());

// Also allow export/local
module.exports = nails;

