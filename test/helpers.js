// Load the basic Geddy toolkit
require('../lib/geddy');

var Helpers = require('../lib/template/helpers/index')
  , assert = require('assert')
  , helpers = {}
  , tests;

// Assign Helpers actions as a helper
for(var i in Helpers) {
  helpers[i] = Helpers[i].action;
}

tests = {

  'test link for scriptLink': function() {
    assert.equal(helpers.scriptLink('/js/script.js'), '<script src="/js/script.js"></script>');
  }

, 'test link and options for scriptLink': function() {
    var string = helpers.scriptLink('/js/script.js', {type:'text/javascript'});
    assert.equal(string, '<script src="/js/script.js" type="text/javascript"></script>');
  }

, 'test link for styleLink': function() {
    assert.equal(helpers.styleLink('/css/styles.css'), '<link href="/css/styles.css" />');
  }

, 'test link and options for styleLink': function() {
    var string = helpers.styleLink('/css/styles.css', {rel: 'stylesheet'});
    assert.equal(string, '<link href="/css/styles.css" rel="stylesheet" />');
  }

, 'test paragraph in contentTag': function() {
    assert.equal(helpers.contentTag('p', 'some content'), '<p>some content</p>');
  }

, 'test input in contentTag': function() {
    assert.equal(helpers.contentTag('input', 'sample value'), '<input value="sample value" />');
  }

, 'test override value of input in contentTag': function() {
    var string = helpers.contentTag('input', 'sample value', {value: 'actual val'});
    assert.equal(string, '<input value="actual val" />');
  }

, 'test input with boolean attribute in contentTag': function() {
    var string = helpers.contentTag('input', 'sample value', { autofocus: true });
    assert.equal(string, '<input autofocus="autofocus" value="sample value" />');
  }

, 'test default link from content in contentTag': function() {
    assert.equal(helpers.contentTag('a', 'http://google.com'), '<a href="http://google.com">http://google.com</a>');
  }

, 'test link and provide custom href attribute in contentTag': function() {
    var string = helpers.contentTag('a', 'some content', { href: 'http://google.com' });
    assert.equal(string, '<a href="http://google.com">some content</a>');
  }

, 'test object for data attribute in contentTag': function() {
    var string = helpers.contentTag('a', 'http://google.com', { data: {goTo: 'http://google.com'} });
    assert.equal(string, '<a data-go-to="http://google.com" href="http://google.com">http://google.com</a>');
  }

, 'test normal data attributes in contentTag': function() {
    var string = helpers.contentTag('a', 'http://google.com', { dataGoTo: 'http://google.com' });
    assert.equal(string, '<a data-go-to="http://google.com" href="http://google.com">http://google.com</a>');
  }

, 'test single tags in truncateHTML': function() {
    var string = helpers.truncateHTML('<p>Once upon a time in a world</p>', { length: 10 });
    assert.equal(string, '<p>Once up...</p>');
  }

, 'test multiple tags in truncateHTML': function() {
    var string = helpers.truncateHTML('<p>Once upon a time <small>in a world</small></p>', { length: 10 });
    assert.equal(string, '<p>Once up...<small>in a wo...</small></p>');
  }

, 'test multiple tags but only truncate once in truncateHTML': function() {
    var string = helpers.truncateHTML('<p>Once upon a time <small>in a world</small></p>', { length: 10, once: true });
    assert.equal(string, '<p>Once up...<small>in a world</small></p>');
  }

, 'test standard truncate': function() {
    var string = helpers.truncateHTML('Once upon a time in a world', { length: 10 });
    assert.equal(string, 'Once up...');
  }

, 'test custom omission in truncate': function() {
    var string = helpers.truncate('Once upon a time in a world', { length: 10, omission: '///' });
    assert.equal(string, 'Once up///');
  }

, 'test regex seperator in truncate': function() {
    var string = helpers.truncate('Once upon a time in a world', { length: 15, seperator: /\s/ });
    assert.equal(string, 'Once upon a...');
  }

, 'test string seperator in truncate': function() {
    var string = helpers.truncate('Once upon a time in a world', { length: 15, seperator: ' ' });
    assert.equal(string, 'Once upon a...');
  }

, 'test unsafe html in truncate': function() {
    var string = helpers.truncate('<p>Once upon a time in a world</p>', { length: 20 });
    assert.equal(string, '<p>Once upon a ti...');
  }

, 'test standard for imageLink': function() {
    var string = helpers.imageLink('images/google.png', 'http://google.com');
    assert.equal(string, '<a href="http://google.com"><img alt="images/google.png" src="images/google.png" /></a>');
  }

, 'test custom alt text for image in imageLink': function() {
    var string = helpers.imageLink('images/google.png', 'http://google.com', { alt: '' });
    assert.equal(string, '<a href="http://google.com"><img alt="" src="images/google.png" /></a>');
  }

, 'test custom alt text for image and using custom size option in imageLink': function() {
    var string = helpers.imageLink('images/google.png', 'http://google.com', { alt: '', size: '40x50' });
    assert.equal(string, '<a href="http://google.com"><img alt="" height="50" src="images/google.png" width="40" /></a>');
  }

, 'test custom alt text for image and data object for link in imageLink': function() {
    var string = helpers.imageLink('images/google.png', 'http://google.com', { alt: '' }, { data: {goTo: 'http://google.com'} });
    assert.equal(string, '<a data-go-to="http://google.com" href="http://google.com"><img alt="" src="images/google.png" /></a>');
  }

, 'test standard for imageTag': function() {
    var string = helpers.imageTag('images/google.png');
    assert.equal(string, '<img alt="images/google.png" src="images/google.png" />');
  }

, 'test custom alt text for image in imageTag': function() {
    var string = helpers.imageTag('images/google.png', { alt: '' });
    assert.equal(string, '<img alt="" src="images/google.png" />');
  }

, 'test custom size attribute for image in imageTag': function() {
    var string = helpers.imageTag('images/google.png', { size: '40x50' });
    assert.equal(string, '<img alt="images/google.png" height="50" src="images/google.png" width="40" />');
  }

, 'test malformed size attribute for image in imageTag': function() {
    var string = helpers.imageTag('images/google.png', { size: 'a string' });
    assert.equal(string, '<img alt="images/google.png" src="images/google.png" />');
  }

, 'test standard in linkTo': function() {
    var string = helpers.linkTo('some content', 'http://google.com');
    assert.equal(string, '<a href="http://google.com">some content</a>');
  }

, 'test data object in linkTo': function() {
    var string = helpers.linkTo('some content', 'http://google.com', { data: {goTo: 'http://google.com'} });
    assert.equal(string, '<a data-go-to="http://google.com" href="http://google.com">some content</a>');
  }

, 'test string in urlFor': function() {
    var string = 'http://google.com';
    assert.equal(helpers.urlFor(string), string);
  }

, 'test simple host in urlFor': function() {
    var object = { host: 'somehost.com' }
      , result = 'http://somehost.com';
    assert.equal(helpers.urlFor(object), result);
  }

, 'test auth included with URL in urlFor': function() {
    var object = { host: 'somehost.com', username: 'username', password: 'password' }
      , result = 'http://username:password@somehost.com';
    assert.equal(helpers.urlFor(object), result);
  }

, 'test subdomain with host in urlFor': function() {
    var object = { host: 'somehost.com', subdomain: 'user' }
      , result = 'http://user.somehost.com';
    assert.equal(helpers.urlFor(object), result);
  }

, 'test subdomain with domain in urlFor': function() {
    var object = { domain: 'somehost.com', subdomain: 'user' }
      , result = 'http://user.somehost.com';
    assert.equal(helpers.urlFor(object), result);
  }

, 'test simple host with controller and action in urlFor': function() {
    var object = { controller: 'tasks', action: 'new', host: 'somehost.com' }
      , result = 'http://somehost.com/tasks/new';
    assert.equal(helpers.urlFor(object), result);
  }

, 'test relative path with controller and action in urlFor': function() {
    var object = { controller: 'tasks', action: 'new', relPath: true }
      , result = '/tasks/new';
    assert.equal(helpers.urlFor(object), result);
  }

, 'test https protocol in urlFor': function() {
    var object = { host: 'somehost.com', protocol: 'https' }
      , result = 'https://somehost.com';
    assert.equal(helpers.urlFor(object), result);
  }

, 'test single query in urlFor': function() {
    var object = { host: 'somehost.com', controller: 'tasks', action: 'new', authToken: 'some_token' }
      , result = 'http://somehost.com/tasks/new?authToken=some_token';
    assert.equal(helpers.urlFor(object), result);
  }

, 'test multiple query in urlFor': function() {
    var object = { host: 'somehost.com', controller: 'tasks', action: 'new', authToken: 'some_token', date: '6232012' }
      , result = 'http://somehost.com/tasks/new?authToken=some_token&date=6232012';
    assert.equal(helpers.urlFor(object), result);
  }

, 'test fragments in urlFor': function() {
    var object = { host: 'somehost.com', anchor: 'submit' }
      , result = 'http://somehost.com#submit';
    assert.equal(helpers.urlFor(object), result);
  }

};

module.exports = tests;
