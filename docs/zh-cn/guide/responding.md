Geddy有各种不同层级粒度API来响应请求。从高到低层级分别有：

 * respondWith
 * respondTo
 * respond/redirect
 * output

一般来说，你可以使用最高级别的API来希望Geddy去做正确的事情，然而低级别的API可以实现一些其他特别的响应。

#### respondWith

[`respondWith` method in API reference](/reference#controllers.respondWith)

`respondWith`方法是最高级别的API，它以正确的方式格式化输出。但也允许更普遍的
特定格式的行为,例如做重定向,或添加需要的头文件。

响应REST风格的`create`请求是一个很好的例子。在该例子中，对于希望返回HTML响应的请求，在创建请求之后，您将需要对项目的HTML页面进行重定向。在想要返回JSON请求的情况下,你想来响应一个201/created,并包括一个'Location'头以及新创建的配置项的URL。

使用`respondWith`，指定格式的控制器可以通过调用 `canRespondTo`实现：

```javascript
var SnowDogs = function () {
  this.canRespondTo(['html', 'json', 'js']);
};
```

那将允许你的控制器运用内置的响应策略来响应其他格式的需求。

像下面那样，使用Geddy模型实例、或者实例集合来调用`respondWith`：

```javascript
var SnowDogs = function () {
  this.canRespondTo(['html', 'json', 'js']);

  this.index = function (req, resp, params) {
    var self = this;
    geddy.model.SnowDog.all(function(err, snowDogs) {
      if (err) {
        throw err;
      }
      self.respondWith(snowDogs);
    });
  };

  this.show = function (req, resp, params) {
    var self = this;
    geddy.model.SnowDog.first(params.id, function(err, snowDog) {
      if (err) {
        throw err;
      }
      if (!snowDog) {
        throw new geddy.errors.NotFoundError('SnowDog ' + params.id + ' not found.');
      }
      self.respondWith(snowDog);
    });
  };
};
```

当`throw`一个错误，Geddy仍将执行内容协商来完成这个任务,并响应一个正确格式的错误。如果想要一个JSON响应请求，Geddy会解析JSON响应,包括statusCode statusText,消息和堆栈（如果可用的话）。

#### respondTo

[`respondTo` method in API reference](/reference#controllers.respondTo)

`respondTo`方法是另一个层级粒度API。该方法允许你定制你自己的响应策略。
注意：调用`respondTo`方法将覆盖`canRespondTo`所用的格式。

以对象形式调用`respondTo`可以处理各种响应策略，像这样的：

```javascript
var Users = function () {

  this.show = function (req, resp, params) {
    var self = this;
    geddy.model.User.first({username: 'foo'}, function (err, user) {
      if (err) {
        throw err;
      }
      self.respondTo({
        html: function () {
          self.redirect('/user/profiles?user_id=' + user.id);
        }
      , json: function () {
          self.respond(user, {format: 'json'});
        }
      });
    });
  };
};
```

使用`respondTo`做除了简单格式化内容输出之外的事情，你可以实现跳转、设置请求头等等。

如果你想建立自身定制化的响应策略，你可以新建定制的应答器。

#### respond and redirect

[`respond` method in API reference](/reference#controllers.respond)

[`redirect` method in API reference](/reference#controllers.redirect)


`respond`方法是一个较低级别的API调用,只是对于请求以正确的格式输出内容。html的格式将被渲染适当的模板请求,API格式如'json'只会把你传入的数据格式简单的输出:

```javascript
var Users = function () {

  this.show = function (req, resp, params) {
    var self = this;
    geddy.model.User.first({username: 'foo'}, function (err, user) {
      if (err) {
        throw err;
      }
      this.respond(user);
    });
  };
};
```

`respond`方法接受一个可选对象,允许您设置特定的属性，像布局、或格式化响应等。如果你不通过format-override,Geddy会根据请求的文件扩展名找出正确的格式，那将是控制器所支持的格式。


`redirect` 顾名思义，是一个URL跳转。你可以传递一个路径字符串，或者一个控制器、动作引用。

#### output

[`output` method in API reference](/reference#controllers.output)

`output`方法是请求响应最低级别的API。当你确切的知道响应，你可以使用该方法（例如：HTTP状态码、请求头及请求内容）。请看下面的例子：

```javascript
var Users = function () {

  this.create = function (req, resp, params) {
    var self = this
      , user = geddy.model.User.create(params);
    if (!user.isValid()) {
      throw new geddy.errors.BadRequestError('Oops!');
    }
    user.save((function (err, data) {
      if (err) {
        throw err;
      }
      // Respond with a 201/created and no content
      this.output(201, {
        'Content-Type': 'application/json'
      , 'Location': '/users/' + user.id
      });
    });
  };
};
```

#### 定制响应

你能使用`respondWith`来实现你自己的响应（使用自身的响应策略）。

最简单的定制响应的例子就是仅仅是一个函数。像下面例子那样在控制器里设置你自己的响应：

```javascript
this.responder = function (controller, content, opts) {
  // Redirect Web content
  if (opts.format == 'html') {
    controller.redirect('/web' + controller.request.url);
  }
  else {
    controller.respond(content, opts);
  }
};
```
或者你可以子类内置Geddy响应者，改变其策略，或其`respond`方法。其策略依赖'strategies'属性:

```javascript
var CustomResponder = function () {
  var builtIns = geddy.responder.strategies;
  this.strategies = {
    html: builtIns.html
  , json: builtIns.json
  , xml: function (content, opts) {
      // Do something special for XML responses
    }
  };
};
CustomResponder.prototype = Object.create(geddy.responder.Responder.prototype);
```

在控制器实例上调用策略，'this' 将是对您控制器的引用。

同样，你可以覆盖`respond`方法：

```javascript
CustomResponder.respond = function (controller, content, opts) {
  var strategies = this.strategies;
  if (opts.format == 'xml') {
    throw new Error('Nobody uses XML anymore, buddy.');
  }
  // Otherwise, we don't care what format, just output
  controller.respond(content, opts);
};

```

为了使用子类响应，你可以在控制器里这样设置：

```javascript
this.responder = new CustomResponder();
```

#### 缓存响应

Geddy使你在动作级别上缓存响应，这样你就可以为特定的动作建立一个响应，然后从缓存中为所有后续的请求提供服务。

在控制器构造函数里面，用一个你想去缓存的动作或动作列表来调用`cacheResponse`方法。

请看例子：

```javascript
// Controller for the 'zooby' resource
var Zoobies = function () {

  // Build the index action response once, then serve from cache
  this.cacheResponse(['index']);

  this.index = function () {
    var resp = {};
    // Do some complicated logic here you only want to do once
    this.respond(resp, {
      format: 'html'
    });
  };
};

exports.Zoobies = Zoobies;

```

响应缓存主要是针对缓存简单的content-responses,因此它有一定的局限性。

*GET only*: 当前仅仅支持 GET 请求。

*不要处理多个格式*: 目前只适用于一个特定的控制器/动作组合，并非per-format。

如果在相同的动作里面，你需要响应多个数据格式(比如JSON 和 HTML)，这将没办法实现。它将缓存响应，以获取请求的第一个格式。

*Caches per-worker*: 响应被缓存在Node进程里, workers必须单独缓存响应。

这意味着如果你超时的响应，你能在同一个动作内来结束不同的workers服务，并缓存不同的响应。

