/*
* The HTML strategy is more involved than the API ones
* because
*/
var utils = require('utilities')
  , Strategy = function (content, options, cb) {

      // Where to redirect to on a success event
      var params = this.params
        , type = options.type
          // Check the content for an errors hash
        , isFailure = (content.errors && typeof content.errors === 'object')
        , response
        , redirect

          // Default status messages
        , successStatuses = {
            create: options.type + ' created'
          , update: options.type + ' updated'
          , remove: options.type + ' removed'
          }

          // Default routes to redirect to
        , successRedirects = {
            create: {id: content.id}
          , update: {id: content.id}
          , destroy: {}
          }
        , failureRedirects = {
            create: {action: 'add'}
          , update: {action:'edit', id: content.id}
          , update: {action:'edit', id: content.id}
          }

          /**
          * Select the appropriate redirect URL for the current situation
          * @return {Boolean|Object} - false if no redirect
          *   should occur, a route object if otherwise
          */
        , getRedirect = function () {
            var location = options.location
                // Select the appropriate defaults for the situation
              , redirects = isFailure ? failureRedirects : successRedirects;

            // Don't redirect if the user explicitly set location to false
            if(location === false) {
              return false;
            }
            else {
              // If the user defined a location, use that
              if(location) {
                return location;
              }
              else {
                // Otherwise look it up in the defaults
                return redirects[params.action] || false;
              }
            }
          }

          /**
          * Sets the appropriate flash message for the current situation
          */
        , doFlash = function () {
            var status;

            // User can suppress flashes with {silent: true}
            if(options.silent) {
              return;
            }

            // Find an appropriate flash message
            if(options.status) {
              // Use a user provided status if possible

              this.flash.set(isFailure ? 'error' : 'success', options.status);
            }
            else {

              if(isFailure) {
                this.flash.set('error', content.errors);
              }
              else {
                status = successStatuses[params.action.toLowerCase()];

                // Don't set a flash if no message was found
                if(status) {
                  this.flash.set('success', status);
                }
              }
            }
          };

      // Determine if `content` is a model object
      if (typeof content === 'object' && content.type && content.toObj) {

        // Set the flash message
        doFlash.apply(this);

        // Determine if we need to redirect
        redirect = getRedirect.apply(this);

        if(redirect) {
          this.redirect(redirect);
          if(cb) {
            cb();
          }
        }
        else {
          // Respond in the style
          // {model: {attr: val, attr2: val...}, params: {}}
          response = {params: params};
          response[type] = content.toObj();
          response[type].id = content.id;

          this.outputFormattedContent.call(this, response, options, cb);
        }
      }
      // Determine if `content` is a collection of models
      else if(content instanceof Array) {
        if(!type) {
          throw new Error(
            'Cannot determine model type from empty array, specify one in opts');
        }

        type = utils.inflection.pluralize(type);

        response = {params: params};
        response[type] = [];

        for(var i=0, ii=content.length; i<ii; i++) {
          response[type][i] = content[i].toObj();
          response[type][i].id = content[i].id;
        }

        this.outputFormattedContent(response, options, cb);
      }
      else if (content instanceof Error) {
        // Format error for template-rendering
        response = utils.mixin({}, content);
        if (geddy.config.detailedErrors) {
          // 'message' and 'stack' are not enumerable
          response.message = content.message || '';
          response.stack = content.stack || '';
        }
        else {
          response.message = '';
          response.stack = '';
        }
        options.statusCode = content.statusCode || 500;
        this.outputFormattedContent(response, options);
      }
      else {
        throw new Error(
          'respondWith expects either a model or collection of models');
      }
    };

module.exports = Strategy;
