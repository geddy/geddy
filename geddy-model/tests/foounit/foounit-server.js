var http = require('http');

var Server = function (host, port){
  this._host = host;
  this._port = port;
  this._server = null;
  this._mounts = [];
};

Server.prototype.start = function (){
  //console.log('>> starting foounit.Server');
  var self = this;

  this._server = http.createServer(function (request, response){
    //console.log('>> request');
    try {
      var mounts = self._mounts;
      for (var i = 0; i < mounts.length; ++i){
        var mount = mounts[i];
        if (request.url.match(mount.pattern)){
          //console.log('>> match: ', mount.pattern);
          mount.service.call(request, response);
          return;
        }
      }
      response.writeHead(404, {});
      response.end();
      //console.log('>> no service match');
    } catch (e){
      console.log('>> error foounit.Server: ', e);
    }
  });

  this._server.listen(this._port, this._host);
};

Server.prototype.stop = function (){
  //console.log('>> stopping foounit.Server');
  this._server.close();
};

Server.prototype.mount = function (pattern, service){
  this._mounts.push({ pattern: pattern, service: service });
};

module.exports.Server = Server;
