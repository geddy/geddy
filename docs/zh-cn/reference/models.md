Geddy 在模型层使用 [Model](http://github.com/mde/model) 模块。

Model是抽象对象关系映射，它兼容以下不同类型的数据库：

* Postgres
* MySQL
* SQLite
* Riak
* MongoDB
* LevelDB
* In-memory
* Filesystem

* * *

#### 简介
Model使用非常简单的语法来定义模型。（它与其它类型的ORM很类似，比如ActiveRecord、DataMapper、Django's models以及SQLAlchemy）。
* * *

#### .defineProperties
`defineProperties(properties)`

给模型定义属性

##### properties
- `properties [object]`: 由属性名定义的对象键名

##### example
```
var User = function () {
  this.defineProperties({
    login: {type: 'string', required: true}
  , password: {type: 'string', required: true}
  , lastName: {type: 'string'}
  , firstName: {type: 'string'}
  });
}
```

* * *

#### .property
`property(name, type, options)`

定义单一属性

##### name
- `name [string]`: 属性名

##### type
- `type [string]`: 属性类型
	- `'string'`
	- `'text'`
	- `'number'`
	- `'int'`
	- `'boolean'`
	- `'object'`
	- `'datetime'`
	- `'date'`
	- `'time'`

##### options
- `required [boolean]`: 设置要求的属性

##### 例子
```
this.property('login', 'string', {required: true});
this.property('password', 'string', {required: true});
this.property('joined', 'datetime');
this.property('premium', 'boolean');
```

* * *

#### .validatesPresent
`validatesPresent(property, options)`

设置验证以确保属性存在。

##### property
- `property [string]`: 验证的属性名

##### options
- `on [string|array]`: 指定验证的方法 (默认为 ['create', 'update'])
- `message [string]`: 验证失败给用户的提示信息

##### 例子
```
this.validatesPresent('login');
// makes sure that the login property is present
```

#### .validatesAbsent
`validatesAbsent(property, options)`

设置验证确保属性不存在。

##### property
- `property [string]`: 要验证的属性名

##### options
- `on [string|array]`: 指定验证的方法 (默认为 ['create', 'update'])
- `message [string]`: 验证失败给用户的提示信息

##### example
```
this.validatesAbsent('zerb');
// makes sure that the zerb property is not present
```

* * *

#### .validatesFormat
`validatesFormat(property, regex, options)`

设置验证确保属性格式正确

##### property
- `property [string]`: 要验证的属性名

##### regex
- `regex [regex]`: 属性值通过的正则表达式

##### options
- `on [string|array]`: 指定验证的方法 (默认为 ['create', 'update'])
- `message [string]`: 验证失败给用户的提示信息

##### 例子
```
this.validatesFormat('login', /[a-z]+/, {message: 'cannot contain numbers'});
// makes sure that the login property does not contain numbers
```

* * *

#### .validatesLength
`validatesLength(property, options)`

设置验证确保属性符合一定长度的属性要求。

##### property
- `property [string]`: 验证的属性名

##### options
- `min [number]`: 属性最小长度要求
- `max [number]`: 属性最大长度要求
- `is [number]:` 属性的确切长度
- `on [string|array]`: 指定验证的方法 (默认为 ['create', 'update'])
- `message [string]`: 验证失败给用户的提示信息

##### 例子
```
this.validatesLength('login', {min: 3});
// makes sure that the login property is at least 3 characters long


this.validatesLength('login', {max: 20});
// makes sure that the login property is not longer than 20 characters

this.validatesLength('login', {is: 3})
// makes sure that the login property is exactly 3 characters long
```

* * *

#### .validatesConfirmed
`validatesConfirmed(property, param, options)`

设置验证确保属性已被确认

##### property
- `property [string]`: 验证的属性名

##### param
- `param [string]`: 要求匹配的参互

##### options
- `on [string|array]`: 指定验证的方法 (默认为 ['create', 'update'])
- `message [string]`: 验证失败给用户的提示信息

##### 例子
```
this.validatesConfirmed('password', 'confirmPassword');
// confirms that password and confirmPassword are equal
```

* * *

#### .validatesWithFunction
`validatesWithFunction(property, fn, options)`

设置验证确保属性已被确认

##### property
- `property [string]`: 验证的属性名

##### fn
- `fn [function]`: 一个返回真假的函数。该函数传递两个参数:属性值，以及一个从模型实例属性到属性值的映射。

##### options
- `on [string|array]`: 指定验证的方法 (默认为 ['create', 'update'])
- `message [string]`: 验证失败给用户的提示信息

##### 例子
```
this.validatesWithFunction('password', function (val, params) {
      // Something that returns true or false
      return val.length > 0;
});
// 使用函数来判断密码长度是否大于0
```

* * *

#### .hasOne
`hasOne(model)`

在两个模型之间建立一对一关系。

##### model
- `model [string]`: 当前模型存在参数模型的名字

##### 例子
```
this.hasOne('Profile');
// sets up a has one relationship
// (something) -> has one -> profile
```

* * *

#### .hasMany
`hasMany(model)`

在当前模型与其它模型之间建立一对多的关系

##### model
- `model [string]`: the pluralized name of the model that this model has many of.

##### 例子
```
this.hasMany('Friends');
// sets up a has many relationship
// (something) -> has many -> friends
```

* * *

#### .belongsTo
`belongsTo(model)`

在该模型与其它模型之间建立隶属关系。隶属关系通常跟has-one或者has-many是反的。注意，这不是必需的 —— 关联是单向的。

##### model
- `model [string]`: 当前模型隶属于参数所传模型的唯一名称。

##### example
```
this.belongsTo('User');
// sets up a belongs-to relationship
// (something) -> belongs to -> a user
```

* * *

#### .adapter
`this.adapter`

为模型定义数据库适配

##### 例子
```
this.adapter = 'mongo';
// 使用mongo作为该模型的数据库


this.adapter = 'riak'


this.adapter = 'postgres'


this.adapter = 'memory'
```

* * *

#### instance

实例方法也可以在模型定义中定义。

##### 例子
```
var User = function () {
...
  this.someMethod = function () {
    // Do some stuff
  };
  // 在该模型的每个实例中设置一个someMethod方法
...
};
```

* * *

#### .isValid
`isValid()`

如果模型实例通过所有验证返回真，否则返回假。

##### 例子
```
user.isValid()
```

* * *

#### .save
`save(fn)`

将实例保存到数据库。

##### fn
- `fn [function]`: 保存完成的回调方法

##### 例子
```
user.save(function (err, data) {
// do things
});
// saves the user then calls the callback function
```

* * *

#### .updateProperties
`updateProperties(properties)`

更新模型的属性，并声明它们是有效的;这个方法不会调用实例上的save。

##### properties
- `properties [object]`: 一个键名是属性名、键值是设置的属性值的对象。

##### 例子
```
user.updateProperties({
  login: 'alerxst'
});
// 验证并更新login属性
```

#### .add
`.add{target_model_name}( instance )`

如果一个于其它模型建立了一对多的关系，你可以使用该方法将一个模型的实例添加到它的父模型。

##### target_model_name
- 你想要添加的模型名

##### instance
- `instace [modelInstance]`: 添加的实例

##### 例子
```
var user = geddy.model.User.create(userParams);
var post = geddy.model.Post.create(postParams);
user.addPost(post);
```

#### .set
`.set{target_model_name}( instance )`

如果一个于其它模型建立了一对一的关系，你可以使用该方法将一个模型的实例添加到它的父模型。

##### target_model_name
- 你想要添加的模型名

##### instance
- `instace [modelInstance]`: 设置的实例

##### example
```
var user = geddy.model.User.create(userParams);
var account = geddy.model.Account.create(accountParams);
user.setAccount(account);
```

#### .get
`.get{target_model_name}( fn )`

如果一个于其它模型建立了一对一的关系，你可以使用该方法将一个模型的实例添加到它的父模型。

##### target_model_name
- `hasMany`: 你想要得到的集合的复数名
- `hasOne`: 你想要得到的模型的唯一名称

##### fn
- `fn [function]`: 一旦检索到模型，就会调用该函数。

##### 例子
```
var user = geddy.model.User.create(params);

// hasOne
user.getAccount(function (err, account) {
  // do stuff with the user’s account
});

// hasMany
user.getPosts(function (err, posts) {
  // do stuff with the user’s posts
});
```

* * *

#### static

静态方法可以通过在模型定义对象上创建方法来添加。

```
var User = function () {
  this.property('login', 'string', {required: true});
  this.property('password', 'string', {required: true});
};

User.findByLogin = function (login, callback) {
  User.all({login: login}, callback);
}
```

* * *

#### .create
`create(params)`

创建一个新的模型实例并返回。

##### params
- `params [object]`: 键值为模型属性的一个对象

##### example
```
var params = {
  login: 'alex'
, password: 'lerxst'
, lastName: 'Lifeson'
, firstName: 'Alex'
};
var user = User.create(params);
```

* * *

#### .first
`first(query, options, fn)`

使用 `first` 方法来查找唯一项。可以传递一个id,或者一个对象文字形式的查询参数。在查询的情况下，根据您指定的任何类型，它将返回匹配的第一项。

##### query [string]
- `query [string]`: 如果查询是字符串，假定它就是一个id

##### query [object]
- `query [object]`: 如果查询是一个对象，它将被解析成一个查询对象。

##### 例子
```
User.first('sdfs-asd-1', function (err, user) {
  // do stuff with user
});


User.first({login: 'alerxst'}, function (err, user) {
  // do stuff with user
});
```

* * *

#### .all
`all(query, options, fn)`

使用 `all` 方法来查找系列内容。 传递一个对象文字形式的查询参数，该参数的每一个键名是一个要匹配的字段，键值既可以是一个简单的比较（等于），也可以是一个对象形式（键名是对象形式的比较运算符，键值是用于比较的值）。

##### query [object]
- `query [object]`: 如果参数是一个对象，将被解析为一个查询对象。

##### options
- `sort [object]`: 每个键名是一个属性名，键值既可以是 `asc` ，也可以是 `desc`.
- `includes [array]`: 使用sql适配，你可以一个模型关系名的数组来加载。

##### 例子
```
User.all({location: 'san francisco'}, function (err, users) {
  // do stuff with users
});


User.all({location: 'san francisco'}, {sort: {createdAt: 'desc'}}, function (err, users) {
  // do stuff with users
});

// Eager-load associations of this model. (Only works on SQL adapters.)
User.all({location: 'san francisco'}, {includes: ['posts']}, function (err, users) {
  // do stuff with users - each "user" will have a "posts" property eager-loaded from the DB
});
```

* * *

#### .remove
`remove(id, fn)`

根据id来移除数据库中的一个实例。

##### id
- `id [string]`: 将要被移除的id的实例

##### 例子
```
User.remove('abc-123', function (err, data) {
  // do something now that it's removed.
});
```

`remove(condition, fn)`

根据条件来从数据库中移除实例

##### condition
- `condition [object]`: 将要被移除的查询条件的实例

##### 例子
```
User.remove({state: "inactive"}, function (err, data) {
  // do something now that it's removed.
});
```

* * *

#### queries

模型使用一个简单的api来查找及排序。再则，它使用一个大家惯用的类似orm来查询记录。唯一的不同是模型所使用的api是异步的（众所周知我们使用的是nodejs库）。

##### 比较运算符
- `eql`: equal to（等于）
- `ne`: not equal to（不等于）
- `gt`: greater than（大于）
- `lt`: less than（小于）
- `gte`: greater than or equal（大于或等于）
- `lte`: less than or equal（小于或等于）
- `like`: like （像）

简单的查询类似于 'eql' ，`{foo: 'bar'}` 等价于 `{foo: {eql: 'bar'}}` 。

##### 合并查询
模型支持使用or及用not实现否定查询的合并查询。

使用关键字 'or' 来执行 'or'查询，以及一组查询对象来表示每一组可选条件。

简单使用 'not' 来实现否定查询，其键值是否定查询条件。

##### 例子
```javascript
{foo: 'BAR', bar: {ne: null}}
// Where "foo" is 'BAR' and "bar" is not null

{foo: {'like': 'B'}}
// Where "foo" begins with 'B'

{foo: {lt: 2112}, bar: 'BAZ'}
// Where foo is less than 2112, and bar is 'BAZ'

{or: [{foo: 'BAR'}, {bar: 'BAZ'}]}
// Where "foo" is 'BAR' OR "bar" is 'BAZ'

{or: [{foo {ne: 'BAR'}}, {bar: null}, {baz: {lt: 2112}}]}
// Where "foo" is not 'BAR' OR "bar" is null OR "baz" is less than 2112

{not: {foo: 'BAR', bar: 'BAZ'}}
// Where NOT ("foo" is 'BAR' and "bar" is 'BAZ')

{not: {foo: 'BAZ', bar: {lt: 1001}}}
// Where NOT ("foo" is 'BAZ' and "bar" is less than 1001)

{or: [{foo: {'like': 'b'}}, {foo: 'foo'}], not: {foo: 'baz'}}
// Where ("foo" is like 'b' OR "foo" is 'foo') and NOT "foo" is 'baz'
```

* * *

#### events

不论是模型控制器还是模型实例都是事件源。当在模型实例的 create/update/remove 生命周期内都会产生事件。在正常情况下，简单命名的事件【译者注：这里为不带before前缀的事件】在事件执行完之后被解绑，理所当然，带 'before' 前缀的事件发生在之前。

模型的构造函数有以下事件：

 - beforeCreate
 - create
 - beforeValidate
 - validate
 - beforeUpdateProperties
 - updateProperties
 - beforeSave (new instances, single and bulk)
 - save (new instances, single and bulk)
 - beforeUpdate (existing single instances, bulk updates)
 - update (existing single instances, bulk updates)
 - beforeRemove
 - remove

模型实例有以下事件：

 - beforeUpdateProperties
 - updateProperties
 - beforeSave
 - save
 - beforeUpdate
 - update

* * *
