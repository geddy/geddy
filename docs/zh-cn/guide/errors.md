Geddy使返回错误变得相当容易，也可以给你定制错误返回。

#### 返回错误

为了响应你返回的错误，抛出你想要的错误，Geddy在geddy.errors命名空间中包含一系列HTTP错误（基本js子类错误对象）：

* BadRequestError
* UnauthorizedError
* ForbiddenError
* NotFoundError
* MethodNotAllowedError
* NotAcceptableError
* InternalServerError

如果你想抛出一个正常的js错误对象，Geddy会响应一个 500/InternalServerError

请看例子:

```javascript
  this.show = function (req, resp, params) {
    var self = this;

    geddy.model.SnowDog.first(params.id, function(err, snowDog) {
      if (err) {
        throw err;
      }
      if (!snowDog) {
        throw new geddy.errors.NotFoundError();
      }
      else {
        self.respondWith(snowDog);
      }
    });
  };
```

#### 错误格式

如果你想要为json数据开发一套API-style的请求。当错误发生，服务器渲染一个html页面去响应是不明智的。仅仅因为一个错误发生，你就要去改变content-type吗？
当发生错误，Geddy仍然按要求执行正确的任务，并以你期望的content-type返回一个错误。

例如，一个404/NotFoundError的json返回像下面这样的：

```javascript
{ statusCode: '404',
  statusText: 'Not Found',
    message: 'Could not find page "/foo/bar/baz.json"',
      stack: 'Not Found\n    at ...'
}
```

堆栈跟踪,如果有可用的,就要响应合适的出来。

#### 定制错误

对于html页面响应，Geddy很容易定制错误页。你可以在app/views/errors看到错误页的视图。为了定制特定的错误试图，你可以在errors目录下新增一个名为snake_case的视图。

例如，定制一个404 NotFoundError页，你可以在目录中新建not_found.html.ejs文件。任何在那个目录没有定制错误类型（比如BadRequestError）的视图，将使用default视图。

所有使用errors层的错误页都在app/views/layouts

#### Errors with your errors

当有错误渲染你的错误页('Error Inception')，Geddy返回一个简单、low-fi error-page去渲染错误。用你友好的，定制的错误页面去渲染错误。

