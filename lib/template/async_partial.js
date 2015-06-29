(function() {
  'use strict';

  var isPromise = require('is-promise');

  function AsyncPartial(handler, opts, parent) {
    this.render = function(cb) {
      var self = this;

      if (typeof handler === 'function') {
        handler(function (err, result) {
          if (err) {
            onError(err);
            cb('');
            return;
          }

          cb(result);
        });
      } else if (isPromise(handler)) {
        handler
          .then(function (result) {
            cb(result);
          })
          .catch(function (err) {
            onError(err);
            cb('');
          });
      }

      function onError(err) {
        throw err;
      }
    }
  }

  exports.AsyncPartial = AsyncPartial;

}());
