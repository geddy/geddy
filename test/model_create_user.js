// Load the basic Geddy toolkit
require('../lib/geddy');

geddy.config = {
  i18n: {
    defaultLocale: 'en-us'
  }
};

var model = require('../lib/model')
  , assert = require('assert')
  , tests;

geddy.model = model;

var User = function () {
  this.property('login', 'string', {required: true});
  this.property('password', 'string', {required: true});
  this.property('lastName', 'string');
  this.property('firstName', 'string');

  this.validatesPresent('login');
  this.validatesFormat('login', /[a-z]+/, {message: 'Subdivisions!'});
  this.validatesLength('login', {min: 3});
  this.validatesConfirmed('password', 'confirmPassword');
};

User.prototype.someMethod = function () {
  // Do some stuff on a User instance
};

User = geddy.model.register('User', User);

var tests = new (function () {
  var _params = {
      login: 'zzz',
      password: 'asdf',
      confirmPassword: 'asdf',
      firstName: 'Neil'
    };

  this.testValid = function () {
    var user = User.create(_params);
    assert.ok(user.isValid());
  };

  this.testShortLogin = function () {
    _params.login = 'zz'; // Too short, invalid
    var user = User.create(_params);
    assert.ok(typeof user.errors.login != 'undefined');
  };

  this.testInvalidLoginWithCustomMessage = function () {
    _params.login = '2112'; // Contains numbers, invalid
    var user = User.create(_params);
    // Error message should be customized
    assert.ok(user.errors.login, 'Subdivisions!');
  };

  this.testNoLogin = function () {
    delete _params.login; // Contains numbers, invalid
    var user = User.create(_params);
    // Error message should be customized
    assert.ok(typeof user.errors.login != 'undefined');

    _params.login = 'zzz'; // Restore to something valid
  };

  this.testNoConfirmPassword = function () {
    _params.confirmPassword = 'fdsa';
    var user = User.create(_params);
    // Error message should be customized
    assert.ok(typeof user.errors.password != 'undefined');

    _params.confirmPassword = 'asdf'; // Restore to something valid
  };

})();

for (var p in tests) {
  if (typeof tests[p] == 'function') {
    console.log('Running ' + p);
    tests[p]();
  }
}


