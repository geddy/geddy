(function() {
  'use strict';

  var assert = require('assert')
    , errors = require('../../lib/response/errors');

  module.exports = {
    'Error object is properly created': function () {
      var err = new errors.ForbiddenError('Cross-site request not allowed.');

      assert.equal(err.statusCode, 403);
      assert.equal(err.statusText, 'Forbidden');
      assert.equal(err.message, 'Cross-site request not allowed.');
    }
  };
}());
