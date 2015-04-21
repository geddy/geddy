/*
 * Geddy JavaScript Web development framework
 * Copyright 2012 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/

/*
Config section should look like this:

, sessions: {
    store: 'level'
  , key: 'sid'
  , expiry: 14 * 24 * 60 * 60

'key' is the level database name.
*/
var utils = require('utilities')
  , fs = require('fs')
  , path = require('path')
  , file = utils.file
  , level, multilevel, net;

// DB lib should be locally installed in the consuming app
try {
  // First try the Level convenience lib
  level = file.requireLocal('level');
} catch(e) {}

try {
  // Next, try LevelUp
  level = file.requireLocal('levelup');
} catch(e) {}

try {
  // Finally, multilevel
  multilevel = file.requireLocal('multilevel');
  net = require('net');
} catch(e) {}

if (!level && !multilevel) {
  throw new Error('Level sessions require the "level" or "levelup" and the "multilevel" modules to be installed locally.\nPlease install them using "npm install level multilevel --save".');
}

var Level = function (callback) {
  this.setup(callback);
};

Level.prototype = new (function () {
  var _sessions = {};

  var self = this;

  var _db;

  this.setup = function (callback) {
    var con;
    var sessionsPath = path.join(process.cwd(), 'sessions');
    var isMaster = geddy.config.workerNumber === 1;

    // first worker creates level db, while other workers connect to it
    if (geddy.config.sessions.createServer && isMaster) {
      // create level db
      if (!fs.existsSync(sessionsPath)) {
        file.mkdirP(sessionsPath);
        fs.writeFileSync(path.join(sessionsPath, '.gitignore'), '*', 'utf8');
      }
      _db = level(path.join(sessionsPath, geddy.config.sessions.key), {encoding: 'json'});

      // create multilevel server
      net.createServer(function (con) {
        con.pipe(multilevel.server(_db)).pipe(con);
      }).listen(geddy.config.sessions.port, function () {
        geddy.log.info('Sessions DB server listening on port ' + geddy.config.sessions.port);
        // inform all clients that server is ready
        geddy.worker.sendMessage({
          workerId: process.pid,
          method: 'broadcast',
          action: 'sessionsServerReady'
        });
      });
    }
    // there is already a session db running, connect to it
    else {
      // we have to wait for the first worker to spin up the session server
      if (geddy.config.sessions.createServer) {
        process.addListener('message', function (data) {
          if (data && data.method === 'broadcast' && data.action === 'sessionsServerReady') {
            connect();
          }
        });
      // an external session server is running, connect to it.
      } else {
        connect();
      }
    }

    // first worker needs to cleanup sessions regulary
    if (isMaster) {
      // schedule session cleanup
      if (geddy.config.sessions.expiry) {
        setInterval(function() {
          self._cleanup(geddy.config.sessions.expiry * 1000);
        }, geddy.config.sessions.cleanupInterval || 1000 * 60);
      }
    }

    var reconnectTimeout;

    function connect() {
      geddy.log.info('Sessions DB client connecting on port ' + geddy.config.sessions.port);
      _db = multilevel.client();
      var con = net.connect({
        port: geddy.config.sessions.port,
        host: geddy.config.sessions.host || 'localhost'
      });
      con.pipe(_db.createRpcStream()).pipe(con);

      // reconnect on close
      con.on('connect', function () {
        con.on('close', function () {
          geddy.log.error('Connection to Session DB Server lost');
          reconnect();
        });
      });

      // try reconnect on error
      con.on('error', function () {
        geddy.log.error('Error connecting to Session DB Server on port ' + geddy.config.sessions.port);
        reconnect();
      });
    }

    function reconnect() {
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }

      geddy.log.info('Session DB client trying to reconnect in 5 seconds');
      reconnectTimeout = setTimeout(connect, 5000);
    }

    callback();
  };

  this.read = function (session, callback) {
    var self = this
      , id = session.id;
    _db.get(id, function (err, result) {
      var data;
	    if (err) {
        geddy.log.error(err);
      }
      data = result || {};
      data = data.sessionData || {};
      callback(data);
    });
  };

  this.write = function (session, callback) {
    var id = session.id
    // Create top-level obj so you can actually unset values
    // by blowing away the entire session-data
      , data = {sessionData: session.data};

    // add timestamp if this is a new session
    if (!data.timestamp) {
      data.timestamp = (new Date()).getTime();
    }

    _db.put(id, data, function (err) {
      if (err) {
        geddy.log.error(err);
      }

      callback();
    });
  };

  this.destroy = function(session, callback) {
    var id = session.id;

    _db.del(id, callback);
  };

  this._cleanup = function(lifetime) {
    var self = this;

    if (geddy.config.debug) {
      geddy.log.info('session cleanup ...');
    }
    var now = (new Date()).getTime();
    var maxTime = now - lifetime;

    var stream = _db.createReadStream({reverse: true, limit: 1000});
    stream.on('data', function(data) {
      // remove sessions older then the allowed lifetime
      if (data && data.value && data.value.timestamp < maxTime) {
        if (geddy.config.debug) {
          geddy.log.info('cleaning session ' + data.key);
        }
        data.value.id = data.key;
        self.destroy(data.value);
      }
      // once we find a session with a timestamp within the lifetime we can stop
      else {
        stream.destroy();
      }
    });
  };
})();

exports.Level = Level;
