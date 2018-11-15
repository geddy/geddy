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

(function() {
  'use strict';

  var file = require('utilities').file
    , pug = {};

  pug = function () {
    this.engine = this.engine || file.requireLocal('pug');
  };

  pug.prototype.compile = function (template, options) {
    return this.engine.compile(template, options);
  };

  pug.prototype.render = function (data, fn) {
    return fn(data);
  };

  module.exports = pug;
}());
