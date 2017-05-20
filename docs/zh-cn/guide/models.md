当前模型实现了以下适配：

* Postgres
* MySQL
* SQLite
* Riak
* MongoDB
* LevelDB
* In-memory
* Filesystem

#### 定义模型

Model uses a pretty simple syntax for defining a model. (It should look familiar
to anyone who has used an ORM like ActiveRecord, DataMapper, Django's models, or
SQLAlchemy.)
模型使用相当简单的语法来定义。（对于使用过类似ActiveRecord, DataMapper, Django's models, 或者
SQLAlchemy等ORM的人来说，看起来有种似曾相识的感觉）

```javascript
var User = function () {
  this.property('login', 'string', {required: true});
  this.property('password', 'string', {required: true});
  this.property('lastName', 'string');
  this.property('firstName', 'string');

  this.validatesPresent('login');
  this.validatesFormat('login', /[a-z]+/, {message: 'Subdivisions!'});
  this.validatesLength('login', {min: 3});
  this.validatesConfirmed('password', 'confirmPassword');
  this.validatesWithFunction('password', function (s) {
      // Something that returns true or false
      return s.length > 0;
  });

  // Can define methods for instances like this
  this.someMethod = function () {
    // Do some stuff
  };
};

// Can also define them on the prototype
User.prototype.someOtherMethod = function () {
  // Do some other stuff
};

User = model.register('User', User);
```

##### 简短语法

你可以在一个方法里使用defineProperties方法来设计模型属性：

```javascript
var User = function () {
  this.defineProperties({
    login: {type: 'string', required: true}
  , password: {type: 'string', required: true}
  , lastName: {type: 'string'}
  , firstName: {type: 'string'}
  });
}
```

##### 数据类型

模型支持以下数据类型：

* string
* text
* number
* int
* boolean
* date
* datetime
* time
* object

#### 创建实例

创建一个模型实例相当简单：

```javascript
var params = {
  login: 'alex'
, password: 'lerxst'
, lastName: 'Lifeson'
, firstName: 'Alex'
};
var user = User.create(params);
```

#### 验证

验证提供了一个很好的API来确保您的数据项处于良好的状态。当一个字段是“有效的”时，这意味着它的数据符合所有的标准。你可以指定某些字段必须达到一定的长度要求，或者满足你想要设定的任何其他特定的标准。

以下是一些支持验证的方法：

 * validatesPresent -- 确保属性存在
 * validatesAbsent -- 确保属性不存在
 * validatesLength -- 确保最大、最小或者确切长度
 * validatesFormat -- 用正则验证
 * validatesConfirmed -- 验证匹配另一个命名参数
 * validatesWithFunction -- 使用任意函数来验证

###### 一般选项

使用'message'选项，当验证失败时，你可以定制一个错误消息：

```javascript
var Zerb = function () {
  this.property('name', 'string');
  this.validatesLength('name', {is: 3, message: 'Try again, gotta be 3!'});
};
```

通过传递一个'on'选项，你可以决定何时来验证

```javascript
var User = function () {
  this.property('name', 'string', {required: false});
  this.property('password', 'string', {required: false});

  this.validatesLength('name', {min: 3, on: ['create', 'update']});
  this.validatesPresent('password', {on: 'create'});
  this.validatesConfirmed('password', 'confirmPassword', {on: 'create'});
};

// Name validation will pass, but password will fail
myUser = User.create({name: 'aaa'});

```

默认在'create'和'update'方法中都会进行验证：

 * `create` - validates on <MyModelDefinition>`.create`
 * `update` - validates on <myModelInstance>`.updateProperties`

除了create和update之外，您还可以定义定制的验证场景。(有一个内置的自定义'reify'场景用于当实例化时从你的数据储存中剥离。这种情况发生在“first”和“all”查询方法。[译者注：默认生成的controllers里都有调用模型里的first、all方法])

```javascript
// Force validation with the `reify` scenario, ignore the too-short name property
myUser = User.create({name: 'aa'}, {scenario: 'reify'});

// You can also specify a scenario with these methods:
// Enforce 'create' validations on a fetch -- may result in invalid instances
User.first(query, {scenario: 'create'}, cb);
// Do some special validations you need for credit-card payment
User.updateProperties(newAttrs, {scenario: 'creditCardPayment'});
```

##### 验证错误

任何按字段输入的验证错误都将显示在实例的'errors'属性中。实例有一个`isValid`方法,该方法返回一个布尔值
指示该实例是否有效。


```javascript
// Leaving out the required password field
var params = {
  login: 'alex'
};
var user = User.create(params);

// Prints 'false'
console.log(user.isValid());
// Prints 'Field "password" is required'
console.log(user.errors.password);
```

#### 保存

在创建一个实例，调用`save`方法之后，该方法执行一个node规范的回调，并传入参数(err, data)

```javascript
if (user.isValid()) {
  user.save(function (err, data) {
    if (err) {
      throw err;
    }
    console.log('New item saved!');
  });
}
```

#### 更新

使用`updateProperties`方法来更新在实例中经过验证之后的值，然后在实例中调用`save`方法。

```javascript
user.updateProperties({
  login: 'alerxst'
});
if (user.isValid()) {
  user.save(function (err, data) {
    if (err) {
      throw err;
    }
    console.log('Item updated!');
  });
}
```

#### 生命周期事件

Both the base model 'constructors,' and model instances are EventEmitters. They
emit events during the create/update/remove lifecycle of model instances. In all
cases, the plain-named event is fired after the event in question, the
'before'-prefixed event, of course happens before.


基本模型的'constructors',和模型实例都是EventEmitters。它们在模型实例的 create/update/remove 生命周期中引出事件。在所有情况下,plain-named事件在事件执行之后就解绑了。当然了，带'before'前缀的事件，肯定在事件之前触发。

带模型的'constructor'附带以下事件：

 * beforeCreate
 * create
 * beforeValidate
 * validate
 * beforeUpdateProperties
 * updateProperties
 * beforeSave (new instances, single and bulk)
 * save (new instances, single and bulk)
 * beforeUpdate (existing single instances, bulk updates)
 * update (existing single instances, bulk updates)
 * beforeRemove
 * remove

Model-item 实例附带以下事件：

 * beforeUpdateProperties
 * updateProperties
 * beforeSave
 * save
 * beforeUpdate
 * update

Model-item 也有以下生命周期方法：

 * afterCreate
 * beforeValidate
 * afterValidate
 * beforeUpdateProperties
 * afterUpdateProperties
 * beforeSave
 * afterSave
 * beforeUpdate
 * afterUpdate

如果定义了以下方法，将在合适的时机被调用：

```
var User = function () {
  this.property('name', 'string', {required: false});

  // Lowercase the name before validating
  this.beforeValidate = function () {
    // `this` will refer to the model instance
    this.name = this.name.toLowerCase();
  };
};
```

#### 关联

模型支持很多关联：包含 hasMany/belongsTo 和 hasOne/belongsTo。例如，你用单个`Profile`创建了一个`User`模型，以及有潜在的许多`Accounts`:

```javascript
var User = function () {
  this.property('login', 'string', {required: true});
  this.property('password', 'string', {required: true});
  this.property('confirmPassword', 'string', {required: true});

  this.hasOne('Profile');
  this.hasMany('Accounts');
};
```

`Book`隶属于`Author`模型可以这样写：


```javascript
var Book = function () {
  this.property('title', 'string');
  this.property('description', 'text');

  this.belongsTo('Author');
};
```

通过调用'set'单一的宿主模型添加`hasOne`关联（这里是`setProfile`）。通过使用'get'单一的宿主模型重新获取关联（这里是`getProfile`）。请看下面的例子：

```javascript
var user = User.create({
  login: 'asdf'
, password: 'zerb'
, confirmPassword: 'zerb'
});
user.save(function (err, data) {
  var profile;
  if (err) {
    throw err;
  }
  profile = Profile.create({});
  user.setProfile(profile);
  user.save(function (err, data) {
    if (err) {
      throw err;
    }
    user.getProfile(function (err, data) {
      if (err) {
        throw err;
      }
      console.log(profile.id ' is the same as ' + data.id);
    });
  });
});
```

通过调用'add'单一的宿主模型设置`hasMany`关联（这里是`addAccount`）。过使用'get'单一的宿主模型重新获取关联（这里是`getAccounts`）。如下例：


```javascript
var user = User.create({
  login: 'asdf'
, password: 'zerb'
, confirmPassword: 'zerb'
});
user.save(function (err, data) {
  if (err) {
    throw err;
  }
  user.addAccount(Account.create({}));
  user.addAccount(Account.create({}));
  user.save(function (err, data) {
    if (err) {
      throw err;
    }
    user.getAccounts(function (err, data) {
      if (err) {
        throw err;
      }
      console.log('This number should be 2: ' + data.length);
    });
  });
});
```


`belongsTo`关联跟`hasOne`一样被创建：通过调用'set'单一的宿主模型添加关联（这里是`setAuthor`）。通过使用'get'单一的宿主模型重新获取关联（这里是`getAuthor`）。如下例：

```javascript
var book = Book.create({
  title: 'How to Eat an Entire Ham'
, description: 'Such a poignant book. I cried.'
});
book.save(function (err, data) {
  if (err) {
    throw err;
  }
  book.setAuthor(Author.create({
    familyName: 'Neeble'
  , givenName: 'Leonard'
  }));
  book.save(function (err, data) {
    if (err) {
      throw err;
    }
    book.getAuthor(function (err, data) {
      if (err) {
        throw err;
      }
      console.log('This name should be "Neeble": ' + data.familyName);
    });
  });
});
```

##### 'Through' 关联

'Through'关联允许与第三方模型*through*关联。一个团队通过会员关系关联会员是一个例子。


```javascript
var Player = function () {
  this.property('familyName', 'string', {required: true});
  this.property('givenName', 'string', {required: true});
  this.property('jerseyNumber', 'string', {required: true});

  this.hasMany('Memberships');
  this.hasMany('Teams', {through: 'Memberships'});
};

var Team = function () {
  this.property('name', 'string', {required: true});

  this.hasMany('Memberships');
  this.hasMany('Players', {through: 'Memberships'});
};

var Membership = function () {
  this.belongsTo('User');
  this.belongsTo('Team');
};
```


该API通过使用`set`/`add` and `get`用于关联，用属性关联名称（而不是模型名）。例如，为团队新增成员，你可以调用`addPlayer` and `getPlayer`。

##### 命名关联

有时你需要对相同的模型做多个关联（例如，我有很多朋友和亲戚都是用户）。你可以通过命名关联来实现：

```javascript
var User = function () {
  this.property('familyName', 'string', {required: true});
  this.property('givenName', 'string', {required: true});

  this.hasMany('Kids', {model: 'Users'});
};
```

该API通过使用`set`/`add` and `get`用于关联，用属性关联名称（而不是模型名）。例如该例子中的`Kids`，你可以使用`addKid` and `getKids`方法。

#### 查询

模型使用一个简单的API来查找和分类条目。同样，对于那些使用过类似ORM来查找记录的人来说，这应该是很熟悉的。唯一的不同是这里的API是异步的（因为这里是NodeJS库）。

在每个模型控制器中，查询都是静态方法。

##### 获取单一数据

可以使用`first`方法来获取一条数据。你可以传递id，或者在表单中设置一系列查询参数。在这个参训过程中，将只返回一条与之匹配的查询记录。

```javascript
var user;
User.first({login: 'alerxst'}, function (err, data) {
  if (err) {
    throw err;
  }
  user = data;
  console.log('Found user');
  console.dir(user);
});
```

##### 获取数据

通过使用`all`方法来获取一系列数据。将一组查询参数传递给它一个object-literal的形式，每个键都是一个用来比较的字段，以及value要么是比较的简单值(等于)，要么是一个对象,关键是比较运算符,是用于比较的值。

在SQL适配中，如果你想立即缓冲或者返回所有的结果集，你能在`all`方法之后加一个回调，或者你可以通过事件来触发获取结果集。

###### 使用回调


传递一个回调方法作为唯一的参数。回调使用正常的`(err,data)`匹配，请看下面的例子：

```javascript
var users
  , dt;

dt = new Date();
dt.setHours(dt.getHours() - 24);

// Find all the users created since yesterday
User.all({createdAt: {gt: dt}, function (err, data) {
  if (err) {
    throw err;
  }
  users = data;
  console.log('Found users');
  console.dir(users);
});
```

###### 通过事件获取结果集 (仅仅适用于SQL适配)

`all`方法返回 EventedQueryProcessor，它释放出'data','end', and 'error'事件。每个'data'事件返回单一的模型项。

注意：在`all`方法里，如果您正在监听，无需传递一个回调方法 -- 传递回调方法将使得结果集缓冲起来。如果监听结束你需要做一些事，你可以使用'end'事件。

```javascript
var users
  , dt
  , processor;

dt = new Date();
dt.setHours(dt.getHours() - 24);

// Find all the users created since yesterday
processor = User.all({createdAt: {gt: dt});
processor.on('data', function (user) {
  console.log('Found user');
  console.dir(user);
});
processor.on('error', function (err) {
  console.log('whoops');
  throw err;
});
processor.on('end', function () {
  console.log('No more users');
});
```

###### 查询案例

下面是一些调用`all`查询方法的例子：

```javascript
// Where "foo" is 'BAR' and "bar" is not null
{foo: 'BAR', bar: {ne: null}}
// Where "foo" begins with 'B'
{foo: {'like': 'B'}}
// Where foo is less than 2112, and bar is 'BAZ'
{foo: {lt: 2112}, bar: 'BAZ'}
```

##### 比较运算符

以下是当前支持的比较运算符清单：

 * eql: equal to
 * ne: not equal to
 * gt: greater than
 * lt: less than
 * gte: greater than or equal
 * lte: less than or equal
 * like: like

一个简单的string-value查询参数看起来像：'eql'. `{foo: 'bar'}`，或者这样：`{foo: {eql: 'bar'}}`

对于不区分大小写的比较，使用'nocase'选项。设置其为`true` 来干预'like'或者比较运算符，或者使用一组特定的键来达到目的。

```javascript
// Zoobies whose "foo" begin with 'b', with no case-sensitivity
Zooby.all({foo: {'like': 'b'}}, {nocase: true}, ...
// Zoobies whose "foo" begin with 'b' and "bar" is 'baz'
// The "bar" comparison will be case-sensitive, and the "foo" will not
Zooby.all({or: [{foo: {'like': 'b'}}, {bar: 'baz'}]}, {nocase: ['foo']},
```
#### 更多复杂查询

模型支持用OR和NOT来实现联合查询。

执行'or'查询,用一个'or'键使用object-literal、一个数组查询query-objects来表示每组选择条件:

```javascript
// Where "foo" is 'BAR' OR "bar" is 'BAZ'
{or: [{foo: 'BAR'}, {bar: 'BAZ'}]}
// Where "foo" is not 'BAR' OR "bar" is null OR "baz" is less than 2112
{or: [{foo {ne: 'BAR'}}, {bar: null}, {baz: {lt: 2112}}]}
```

使用'not'来实现否定查询，把'not'设置为query-object的key,否定条件为value:

```javascript
// Where NOT ("foo" is 'BAR' and "bar" is 'BAZ')
{not: {foo: 'BAR', bar: 'BAZ'}}
// Where NOT ("foo" is 'BAZ' and "bar" is less than 1001)
{not: {foo: 'BAZ', bar: {lt: 1001}}}
```

OR and NOT查询可以嵌套、内链：

```javascript
// Where ("foo" is like 'b' OR "foo" is 'foo') and NOT "foo" is 'baz'
{or: [{foo: {'like': 'b'}}, {foo: 'foo'}], not: {foo: 'baz'}}
```

#### 选项: sort, skip, limit

`all`方法在查询条件之后接受options-object可选项来实现排序, 跳过获取特定的记录集（像SQL
OFFSET），以及限制返回结果的数量。

##### 排序

通过'sort'来设置按字段键值实现排序：

```javascript
var users
// Find all the users who have ever been updated, and sort by
// creation-date, ascending, then last name, descending
User.all({updatedAt: {ne: null}}, {sort: {createdAt: 'asc', lastName: 'desc'}},
    function (err, data) {
  if (err) {
    throw err;
  }
  users = data;
  console.log('Updated users');
  console.dir(users);
});
```

##### 排序的简化语法

可以用简化语法来实现排序。默认排序是升序（'asc'），你可以设置你想要的任何定特的属性来排序（可以是一个数组的多个属性）：

```javascript
// Sort by createdAt, ascending
{sort: 'createdAt'}
// Sort by createdAt, then updatedAt, then lastName,
// then firstName -- all ascending
{sort: ['createdAt', 'updatedAt', 'lastName', 'firstName']}
```

##### 跳过及限制

'skip'选项允许你从指定的某个记录开始返回结果集。使用'limit'可以让你指定返回的数量。这两个结合使用就可以实现分页效果。

记住这两个选项假定你已把结果按预期排序。如果你在使用这些前没有排序，你只能获得随机的记录而不能得到你想要的结果。

```javascript
// Returns items 501-600
{skip: 500, limit: 100}

```

#### Eager loading of associations (仅适用于SQL适配【译者注：对于文件系统不适用】)

You can use the 'includes' option to specify second-order associations that
should be eager-loaded in a particular query (avoiding the so-called N + 1 Query
Problem). This will also work for 'through' associations.

For example, with a Team that `hasMany` Players through Memberships, you might
want to display the roster of player for every team when you display teams in a
list. You could do it like so:

```javascript
var opts = {
  includes: ['players']
, sort: {
    name: 'desc'
  , 'players.familyName': 'desc'
  , 'players.givenName': 'desc'
  }
};
Team.all({}, opts, function (err, data) {
  var teams;
  if (err) {
    throw err;
  }
  teams = data;
  teams.forEach(function (team) {
    console.log(team.name);
    team.players.forEach(function (player) {
      console.log(player.familyName + ', ' + player.givenName);
    });
  });
});
```

##### 排序结果集

注意,可以在上面的立即加载关联查询。通过在'sort'属性中传递 关联名称+属性。

In the above example, the 'name' property of the sort refers to the team-names.
The other two, 'players.familyName' and 'players.givenName', refer to the loaded
associations. This will result in a list where the teams are initially sorted by
name, and the contents of their 'players' list have the players sorted by given
name, then first name.

##### Checking for loaded associations

The eagerly fetched association will be in a property on the top-level item with
the same name as the association (e.g., Players will be in `players`).

If you have an item, and you're not certain whether an association is already
loaded, you can check for the existence of this property before doing a per-item
fetch:

```javascript
if (!someTeam.players) {
  someTeam.getPlayers(function (err, data) {
    console.dir(data);
  });
}
```

#### 适配器

可以为所有的模型指定相同的适配，也可以为每一个模型分别指定不同的适配。

像下面那样为适配器添加特定的模型：

```javascript
var adapter = model.createAdapter('postgres', {
  host: 'localhost',
  username: 'user',
  password: 'password',
  dbname: 'mydb'
});

model.User.adapter = adapter;
model.Zerb.adapter = adapter;
```

也可以定义一个默认的适配器，然后你在特定模型中重写。


```javascript
model.defaultAdapter = model.createAdapter('memory');

var postgresAdapter = model.createAdapter('postgres', {
  host: 'localhost',
  username: 'user',
  password: 'password',
  dbname: 'mydb'
});

// User model gets the defaultAdapter
model.Zerb.adapter = postgresAdapter;
```

使用Geddy的化，默认适配器可以在`/config`文件夹下的环境文件中配置。例如，使用文件系统开发，你可以在`/config/development.js`文件中如下写：

```
var config = {
  appName: 'Geddy App (development)'
, model: {
    defaultAdapter: 'filesystem'
  }
};
module.exports = config;
```
#### 配置其他数据库类型的支持

Postgresql
```
var config = {
  appName: 'Geddy App (development)'
, model: {
    defaultAdapter: 'postgres'
  }
, db: {
  postgresql: {
    port:5432,
    password:'yourPasswordHere',
    database:'databaseName',
    host:'localhost',
    user:'yourUserName'
  }
}
};

module.exports = config;
```
MySQL
```javascript
 // Using MySQL as the default, with only a MySQL DB
, model: {
    defaultAdapter: 'mysql'
  }
, db: {
    mysql: {
      host: 'localhost'
    , user: process.env.USER
    , database: process.env.USER
    , password: null
    }
  }
```
Postgres as default, with both a Postgres and Riak model
```javascript
 // Using Postgres as the default, with both Postgres and Riak
, model: {
    defaultAdapter: 'postgres'
  }
, db: {
    postgres: {
      user: process.env.USER
    , database: process.env.USER
    , password: null
    , host: null
    , port: 5432
    , ssl: true
    }
  , riak: {
      protocol: 'http'
    , host: 'localhost'
    , port: 8098
  }
}
```
(I've left out non-related configuration fields).

#### Migrations (仅适用于SQL适配)

Migrations是一种方便的方式，可以对SQL数据库数据进行更改，这是一种持续且容易的方式。它使用一个简单的JavaScript API。这意味着您不必手动编写SQL，而对数据的更改可以是独立于数据库的。

以下是migration的例子:

```javascript
var CreateUsers = function () {
  this.up = function (next) {
    var def = function (t) {
          t.column('username', 'string');
          t.column('password', 'string');
          t.column('familyName', 'string');
          t.column('givenName', 'string');
          t.column('email', 'string');
        }
      , callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.createTable('users', def, callback);
  };

  this.down = function (next) {
    var callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.dropTable('users', callback);
  };
};

exports.CreateUsers = CreateUsers;
```

以上migration会创建一个'users'表，并生成一系列string(varchar(256))数据类型的字段。

'id'、'createdAt' and 'updatedAt'字段会隐式的增加。(在数据库中会显示蛇底式
(snake-case)【译者注：与之对应的是驼峰式(camelCase)】， 例如 'created_at') 这些属性Geddy的模型会自动管理。


`up`方法作出更改（在这里是创建数据表），`down`方法恢复更改。`down`通常用于回滚不需要的更改。

##### 使用migrations设置数据库

在app项目目录下，运行`geddy jake db:init`来创建'migrations'表。你必须在使用migrations之前来做这个工作。

##### 创建migration

Migrations在你项目目录中的 db/migrations/ 文件中。文件名形式如：YYYYMMDDHHMMSS_my_migration_name.js。使用时间戳命名migration允许你执行migrations来创建数据表，即使是不同的开发者独立工作，这些也不会被覆盖。

为生成新的migration，执行生成器脚本：

```
$ geddy gen migration zerp_derp
[Added] db/migrations/20130708212330_zerp_derp.js
```
如果你打开了一个migration文件，你将会看到一个空的migration文件已经写入了如下内容：

```javascript
var ZerpDerp = function () {
  this.up = function (next) {
    next();
  };

  this.down = function (next) {
    next();
  };
};

exports.ZerpDerp = ZerpDerp;
```

##### Migrations API

`createTable(name<string>, definition<function>,
    callback<function>)`

创建一个新表。`definition`函数被用于在新表中定义字段。

```javascript
// CREATE TABLE distributors (id string PRIMARY KEY, address varchar(256),
// created_at timestamp, updated_at timestamp);
this.createTable('distributors',
    function (t) { t.column('address', 'string'); },
    function (err, data) {});
```

`dropTable(name<string>, callback<function>)`

删除已存在的数据表。

```javascript
// DROP TABLE IF EXISTS distributors;
this.dropTable('distributors', function (err, data) {});
```

`addColumn(table<string>, column<string>, datatype<string>,
    callback<function>)`

在数据表中新增一个字段。

```javascript
// ALTER TABLE distributors ADD COLUMN address varchar(30);
this.addColumn('distributors', 'address', 'string',
    function (err, data) {});
```

`removeColumn(table<string>, column<string>, callback<function>)`

在数据表中移除一个字段。

```javascript
// ALTER TABLE distributors DROP COLUMN address;
this.removeColumn('distributors', 'address',
    function (err, data) {});
```

`changeColumn(table<string>, column<string>, datatype<string>,
    callback<function>)`

把一个数据类型变为其他的类型

```javascript
// ALTER TABLE distributors ALTER COLUMN address TYPE text;
this.changeColumn('distributors', 'address', 'text',
    function (err, data) {});
```

`renameColumn(table<string>, column<string>, newColumn<string>,
    callback<function>)`

重命名

```javascript
// ALTER TABLE distributors RENAME COLUMN address TO city;
this.renameColumn('distributors', 'address', 'city',
    function (err, data) {});
```

##### Migrations脚手架

使用Geddy脚手架生成器也能生成合适的migration文件。

例如使用以下生成器命令：

```
$ geddy gen scaffold frang asdf:string qwer:int
```

你能使用以下的migration给模型新建相应的表格：

```javascript
var CreateFrangs = function () {
  this.up = function (next) {
    var def = function (t) {
          t.column('asdf', 'string');
          t.column('qwer', 'int');
        }
      , callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.createTable('frang', def, callback);
  };

  this.down = function (next) {
    var callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.dropTable('frang', callback);
  };
};

exports.CreateFrangs = CreateFrangs;
```

##### Migrations FAQ

Q: 如果我正使用Geddy-Passport来做验证, 我如何创建migrations?

A: 大家执行 `auth`生成器也能安装migrations，但如果你之前已经安装auth，你可以从这里获取migrations：
https://github.com/mde/geddy-passport/tree/master/db/migrations. 这里将创建'users' and 'passport'数据表，并恰当的关联起来。

Q: 我如何用migrations实现关联?

A: 现在，对于CLI生成器中的migrations没有得到很好的支持。您必须在运行他们之前，在migrations中添加适当的database-column类目。本质上，四个步骤:1。运行CLI脚手架生成器来创建您的模型定义文件，以及您的migration文件。2。添加关联(如`this hasMany`)到你的模型定义文件。3。添加适当的database-column类目进入您的migration文件。4。运行migration来创建您的数据库表。

以下是一个运用a hasMany and a belongsTo，来自geddy-passport的例子。 我们以用户模型来距离:

```javascript
var User = function () {
  this.defineProperties({
    username: {type: 'string', required: true},
    password: {type: 'string', required: true},
    familyName: {type: 'string', required: true},
    givenName: {type: 'string', required: true},
    email: {type: 'string', required: true}
  });

  this.validatesLength('username', {min: 3});
  this.validatesLength('password', {min: 8});
  this.validatesConfirmed('password', 'confirmPassword');

  this.hasMany('Passports');
};

exports.User = User;
```
一个用户模型有很多通行证，一个通行证隶属于一个用户：

```javascript
var Passport = function () {
  this.defineProperties({
    authType: {type: 'string'},
    key: {type: 'string'}
  });

  this.belongsTo('User');
};

exports.Passport = Passport;
```

在通行证这里，需要一个'userId'属性来与之关联。以下是migration：

```javascript
var CreatePassports = function () {
  this.up = function (next) {
    var def = function (t) {
          var datatype = geddy.model.autoIncrementId ? 'int' : 'string';
          t.column('authType', 'string');
          t.column('key', 'string');
          t.column('userId', datatype); // belongsTo User
        }
      , callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.createTable('passports', def, callback);
  };

  this.down = function (next) {
    var callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.dropTable('passports', callback);
  };
};

exports.CreatePassports = CreatePassports;
```

如果你已经知道正在使用的某些ids的类型，你可以跳过'userId'数据类型的检测 -- 只需要与宿主对象相同即可。

Q: 如果我更改关联会怎样, 我需要重新执行migrations吗?

A: 你必须立刻用`addColumn` and `removeColumn`管理关联字段。在下一个版本的Geddy将会在CLI和migrations实现更好的关联。

Q: 如果我是一个老版本的Geddy项目，我怎样处理好这些模型中的migrations依赖？

A: 早期版本会新建一个独立的Geddy项目，使用生成器脚本来创建你想要的migrations。在一个空的数据库中执行这些migrations，使用你数据库提供的工具，将数据导入到数据库。


