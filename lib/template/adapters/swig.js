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
    , path = require('path')
    , fs = require('fs')
    , swig = {};

  swig = function () {
    this.engine = this.engine || file.requireLocal('swig');

      this.engine.setDefaults({
        'allowErrors'  : false,
        'autoescape'   : true,
        'cache'        : false,
        'encoding'     : 'utf8',
        'filters'      : {},
        'root'         : '/',
        'tags'         : {},
        'extensions'   : {},
        'tzOffset'     : 0,
        'loader': this.engine.loaders.fs(path.resolve('app/views'))
      });

  };

  swig.prototype.compile = function (template, options) {
   
  };

  swig.prototype.render = function (data, fn) {
    var template = fs.readFileSync(path.resolve(data.template + ".html.swig"),'utf-8');
    var baseNamePath = require('crypto').createHash('sha1').update(template).digest('hex');
    var t  = this.engine.compile(template, {filename: baseNamePath});
    return t(data);
  };

  module.exports = swig;
}());
