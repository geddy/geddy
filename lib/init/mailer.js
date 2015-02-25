var utils = require('utilities');

module.exports = new (function () {
  this.init = function (app, callback) {
    var cfg = app.config.mailer
      , mailer
      , msg
      , transport;
    if (cfg) {
      msg = 'Geddy mailer support requires Nodemailer. Try `npm install nodemailer`.';
      mailer = utils.file.requireLocal('nodemailer', msg);
      transport = cfg.transport;
      if(cfg.require) {
        msg = 'You have configured a 3rd party nodemailer transport. Try `npm install ' + cfg.require + '`.';
        plugin = utils.file.requireLocal(cfg.require, msg);
        app.mailer = mailer.createTransport(plugin(transport.options));
      } else {
        app.mailer = mailer.createTransport(transport.type, transport.options);
      }
    }
    callback();
  };

})();



