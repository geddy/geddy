
var ContentCache = function () {
  this._cacheable = {};
  this._content = {};
};

ContentCcache.prototype = new (function () {

  this.allow = function (key, ttl) {
    this._cacheable[key] = {
      ttl: ttl
    };
  };

  this.isCacheable = function (key, method) {
    return this._cacheable[key] && method.toLowerCase() == 'get';
  };

  this.set = function (key, statusCode, headers, content) {
    if (!this._cacheable[key]) {
      throw new Error('This item is not cacheable');
    }
    this._content[key] = {
      statusCode: statusCode
    , headers: headers
    , content: content
    , cacheTime: new Date()
    };
  };

  this.get = function (key) {
    return this._content[key];
  };

  this.clear = function (key) {
    delete this._content[key];
  };

  this.clearAll = function (key) {
    this._content = {};
  };

  this.isExpired = function (key) {
    if (!this._cacheable[key]) {
      throw new Error('This item is not cacheable');
    }

    var ttl = this._cacheable[key].ttl
      , cacheTime
      , expires
      , now;

    // Infinite cache, never expire
    if (ttl === 0) {
      return false;
    }

    // See if the item is actually in cache
    cacheTime = this._content[key] && this._content[key].cacheTime;
    // Item was never cached, effectively expired
    if (!cacheTime) {
      return true;
    }

    // Otherwise check if it's past its freshness date
    expires = new Date(cacheTime.getTime());
    expires.setSeconds(expires.getSeconds() + ttl);
    now = new Date();

    return now > expires;
 };

})();

module.exports.ContentCcache = ContentCcache;
