(function() {
  'use strict';

  require('../../lib/geddy');

  var assert = require('assert')
    , Partial = require('../../lib/template/partial').Partial
    , tests;

  // TODO: how to actually inject template code?

  geddy.templateRegistry = {
    'app/views/foo/baz': {
      file: 'app/views/foo/baz.html.ejs'
    , ext: '.ejs'
    , baseName: 'baz'
    , baseNamePath: 'app/views/foo/baz'
    }

  , 'app/views/foo/bar': {
      file: 'app/views/foo/bar.html.ejs'
    , ext: '.ejs'
    , baseName: 'bar'
    , baseNamePath: 'app/views/foo/bar'
    }
  };

  geddy.viewHelpers.callbackHelper = function() {
    return function(cb) {
      cb(null, 'callback helper result');
    };
  };

  geddy.viewHelpers.promiseHelper = function() {
    return new Promise(function (resolve, reject) {
      resolve('promise helper result');
    });
  };

  tests = {

    'callback helper': function () {
      var p = new Partial('foo/bar', {})
        , data = p.getTemplateData();
      assert.ok(data);
    }

  , 'promise helper': function () {
      var pParent = new Partial('app/views/foo/baz', {})
      var pSub = new Partial('bar', {}, pParent)
        , data = pSub.getTemplateData();
      assert.ok(data);
    }

  };

  module.exports = tests;
}());
