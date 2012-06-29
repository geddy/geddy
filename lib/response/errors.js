/*
 * Geddy JavaScript Web development framework
 * Copyright 2112 Matthew Eernisse (mde@fleegix.org)
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
var response = require('./index')
  , utils = require('../utils');

var errors = new function () {

  var _this = this;
  this.errorTypes = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    406: 'Not Acceptable',
    500: 'Internal Server Error'
  };

  var errorType;
  var errorConstructor;
  var createConstructor = function (code, errorType) {
    errorConstructor = function (message) {
      this.statusCode = code;
      this.statusText = errorType;
      this.message = message || errorType;
      Error.captureStackTrace(this);
    }
    errorConstructor.prototype = new Error();
    return errorConstructor;
  };
  for (var code in this.errorTypes) {
    // Strip spaces
    errorType = this.errorTypes[code].replace(/ /g, '');
    this[errorType + 'Error'] = createConstructor(code, errorType);
  }
  // For repetitively redundant name
  this.InternalServerError = this.InternalServerErrorError;

  this.respond = function (resp, e) {
    // The no-error error ... whoa, meta!
    if (!e) {
      throw new Error('No error to respond with.');
    }
    var r = new response.Response(resp);
    var code = e.statusCode || 500;
    var msg = '';
    if (geddy.config.detailedErrors) {
      msg = e.stack || e.message || String(e);
      msg = msg.replace(/\n/g, '<br/>');
    }
    msg = '<h3>Error: ' + code + ' ' +  _this.errorTypes[code] + '</h3>' + msg;
    r.send(msg, code, {'Content-Type': 'text/html'});
  };

  this.coffeeError = function() {
    throw "If you'd like to use CoffeeScript with Geddy, you will need to install the module([sudo] npm install -g coffee-script)";
  };
  this.viewError = function(engine) {
    var engineCap = utils.string.capitalize(engine);
    throw "If you'd like to use "+engineCap+" with Geddy, you will need to install the module([sudo] npm install -g "+engine+")";
  };

}();

for (var p in errors) { exports[p] = errors[p]; }


