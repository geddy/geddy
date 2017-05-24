Geddy 使用 [Barista](http://github.com/kieran/barista) 当作它的路由规则。它跟rails路由很类似。不但可以使用基于资源的通用路由，也可以定义独立的路由。

* * *

#### .match
`router.match(path [, method])`

定义url来匹配控制器动作。

##### path
- `path [string]`: the url to match to an action

##### method
- `method [string]`: the http method to match

##### 例子
```
router.match('/').to('Main.index');
// will route any request to '/' to the Main controller's index action


router.match('/products/:id', 'GET').to('products.show')
// will route '/products/5' to Products.show()
// and set the id paramer to be 5


router.match('/profiles/:username', 'GET').to('users.show')
// will route '/products/dan' to Users.show()
// and set the username paramer to be dan


router.match('/products/:id(.:format)', 'GET').to('products.show')
// things enclosed in parentheses are optional
```

* * *

#### .to
`router.match(path).to(action)`

定义动作来匹配路径。

##### action
- `action [string]`: 字符串格式的控制器名+动作名
- `action [object]`: 定义控制器和动作属性的对象

##### 例子
```
router.match('/').to('Main.index');
// will route any request to '/' to the Main controller's index action


router.match('/').to({controller: 'Main', action: 'index'});
// will route any request to '/' to the Main controller's index action
```

* * *

#### .get
`router.get(path)`

等价于 `router.match(path, 'GET')`

* * *

#### .post
`router.post(path)`

等价于 `router.match(path, 'POST')`

* * *

#### .put
`router.put(path)`

等价于 `router.match(path, 'PUT')`

* * *

#### .del
`router.del(path)`

等价于 `router.match(path, 'DELETE')`

* * *

#### .resource
`router.resource(controller)`

为控制器生成标准的资源路由

##### controller
- `controller [string]`: 需要丰富多彩的路由的驼峰命名的控制器名称

##### 例子
```
router.resource('products')

// is equivalent to:

router.get('/products(.:format)').to('products.index')
router.get('/products/add(.:format)').to('products.add')
router.get('/products/:id(.:format)').to('products.show')
router.get('/products/:id/edit(.:format)').to('products.edit')
router.post('/products(.:format)').to('products.create')
router.put('/products/:id(.:format)').to('products.update')
router.del('/products/:id(.:format)').to('products.destroy')
```

* * *
