var file = require('utilities').file
  , swig = {};

swig = function () {
  this.engine = this.engine || file.requireLocal('swig');

  this.engine.init({
	  allowErrors: false,
	  autoescape: true,
	  cache: false,
	  encoding: 'utf8',
	  filters: {},
	  root: '/',
	  tags: {},
	  extensions: {},
	  tzOffset: 0
	});
};

swig.prototype.compile = function (template, options) {
  // If there is no baseNamePath swig will use the template string as a key.  Use a hash as a key instead
  if(!options.baseNamePath){
    options.baseNamePath = require('crypto').createHash('sha1').update(template).digest('hex');
  }
  return this.engine.compile(template, {filename: options.baseNamePath});
};

swig.prototype.render = function (data, fn) {
  return fn(data);
};

module.exports = swig;