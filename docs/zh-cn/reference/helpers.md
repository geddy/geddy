在Geddy灵活的模板系统中，你可以访问各种各样的帮助和定制帮助。

#### 自定义帮助
当你创建应用时，`helpers` 目录将被添加到 `app`目录中。当你启动服务后，该目录下的所有文件将被自动包含。

一旦导入helpers，在您的视图及整个应用中都可用。

例如，在 `app/helpers` 目录中有这么一个脚本文件：
```
exports.upperCase = function upperCase(str) {
  return str.toUpperCase();
};
```

启动我们的服务之后，在视图中我们可以这样来访问：
```
<%= upperCase("some string") %>
// => "SOME STRING"
```
所有导入的helpers对于模版来说是全局的，他们中的任何方法或变量在任何模版中都可以访问。

你也可以在controllers/models来访问，或者在你应用中任何一部分使用 `geddy.viewHelpers` 来访问。下面的例子使用我们大些字母的帮助：
```
console.log(geddy.viewHelpers.upperCase("some string"));
// => "SOME STRING"
```

##### ejs

像执行一个js函数一样在ejs中来调用一个视图帮助。

```
<%= selectTag(options, selected) %>
```

##### handlebars

使用块助手语法来调用帮助器：

```
{{#selectTag options selected}}{{/selectTag}}
```

* * *

#### urlFor
`urlFor(options<String/Object>)`

依赖提供的 `options` 返回一个url。

#####Options [String]:
- `'back'` [String] 'back' 字符串回返回历史记录中最后一个url。

#####Options [Object]:
- `relPath` [Boolean] 如果设置为true，返回相对url (默认为false)
- `protocol` [String] 使用的协议(默认: Geddy实例所使用的协议('http'默认))
- `username` [String] 在路径中包含一个用户名。需要密码，否则会被忽略
- `password` [String] 在路径中包含一个用户名。需要密码，否则会被忽略
- `subdomain` [String] 指定子域
- `domain` [String] 指定要指向的域，如果 `relPath` 为false，需要给出此项
- `host` [String] Alias for `host`
- `port` [Integer] Specify the port to connect to
- `controller` [String] Specifies the controller to use for the path
- `action` [String] Specifies the action to use for the path
- `id` [String] Specifies an ID to use for displaying specific items
- `trailingSlash` [Boolean] If true, adds a trailing slash to the end of the path/domain
- `fragment` [String] Appends a fragment to the end of the path/domain
- `anchor` [String] Alias for `fragment`

#####注释:
- 如果 `options` 是一个字符串将会原样返回, 'back' 除外。
- 添加任何其他的 `options` ，将作为URL的查询参数 

#####例子:
```
urlFor('http://google.com')
// => 'http://google.com'


urlFor({controller: 'tasks', action: 'new', host: 'somehost.com'})
// => 'http://somehost.com/tasks/new'


urlFor({controller: 'tasks', action: 'new', relPath: true})
// => '/tasks/new'


urlFor({controller: 'tasks', action: 'new', relPath: true, trailingSlash: true})
// => '/tasks/new/'


urlFor({host: 'somehost.com', protocol: 'https', username: 'username', password: 'password'})
// => 'https://username:password@somehost.com'


urlFor({controller: 'tasks', action: 'new', host: 'somehost.com', protocol: 'https'})
// => 'https://somehost.com/tasks/new'


urlFor({controller: 'tasks', action: 'edit', id: 'IwTEf55ivH', host: 'somehost.com'})
//  => 'http://somehost.com/tasks/IwTEf55ivH/edit'


urlFor({controller: 'tasks', action: 'new', host: 'somehost.com', anchor: 'submit'})
// => 'http://somehost.com/tasks/new#submit'


urlFor({controller: 'tasks', action: 'new', host: 'somehost.com', authToken: 'some_token'})
// => 'http://somehost.com/tasks/new?authToken=some_token'
```

* * *

#### contentTag
`contentTag(tag<String>, content<String>, htmlOptions<Object>)`

根据所给的 `tag` ，`content` 及所有的 `htmlOptions` 参数返回一个html元素。

#####定制 HTML 选项:
- `data`[Array] The data attribute takes an Array containing data attributes you want, when parsed they each get parsed as a full data attribute(e,g: `data: {goTo: 'google.com'}` will be `data-go-to="google.com"`).

#####Examples:
```
contentTag('p', 'this is some content')
// => '<p>this is some content</p>'


contentTag('input', 'sample value')
// => '<input value="sample value" />'


contentTag('input', 'sample value', {value: 'override sample value'})
// => '<input autofocus="autofocus" type="text" value="sample value" />'


contentTag('input', 'sample value', {type: 'text', autofocus: true})
// => '<input autofocus="autofocus" type="text" value="sample value" />'


contentTag('a', 'http://google.com')
// => '<a href="http://google.com">http://google.com</a>'


contentTag('a', 'hey there', {href: 'http://google.com'})
// => '<a href="http://google.com">hey there</a>'


contentTag('a', 'hey there', {href: 'http://google.com', data: { goTo: 'http://google.com'} })
// => '<a data-go-to="http://google.com" href="http://google.com">hey there</a>'


contentTag('a', 'hey there', {href: 'http://google.com', data_go_to: 'http://google.com'})
// => '<a data-go-to="http://google.com" href="http://google.com">hey there</a>'

```

#### selectTag
`selectTag(data<Array>, selectedOption, options<Object>)`

根据给定的 `data` 数组来创建一个html选择标签。

`data` 可以是字符串数组(用于在选项元素中使用文本和值)；或者对象，每个对象都带有 'text' 和 'value' 属性将直接映射到选项元素。该助手还将查找数组中元素的attr属性，以便在每个选项元素上使用HTML属性。

还有一种方法可以将数据集中的任意字段映射到选项元素的text/value。当您不想重复您的数据只是为了设置一个文本/值时，这是很有帮助的 —- 请参阅下面的选项。

`selectedOption` 应该是一个字符串，它的值与您想要预先选择的选项元素的值相匹配。如果选择项有多个可用的选择，您可以将一个数组传递给selecteOption，所有匹配的值都将会被选中。当多选项不可用，你传递一个数组的话，仅匹配的数组的第一个元素被选中。

`options` 是您想要在select元素本身上设置的HTML属性的列表。这是提交时需要设置的 'name ' 属性的地方。

`options` 参数可以包含两个特殊的属性: 'textField' 和 'valueField'。设置这些属性将告诉帮助器将这些属性名映射到选项元素的 'text' 和 'value' 属性。

#####例子:
```
selectTag(['geddy', 'alex', 'neil'])
// => '<select><option value="geddy">geddy</option><option value="alex">alex</option><option value="neil">neil</option></select>'

selectTag(['open', 'close'], todo.status, { class:'col-md-6', name:'status' })
// => '<select class="col-md-6" name="status"><option selected="selected" value="open">open</option><option value="close">close</option></select>'

selectTag([{value: 1, text: "Text 1"}, {value: 2, text: "Text 2"}], 2)
// => <select><option value="1">Text 1</option><option selected="selected" value="2">Text 2</option></select>

selectTag([{text: "Text 1", attrs: {value: 1, class: 'anoption', data: {thing: 'vip', rate: '0.99'}}}, {value: 2, text: "Text 2", attrs: {value: 0, data: {thing: 'basic'}}}], 2)
// => <select><option data-thing="vip" data-rate="0.99" class="anoption" value="1">Text 1</option><option data-thing="basic" selected="selected" value="2">Text 2</option></select>

selectTag([{value: 1, text: "Text 1"}, {value: 2, text: "Text 2"}], [1, 2], {multiple: true})
// => <select><option selected="selected" value="1">Text 1</option><option selected="selected" value="2">Text 2</option></select>

```

* * *

#### render
`render` 是一个仅可用在布局模版中的函数。 它渲染这样的内容： `yield` 调用的地方插入的内容。

* * *

#### partial
`partial(partialURL<String>, data<Object>)`

Partial采用partial模板的位置和数据对象的partialURL，而数据对象是用来呈现partial数据(参数等)，然后它呈现partial，并将内容放置在partial函数被调用的地方。

* * *

#### truncate 【译者注：作用类似js的substr方法，功能比其强大】
`truncate(string<String>, options<Integer/Object>)`

Truncates 在一个指定的 `length` 之后给予一个 `string`。如果 `string` 比 `length`长，最后的字符串会被 `omission` 截取掉。

#####Options [整形]:
- 如果 `options` 是一个整形，它假定是想要的 `length`

#####Options [Object]:
- `length [Integer]` 输出字符串的长度(默认: 30)
- `len [Integer]`  `length` 的别名
- `omission [String]` 超出长度的字符表现形式(默认: '...')
- `ellipsis [String]` `omission` 的别名
- `seperator [String/RegExp]` 在最近的 `seperator` 来截取文本【译者注：如果多出，靠前截取】

#####警告:
- 请注意，截断HTML元素可能会导致返回错误的HTML。如果你想要安全的HTML截断，请看 `truncateHTML`

#####例子:
```
truncate('Once upon a time in a world', {length: 10})
// => 'Once up...'


truncate('Once upon a time in a world', {length: 20, omission: '...(continued)'})
// => 'Once u...(continued)'


truncate('Once upon a time in a world', {length: 15, seperator: /\s/})
// => 'Once upon a...'
// Normal Output: => 'Once upon a ...'


truncate('Once upon a time in a world', {length: 15, seperator: ' '})
// => 'Once upon a...'
// Normal Output: => 'Once upon a ...'


truncate('<p>Once upon a time</p>', {length: 20})
// => '<p>Once upon a ti...'
// 【译者注：这里返回错误的html】
```

* * *

#### truncateHTML
`truncateHTML(string<String>, options<Integer/Object>)`

作用跟Truncates类似，最大的区别是对html元素的截取返回不一样。

#####Options [Object]:
- `once`[Boolean] 如果为真，仅仅在第一个html元素的第一个字符串会被截断(默认为 false)

#####注意:
- `truncate` 可用的参数， 对于 `truncateHTML` 同样适用
- HTML元素不包含在截断的长度内
- HTML元素不会被截断，因此返回的值肯定是安全的

#####例子:
```
truncateHTML('<p>Once upon a time in a world</p>', {length: 10})
// => '<p>Once up...</p>'


truncateHTML('<p>Once upon a time <small>in a world</small></p>', {length: 10})
// => '<p>Once up...<small>in a wo...</small></p>'


truncateHTML('<p>Once upon a time <small>in a world</small></p>', {length: 10, once: true})
// => '<p>Once up...<small>in a world</small></p>'
```

* * *

#### imageLink
`imageLink(source<String>, link<String/Object>, imageOptions<Object>, linkOptions<Object>)`

顾名思义，返回一个根据 `linkOptions` 参数生成的链接，其链接显示的内容是根据 `imageOptions` 生成的的图片。

#####注意:
- `linkto` 通常用于后端，因此任何 `linkOption` 都可以用于 `linkTo`
- `imageTag` 通常也用于后端， 因此任何 `imageOptions` 都可以用于 `imageTag`

#####例子:
```
imageLink('images/google.png', 'http://google.com')
// => '<a href="http://google.com"><img alt="images/google.png" src="images/google.png" /></a>'


imageLink('images/google.png', 'http://google.com', {alt: ''}
// => '<a href="http://google.com"><img alt="" src="images/google.png" /></a>'


imageLink('images/google.png', 'http://google.com', {alt: '', size: '40x50'})
// => '<a href="http://google.com"><img alt="" height="50" src="images/google.png" width="40" /></a>'
```

* * *

#### imageTag
`imageTag(source<String>, htmlOptions<Object>)`

返回一个src为 `source` 的img标签，并附上所有的 `htmlOptions`

#####定制 HTML 选项:
- `size`[String] 包含宽高的字符串 "{width}x{height}"(e,g: '40x50') 或者带一个是整形的唯一参数的字符串 "{size}"(例如: '40') 第一个结果是 "height='50' width='40'"，第二个结果是宽高被设置为相同值 _Note_: 如果格式错误，会被忽略

#####Examples:
```
imageTag('images/google.png')
// => '<img alt="images/google.png" src="images/google.png" />'


imageTag('images/google.png', {alt: ''})
// => '<img alt="" src="images/google.png" />'


imageTag('images/google.png', {alt: '', size: '40x50'})
// => '<img alt="" height="50" src="images/google.png" width="40" />'


imageTag('images/google.png', {alt: '', size: 'a string'})
// => '<img alt="" src="images/google.png" />'
```

* * *

#### styleLink
`styleLink(source<String>, htmlOptions<Object>)`

用 `htmlOptions` 所带参数，创建一个link标签

#####例子:
```
styleLink('/css/styles.css')
// => '<link href="/css/style.css" />'


styleLink('/css/styles.css', {rel: 'stylesheet'})
// => '<link href="/css/style.css" rel="stylesheet" />'
```

* * *

#### scriptLink
`scriptLink(source<String>, htmlOptions<Object>)`

用 `htmlOptions` 所带参数，创建一个script标签

#####例子:
```
scriptLink('/js/script.js')
// => '<script src="/js/script.js"></script>'


scriptLink('/js/script.js', {type: 'text/javascript'})
// => '<script src="/js/script.js" type="text/javascript"></script>'
```

* * *

#### linkTo
`linkTo(content<String>, options<String/Object>, htmlOptions<Object>)`

用 `options` 所带参数创建一个a标签, 根据所提供的 `content` 和 `htmlOptions` 返回一个a锚点标签。

#####注意:
- 如果你不想在 `content` 中转义html实体, 设置 `_escapeContent` 为 false.

#####例子:
```
linkTo('some content', 'http://google.com')
// => '<a href="http://google.com">some content</a>'


linkTo('some content', 'http://google.com', {data: {goTo: 'http://google.com'}})
// => '<a data-go-to="http://google.com" href="http://google.com">some content</a>'

linkTo('Google<sup>TM</sup>', 'http://google.com', {_escapeContent: false})
// => '<a href="http://google.com">Google<sup>TM</sup></a>'

_escapeContent
```

#### displayFlash
`displayFlash()`

Displays a small banner automatically for items in the session flash -- e.g., if
in your action you call `this.flash.error('Something went wrong.');` when the
page renders, it will display an error banner with that text.
在会话中自动显示一个小的横幅。 -- 例如，如果在脚本调用`this.flash.error('出错了');` 当页面呈现时，它将显示一条带有 '出错了' 的错误横幅。

支持基于flash的类型有 `error`, `success` 以及 `info`

* * *
