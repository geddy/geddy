控制器定义了不同的动作，方便用户交互。

* * *

#### .request
`this.request`

原生 `http.ServerRequest` 对象，在整个 request/response 周期内。

* * *

#### .response
`this.response`

原生 `http.ServerResponse` 对象，在整个 request/response 周期内。

* * *

#### .params
`this.params`

对于请求的解析参数。`params` 也可以作为动作的参数来传递，这便于作为实例对象来新增。

* * *

#### .cookies
`this.cookies`

请求头的cookies对象收集。

* * *

#### .name
`this.name`

控制器构造函数名，首字母大写的驼峰式命名。

* * *

#### .canRespondTo
`canRespondTo(contentTypes)`

Content-types the controller can use in responses.
控制器响应的文本类型。

##### contentTypes
- `contentTypes [array]` 控制器响应的文件类型列表。

##### 例子
```
this.canRespondTo(['html', 'json', 'js']);
```

* * *

#### .before
`before(filter, [options])`

在响应渲染之前执行一个动作。

##### filter
- `filter [function]` 添加到beforeFilter列表的动作。如果操作是异步的，那么当操作完成时，只需要一个回调参数来调用。

##### 可选参数
- `except [array]` 不应该执行的before-filter操作列表。
- `only [array]` 仅当被执行before-filter的操作列表。
- `async` [boolean] 当设置为真的时候，before-filter是异步的，而且需要一个回调

##### 案例
```
this.before(function () { // Do something });
// runs the function before the action is run

this.before(someFunction, {except: ['index', 'home']});
// won't run someFunction if this is the index or home action

this.before(someFunction, {only: ['add', 'update', 'remove']}
// will only run someFunction if this is the add, update, or remove action

this.before(function (next) {
  doSomethingAsync(function (err, result) {
    next();
  });
}, {async: true});
// runs an async function before the action -- requires a callback to proceed
```

* * *

#### .after
`after(filter, [options])`

在响应渲染后执行一个动作。

##### filter
- `filter [function]` 添加到afterFilter列表的动作。如果操作是异步的，那么当操作完成时，只需要一个回调参数来调用。

##### 可选参数
- `except [array]` 不应该执行的after-filter操作列表。
- `only [array]` 仅当被执行after-filter的操作列表。
- `async` [boolean] 当设置为真的时候，after-filter是异步的，而且需要一个回调

##### 案例
```
this.after(function () { // Do something });
// runs the function after the action is run, but before the response is completed

this.after(someFunction, {except: ['index', 'home']});
// won't run someFunction if this is the index or home action

this.after(someFunction, {only: ['add', 'update', 'remove']}
// will only run someFunction if this is the add, update, or remove action

this.after(function (next) {
  doSomethingAsync(function (err, result) {
    next();
  });
}, {async: true});
// runs an async function after the action -- requires a callback to proceed
```

* * *

#### .protectFromForgery
`protectFromForgery()`

通过为破坏性的HTTP方法(PUT、POST、DELETE)要求一个同源标记来防止跨站点请求。
* * *

#### .redirect
`redirect(to, options)`

##### to [string]
- 如果 `to` 参数是一个字符串, 将会跳转到字符串所示的url

##### to [object]
- `controller [string]`: 控制器名
- `action [string]`: 方法名
- `format [string]`: 文件扩展名

##### 可选参数
- `statusCode [number]` 重写默认的302HTTP请求状态码。必须是有效的3xx状态嘛（例如，301 / moved permanently, 301 / temporary redirect）

发送一个(302)跳转到客户端，依赖于一个简单的url字符串，或者一个controller/action/format的结合。

##### 例子
```
this.redirect('/users/1');
// will redirect the browser to /users/1

this.redirect({controller: 'users', action: 'show', id: 1});
// will redirect the browser to /users/1
```

* * *

#### .error
`error(err)`

响应合适的HTTP错误码。如果在错误对象中有状态码，把他当作错误状态码。否则的话，响应500。

##### err [error]
- `statusCode [number]` 发送到客户端的可选http状态码，默认是 500
- `message [string]` 发送到客户端的错误内容

##### 例子
```
this.error();
// sends a 500

var err = new Error('Whoopsy daisy');
this.error(err);
// sends a 500 with a specific message

var err = new Error();
err.statusCode = 420;
this.error(err);
// sends a 420
```

* * *

#### .transfer
```
transfer(action)
```

Transfer a request from its original action to a new one. The entire request
cycle is repeated, including before-filters.
将请求从原来的操作转移到一个新的请求。包括before-filters在内的整个请求周期都是重复的。

##### action
- `action [string]`: 指定处理请求的新操作的名称。
- `action [object]`: 指定处理请求的新动作

* * *

#### .respondWith
```
respondWith(resources)
```

使用特定于格式的策略，使用所提供的资源提供响应。在HTML响应的情况下，它可能会渲染一个模板，或者重定向——使用JSON，它将输出适当的api形式的JSON作为响应。

CRUD中的`create`方法是一个好的例子。如果客户端请求一个html响应，`respondWith`会渲染一个模版，或者返回一个200/OK状态码。如果客户端请求一个json响应，将输出一个json格式的201/Created状态码， 带有创建项目的url的'Location'请求头。

为了能使用`respondWith`，必须在控制器中使用`canRespondTo`来申明格式。

##### resources
- `resources [object]`: Geddy在响应中的一个模型实例或者实例集合。

##### 例子
```
// Fetch a user and respond with an appropriate response-strategy
var self = this;
geddy.model.User.first({username: 'foo'}, function (err, user) {
  self.respondWith(user);
});

```

* * *

#### .respondTo
```
respondTo(strategies)
```
对于特定请求，允许提供特殊的响应策略来使用。

注意：当你使用`respondTo`时，将重写任何在控制器中使用`canRespondTo`个格式申明。

##### strategies
- `strategies [object]`: 输出响应的特殊格式策略。

##### 例子
```
// Fetch a user and respond with an appropriate response-strategy
var self = this;
geddy.model.User.first({username: 'foo'}, function (err, user) {
  self.respondTo({
    html: function () {
      self.redirect('/user/profiles?user_id=' + user.id);
    }
  , json: function () {
      self.respond(user, {format: 'json'});
    }
  });
});

```

* * *

#### .respond
```
respond(data, options)
```

执行内容协商，渲染响应。

##### data
- `data [object]`: 传输给模版的属性对象

##### options
- `layout [string]`: 所使用的布局文件的路径
- `layout [false]`: 不使用布局文件的标志
- `format [string]`: 渲染格式
- `template [string]`: 渲染响应的模版文件路径（不带文件扩展名）
- `statusCode [number]`: 响应的HTTP状态码

##### examples
```
this.respond(params);
// send the params object to the view, then send the response


this.respond({posts: posts});
// send the passed in object to the view, then send the response


this.respond(params, {template: 'path/to/template'});
// send params to path/to/template, render it, then send the response


this.respond(params, {format: 'json'});
// send the params object as the response in json format

this.respond(null, {statusCode: 201});
// send a 201/created with no body
```

* * *

#### .output
```
output(statusCode, headers, content)
```
以具体http请求状态码的形式输出响应，包括http请求头及请求内容。这是最低级别的响应api,用于当你明确你想输出的状态、请求头、请求内容的时候。

##### statusCode
- `statusCode [number]`: HTTP status-code to be use for the response

##### headers
- `headers [object]`: HTTP headers to include in the response

##### content
- `content [string]`: Content to be used in the response-body (optional).
If not passed, no response body is output.

##### 例子
```
this.output(200, {'Content-Type': 'application/json'},
    '{"foo": "bar"}');
// Output a JSON response

this.output(201, {'Content-Type': 'text/html',
    'Location': '/foobars/12345'});
```

* * *

#### .cacheResponse
`this.cacheResponse(actions)`

在控制器层面为特殊动作缓存响应。

##### actions
- `actions [string|array]`: 控制器的某个动作或系列动作来缓存响应。

##### 例子
```
// Cache the response for the 'index' action
this.cacheResponse('index');

// Cache responses for the the 'main' and 'feed' actions
this.cacheResponse(['main', 'feed']);
```

* * *

#### .flash

flash是session中比较特殊的一部分，它在每一个请求之后都会被清除。这意味着其储存的值只有在下一个请求当中才有效。它对于存储错误等很有效。它以与类似会话的方式被访问，就像hash一样。

它也包含一些用于getting/setting一样常用类型的flash-message的简便方法。

* * *

#### .flash.alert
```
flash.alert([message])
```
为session获取或者设置一个*alert* flash-messages。如果带有'message'参数，它是设置值；如果没有，它将检索这个值并且返回。

##### message
- `message [string|object]`: The contents of the flash-message

##### examples
```
this.flash.alert('Check it out!');
// Sets the 'alert' flash-message to 'Check it out!'

this.flash.alert();
// Returns 'Check it out!'
```

* * *

#### .flash.error
```
flash.error([message])
```

为session获取或者设置一个*error* flash-messages。如果带有'message'参数，它是设置值；如果没有，它将检索这个值并且返回。

##### message
- `message [string|object]`: The contents of the flash-message

##### examples
```
this.flash.error('Yikes! Something wrong wrong.');
// Sets the 'error' flash-message to 'Yikes! Something wrong wrong.'

this.flash.error();
// Returns 'Yikes! Something wrong wrong.'
```

* * *

#### .flash.success
```
flash.success([message])
```

为session获取或者设置一个*success* flash-messages。如果带有'message'参数，它是设置值；如果没有，它将检索这个值并且返回。

##### message
- `message [string|object]`: The contents of the flash-message

##### examples
```
this.flash.success('Whoa! It worked.');
// Sets the 'success' flash-message to 'Whoa! It worked.'

this.flash.success();
// Returns 'Whoa! It worked.'
```

* * *

#### .flash.info
```
flash.info([message])
```

为session获取或者设置一个*info* flash-messages。如果带有'message'参数，它是设置值；如果没有，它将检索这个值并且返回。

##### message
- `message [string|object]`: The contents of the flash-message

##### examples
```
this.flash.info('FYI. Just sayin.');
// Sets the 'info' flash-message to 'FYI. Just sayin.'

this.flash.info();
// Returns 'FYI. Just sayin.'
```

* * *

#### .flash.set
```
flash.set([type], message)
```
为一个会话、自定义类型或整个flash-message对象设置flash-message

##### type
- `type [string]`: The flash-message type. If not included, this call sets
the entire flash-message object

##### message
- `message [string|object]`: The contents of the flash-message

##### examples
```
this.flash.set('foo', 'Foo bar baz');
// Sets the 'foo' flash-message to 'Foo bar baz'

this.flash.set({bar: 'Baz bar qux});
// Sets the entire flash-message object
```

* * *

#### .flash.get
```
flash.get([type])
```

为一个会话、自定义类型或整个flash-message对象检索flash-message

##### type
- `type [string]`: The flash-message type. If not included, this call
retrieves the entire flash-message object

##### examples
```
this.flash.set('foo', 'Foo bar baz');
this.flash.get('foo');
// Returns 'Foo bar baz'

this.flash.get();
// Returns an object: {foo: 'Foo bar baz'}
```

* * *

#### .flash.keep
```
flash.keep([type])
```

通常，在当前请求中使用flash-message时，将会被清除。`keep`使其持久化，并对下一个请求可用。

##### type
- `type [string]`: 要保留到下一个请求的消息类型。如果没有包含type参数，则保留整个flash消息对象。

##### examples
```
this.flash.keep('error');
// Keep the error flash around after a redirect
```

* * *

#### .flash.discard
```
flash.discard([type])
```

在当前请求结束时，标记一个特定的flash-message条目(或整个对象)被丢弃。

##### type
- `type [string]`: 在当前请求结束时，被丢弃的消息类型。如果不包含type参数，丢弃整个flash-message对象。

##### examples
```
this.flash.discard('error');
// Discard the current error flash-message
```

* * *


