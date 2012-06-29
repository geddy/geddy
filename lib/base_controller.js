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
var fs = require('fs')
  , crypto = require('crypto')
  , response = require('./response')
  , Templater = require('./template').Templater;

/**
  @name controller
  @namespace controller
*/
var controller = {};

/**
  @name controller.BaseController
  @constructor
*/
controller.BaseController = function () {
  /**
    @name controller.BaseController#request
    @public
    @type http.ServerRequest
    @description The raw http.ServerRequest object for this request/response
    cycle.
   */
  this.request = null;
  /**
    @name controller.BaseController#response
    @public
    @type http.ServerResponse
    @description The raw http.ServerResponse object for this request/response
    cycle.
   */
  this.response = null;
  /**
    @name controller.BaseController#params
    @public
    @type Object
    @description The parsed params for the request. Also passed as an arg
    to the action, added as an instance field for convenience.
   */
  this.params = null;
  /**
    @name controller.BaseController#cookies
    @public
    @type Object
    @description Cookies collection for the request
   */
  this.cookies = null;
  /**
    @name controller.BaseController#name
    @public
    @type String
    @description The name of the controller constructor function,
    in CamelCase with uppercase initial letter.
   */
  this.name = null;
  /**
    @name controller.BaseController#respondsWith
    @public
    @type Array
    @description Content-type the controller can respond with.
    @default ['txt']
   */
  this.respondsWith = ['txt'];
  /**
    @name controller.BaseController#content
    @public
    @type {Object|String}
    @description Content to use for the response.
   */
  this.content = '';
  /**
    @name controller.BaseController#format
    @public
    @type {String}
    @description Determined by what format the client requests, and if the
    controller/action supports it. Built-in formats can be found in the enum
    controller.formats
   */
  this.completed = false;
  // The template root to look in for partials when rendering templates
  // Gets created programmatically based on controller name -- see renderTemplate
  this.template = null;
  // The template layout directory to look in when rendering templates
  // Gets created programmatically based on controller name -- see renderTemplate
  this.layout = null;
  // Time accessed
  this.accessTime = null;
  // Anti-CSRF token for PUT/POST/DELETE
  this.sameOriginToken = null;
  // The list of filters to perform before running the action
  this._beforeFilters = [];
  // The list of filters to perform before finishing the response
  this._afterFilters = [];
};

controller.BaseController.prototype = new (function () {
  var _addFilter
    , _execFilters
    , _negotiateContent
    , _doResponse
    , _throwUndefinedFormatError
    , _generateSameOriginToken
    , _protectFromForgery;

  /*
   *
   * Private utility methods
   *
  */
  _addFilter = function(phase, filter, opts) {
    var obj = {def: filter};

    obj.except = opts.except;
    obj.only = opts.only;
    obj.async = opts.async;

    this['_' + phase + 'Filters'].push(obj);
  };

  _execFilters = function(action, phase, callback) {
    var self = this
      , filters = this['_' + phase + 'Filters']
      , list = []
      , applyFilter = true // Default
      , filter
      , func;

    if(!filters) {
      callback();
      return; // Not sure if we need this since we're calling a function above
    }

    for(var i = 0, len = filters.length; i < len; i++) {
      filter = filters[i];

      if(filter.only && (filter.only != action || filter.only.indexOf(action) == -1)) {
        applyFilter = false;
      }
      if(filter.except && (filter.except == action || filter.except.indexOf(action) > -1)) {
        applyFilter = false;
      }

      if(applyFilter) {
        // TODO: Wrap filters to prevent further execution when
        // a req/resp cycle is already completed (e.g., with a
        // redirect

        // Create an async wrapper for sync filters
        if(!filter.async) {
          func = function(callback) {
            filter.def.apply(self, []);
            callback();
          };
        } else func = filter.def;

        list.push({
            func: func
          , args: []
          , callback: null
          , context: self
        });
      }
    }
    var chain = new geddy.async.AsyncChain(list);

    chain.last = callback;
    chain.run();
  };

  _negotiateContent = function(frmt) {
    var format
      , contentType
      , types = []
      , params = this.params
      , accepts = this.request.headers.accept
      , wildcard = false
      , match
      , err
      , accept
      , pat;

    // If client provides an Accept header, split on comma
    // - some user-agents include whitespace with the comma
    if(accepts) {
      accepts = accepts.split(/\s*,\s*/);
    }
    // If no Accept header is found, assume it's happy with anything
    else accepts = ['*/*'];

    if(frmt) {
      types = [frmt];
    }
    else if(params.format) {
      var f = params.format;
      // TODO test var with formats

      // If we can respond with the requested format then assign it to types
      if(('|' + this.respondsWith.join('|') + '|').indexOf('|' + f + '|') > -1) {
        types = [f];
      }
    }
    else types = this.respondsWith;

    // See if any format types match
    if(types.length) {
      for(var i = 0, len = accepts.length; i < len; i++) {
        accept = accepts[i].split(';')[0]; // Ignore quality factors

        if(accept == '*/*') {
          wildcard = true;
          break;
        }
      }

      // If agent accepts anything, respond with controller's first choice
      if(wildcard) {
        var t = types[0];

        format = t;
        contentType = response.getContentTypeForFormat(t);

        // Controllers should at least one format with a valid contentType
        if(!contentType) {
          _throwUndefinedFormatError.call(this);
          return;
        }
      }
      // Otherwise look through acceptable formats and see if Geddy knows about them
      else {
        for(var i = 0, len = types.length; i< len; i++) {
          match = response.matchAcceptHeaderContentType(accepts, types[i]);

          if(match) {
            format = types[i];
            contentType = match;
            break;
          } else {
            // Geddy doesn't know about this format
            _throwUndefinedFormatError.call(this);
            return;
          }
        }
      }
    } else {
      _throwUndefinedFormatError.call(this);
      return;
    }

    return { format: format, contentType: contentType };
  };

  _doResponse = function(stat, headers, content) {
    // Only allow response once
    if(this.completed) return;

    this.completed = true;

    var self = this
      , r = new response.Response(this.response)
      , action = this.action
      , callback;

    callback = function() {
      // Set status and headers, can be overridded with after filters
      if(self.cookies) {
        headers['Set-Cookie'] = self.cookies.toArray();
      }
      r.setHeaders(stat, headers);

      // Run after filters, then finish out the response
      _execFilters.apply(self, [action, 'after', function() {
        if(self.method == 'HEAD') {
          r.finish();
        } else r.finalize(content);
      }]);
    };

    if(this.session) {
      // Save access time into session for expiry and
      // - verifying sameOriginToken
      this.session.set('accessTime', this.accessTime);
      this.session.close(callback);
    } else callback();
  };

  _throwUndefinedFormatError = function() {
    err = new geddy.errors.InternalServerError(
      'Format not defined in response.formats.');
    this.error(err);
  };

  _generateSameOriginToken = function(time) {
    var time = time || this.accessTime
      , sha = crypto.createHash('sha1');

    sha.update(geddy.config.secret);
    sha.update(this.session.id);
    sha.update(time.toString());

    return sha.digest('hex');
  };

  _protectFromForgery = function(complete) {
    var methods = {PUT: true, POST: true, DELETE: true}
      , lastAccess = this.session.get('accessTime')
      , params = this.params
      , token = params.same_origin_token || params.sameOriginToken
      , forbidden = false;

    if(methods[this.method]) {
      if(!token) {
        forbidden = true;
      } else {
        if(_generateSameOriginToken.call(this, lastAccess) != token) {
          forbidden = true;
        }
      }
    }

    if(forbidden) {
      err = new geddy.errors.ForbiddenError(
        'Cross-site request not allowed.');
      this.error(err);
    } else complete();
  };

  /*
   *
   * Pseudo-private, non-API
   *
  */
  // Primary entry point for calling the action on a controller
  // Wraps the action so before and after filters can be run
  this._handleAction = function(action) {
    var self = this
      , callback;

    // Wrap the actual action handling in a callback to use as the last
    // - method in the async chain of before filters
    callback = function() {
      if(!self.completed) {
        self[action].apply(self, [self.request, self.response, self.params]);
      }
    };

    // Generate an anti-CSRF token
    if(geddy.config.secret && this.session) {
      this.sameOriginToken = _generateSameOriginToken.call(this);
    }

    // Running filters asynchronously breaks handlers that depend on
    // setting listeners on the request before the next tick -- only
    // run them if necessary
    if (this._beforeFilters.length) {
      _execFilters.apply(this, [action, 'before', callback]);
    }
    else callback();
  };

  /*
   *
   * Public methods
   *
  */
  this.before = function(filter, options) {
    /*
      @name controller.BaseController#before
      @public
      @function
      @description Adds an action to the beforeFilters list.
      @param {Function} filter Action to add to the beforeFilter list of
      actions to be performed before a response is rendered.
      @param {Object} [opts]
        @param {Array} [opts.except=null] List of actions where the
        before-filter should not be performed.
        @param {Array} [opts.only=null] This list of actions are the
        only actions where this before-filter should be performed
    */
    options = options || {};
    _addFilter.apply(this, ['before', filter, options]);
  };

  this.after = function(filter, options) {
    /*
      @name controller.BaseController#after
      @public
      @function
      @description Adds an action to the afterFilters list of actions
        to be performed after a response is rendered.
      @param {Function} filter Action to add to the afterFilter list.
      @param {Object} [opts]
        @param {Array} [opts.except=null] List of actions where the
        after-filter should not be performed.
        @param {Array} [opts.only=null] This list of actions are the
        only actions where this after-filter should be performed.
    */
    options = options || {};
    _addFilter.apply(this, ['after', filter, options]);
  };

  this.protectFromForgery = function(options) {
    options = options || {};

    if(!geddy.config.secret) {
      geddy.log.error('protectFromForgery requires an app-secret. ' +
          'Run `geddy secret` in your app.');
    }
    if(!geddy.config.sessions) {
      geddy.log.error('protectFromForgery requires sessions.');
    }
    if(typeof options.async != 'undefined' && !options.async) {
      geddy.log.error('protectFromForgery requires the async flag set to true.');
    }

    options.async = true;
    // Add a before filter
    this.before(_protectFromForgery, options);
  };

  this.redirect = function(target) {
    /*
      @name controller.BaseController#redirect
      @public
      @function
      @description Sends a 302 redirect to the client, based on either a
        simple string-URL, or a controller/action/format combination.
      @param {String|Object} target Either an URL, or an object literal containing
        controller/action/format attributes to base the redirect on.
    */
    var url;

    if(typeof target == 'string') {
      url = target
    } else if(typeof this.app.router.url == 'function') {
      if(this.name && !target.controller) target.controller = this.name;
      if(this.params.format && !target.format) target.format = this.params.format;

      url = this.app.router.url(target);
    }

    if(!url) {
      var contr = target.controller || this.name
        , act = target.action
        , ext = target.format || this.params.format
        , id = target.id;

      contr = geddy.string.decamelize(contr);
      url = '/' + contr;
      url += act ? '/' + act : '';
      url += id ? '/' + id : '';
      if(ext) url += '.' + ext;
    }

    _doResponse.apply(this, [302, { 'Location': url }, '']);
  };

  this.error = function(err) {
    /*
      @name controller.BaseController#error
      @public
      @function
      @description Respond to a request with an appropriate HTTP error-code.
        If a status-code is set on the error object, uses that as the error's
        status-code. Otherwise, responds with a 500 for the status-code.
      @param {Object} err The error to use as the basis for the response.
    */
    this.completed = true;
    geddy.errors.respond(this.response, err);
  };

  this.transfer = function(action) {
    /*
      @name controller.BaseController#transfer
      @public
      @function
      @description Transfer a request from its original action to a new one. The
        entire request cycle is repeated, including before-filters.
      @param {Object} action The new action designated to handle the request.
    */
    this.params.action = action;
    this._handleAction(action);
  };

  this.respond = function(content, options) {
    /*
      @name controller.BaseController#respond
      @public
      @function
      @description Performs content-negotiation, and renders a response.
      @param {Object|String} content The content to use in the response.
      @param {Object} [opts] Options.
        @param {String} [options.format] The desired format for the response.
        @param {String} [options.template] The path (without file extensions)
          to the template to use to render this response.
        @param {String} [options.layout] The path (without file extensions)
          to the layout to use to render the template for this response.
    */
    var self = this
      , options = options || {}
      , formatParam = typeof opts == 'string' ? options : options.format
      , negotiated = _negotiateContent.call(this, formatParam)
      , format
      , contentType
      , callback;

    callback = function(formattedContent) {
      _doResponse.apply(self, [200, {'Content-Type': contentType}, formattedContent]);
    };

    // Error during content negotiation may result in an error response, so
    // - don't continue
    if(this.completed) return;

    format = negotiated.format;
    contentType = negotiated.contentType;

    if(!contentType) {
      var err = new geddy.errors.NotAcceptableError('Not an acceptable media type.');
      this.error(err);
      return;
    }
    if(!format) {
      _throwUndefinedFormatError.call(this);
      return;
    }

    if(options.template) this.template = options.template;
    if(options.layout) this.layout = 'app/views/' + options.layout;

    // Hand content off to formatting along with callback for writing out
    // the formatted respnse
    response.formatContent(format, content, this, callback);
  };
  this.render = this.respond; // Keep backwards compat

  this.renderTemplate = function(data, callback) {
    var self = this
      , templater = new Templater()
      , content = ''
      , dirName;

    // Format directory name
    dirName = geddy.inflection.pluralize(this.name);
    dirName = geddy.string.snakeize(dirName);

    // Get template if not set
    this.template = this.template ||
      'app/views/' + dirName + '/' + this.params.action;

    // Get layout if not set
    this.layout = this.layout || 'app/views/layouts/' + dirName;

    templater.addListener('data', function(data) {
      // Buffer for now, but we could stream
      content += data;
    });
    templater.addListener('end', function() {
      callback(content);
    });

    templater.render(data, {
        layout: this.layout
      , template: this.template
      , controller: this.name
      , action: this.params.action
    });
  };

})();

exports.BaseController = controller.BaseController;

