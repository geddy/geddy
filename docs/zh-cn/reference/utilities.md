Geddy提供了很多有用的实用工具来使得开发更简单。通过npm下载`utilities`即可使用。通过 `geddy` 全局对象，所有的实用工具都可用（例如： `geddy.array.humanize()` ）。

* * *

#### xml

#### setIndentLevel
`setIndentLevel(level<Number>)`

SetIndentLevel 实用 XML.stringify 改变缩紧级别并返回它。

#####例子
```
setIndentLevel(6)
// => 6
```

* * *

#### stringify
`stringify(obj<Object>, opts<Object>)`

#####Options
- `whitespace` [Boolean] 在xml之后不插入缩进及新行(Default: true)
- `name` [String] 使用自定义明作为全局命名空间(Default: typeof obj)
- `fragment` [Boolean] 为真的话，头部片度被加入到顶部(Default: false)
- `level` [Number] 从输出中移除很多级别(Default: 0)
- `arrayRoot` [Boolean] (Default: true)

Stringify 根据给定的 `obj` 返回一个xml表示。

#####例子
```
stringify({user: 'name'})
// => '<?xml version="1.0" encoding="UTF-8"?>\n<object>\n    <user>name</user>\n</object>\n'

stringify(['user'])
// => '<?xml version="1.0" encoding="UTF-8"?>\n<strings type="array">\n    <string>user</string>\n</strings>'

stringify({user: 'name'}, {fragment: true})
// => '<object>\n<user>name</user>\n</object>\n'
```

* * *

#### array

#### humanize
`humanize(array<Array>)`

用可读的格式创建包含数组元素的字符串。

#####例子
```
humanize(["array", "array", "array"])
// => "array, array and array"

humanize(["array", "array"])
// => "array and array"
```

* * *

#### include
`include(array<Array>, item<Any>)`

检查 `item` 是否被包含在 `array` 中

#####例子
```
include(["array"], "array")
// => true

include(["array"], 'nope')
// => false

include(["array", false], false)
// => true
```

* * *

#### uri

#### getFileExtension
`getFileExtension(path<String>)`

获取一个路径的文件扩展并返回。

#####例子
```
getFileExtension('users.json')
// => 'json'
```

* * *

#### paramify
`paramify(obj<Object>, o<Object>)`

#####Options
- `consolidate` [Boolean] 从可以返回的元素中获取值(Default: false)
- `includeEmpty` [Boolean] 在字符串中包含所有元素的键，即使是空值(Default: false)
- `snakeize` [Boolean] 把参数名从驼峰式编委蛇底式(Default: false)
- `escapeVals` [Boolean] 从xml实体中剥离值(Default: false)

把js数组对象转换为查询字符串 (key=val&key=val)。

#####例子
```
paramify({username: 'user', token: 'token', secret: 'secret'})
// => 'username=user&token=token&secret=secret'

paramify({username: 'user', auth: ['token', 'secret']}, {conslidate: true})
// => 'username=user&auth=token&auth=secret'

paramify({username: 'user', token: ''}, {includeEmpty: true})
// => 'username=user&token='

paramify({username: 'user', token: '<token'}, {escapeVals: true})
// => 'username=user&token=%26lt%3Btoken'
```

* * *

#### objectify
`objectify(str<String>, o<Object>)`

#####Options
- `consolidate` [Boolean] 转换多个相同实例(Default: true)

把查询字符串转为对象 (key=val&key=val) 

#####例子
```
objectify('name=user')
// => {name: 'user'}

objectify('name=user&name=user2')
// => {name: ['user', 'user2']}

objectify('name=user&name=user2', {consolidate: false})
// => {name: 'user2'}
```

* * *

#### EventBuffer

#### proxyEmit
`proxyEmit(name<String>, args<Array>)`

通过名称和参数发出一个事件，或者在没有设置出口的情况下将其添加到缓冲区中

#####例子
```
proxyEmit("close")
// => undefined

proxyEmit("data", "some content here")
// => undefined
```

* * *

#### emit
`emit(name<String>, args<Array>)`

通过名称和参数发出一个事件

#####例子
```
emit("close")
// => undefined

emit("data", "some content here")
// => undefined
```

* * *

#### sync
`sync(outlet<Object>)`

刷新缓冲区，并继续将新事件输送到出口

#####例子
```
sync(new EventEmitter())
// => undefined
```

* * *

#### SortedCollection

#### addItem
`addItem(key<String>, val<Any>)`

在集合中添加一个新的key/value

#####例子
```
addItem('testA', 'AAAA');
// => 'AAAA'

addItem('testV', 'VVVV');
// => 'VVVV'
```

* * *

#### getItem
`getItem(p<String/Number>)`

检索作为键或索引的给定标识符的值

#####例子
```
getItem('testA');
// => 'AAAA'

getItem(1);
// => 'VVVV'
```

* * *

#### setItem
`setItem(p<String/Number>, val<Any>)`

在集合中使用给定的val设置项目，并覆盖存在的条目

#####例子
```
setItem('testA', 'aaaa');
// => 'aaaa'

setItem(1, 'vvvv');
// => 'vvvv'
```

* * *

#### removeItem
`removeItem(p<String/Number>)`

根据已知识别移除项目。

#####例子
```
removeItem('testA')
// => true

removeItem(3)
// => false
```

* * *

#### getByKey
`getByKey(key<String>)`

根据给定键值检索其值

#####例子
```
getByKey('testA');
// => 'AAAA'

getByKey('testV');
// => 'VVVV'
```

* * *

#### setByKey
`setByKey(key<String>, val<Any>)`

根据给定的值设置一个项目。

#####例子
```
setByKey('testA', 'aaaa');
// => 'aaaa'

setByKey('testV', 'vvvv');
// => 'vvvv'
```

* * *

#### removeByKey
`removeByKey(key<String>)`

根据给定键值移除一个集合

#####例子
```
removeByKey('testA')
// => true

removeByKey('testC')
// => false
```

* * *

#### getByIndex
`getByIndex(ind<Number>)`

根据给定的索引检索其值

#####例子
```
getByIndex(0);
// => 'AAAA'

getByIndex(1);
// => 'VVVV'
```

* * *

#### setByIndex
`setByIndex(ind<Number>, val<Any>)`

根据给定的索引重制其值

#####例子
```
setByIndex(0, 'aaaa');
// => 'aaaa'

setByIndex(1, 'vvvv');
// => 'vvvv'
```

* * *

#### removeByIndex
`removeByIndex(ind<Number>)`

根据索引移除一个集合选项

#####Examples
```
removeByIndex(0)
// => true

removeByIndex(3)
// => false
```

* * *

#### hasKey
`hasKey(key<String>)`

在集合中检测一个键名是否存在

#####例子
```
hasKey('testA')
// => true

hasKey('testC')
// => false
```

* * *

#### hasValue
`hasValue(val<Any>)`

根据给定的值检测一个键值项在集合中是否存在。

#####例子
```
hasValue('aaaa')
// => true

hasValue('cccc')
// => false
```

* * *

#### allKeys
`allKeys(str<String>)`

将所有的键连接到字符串中

#####例子
```
allKeys(", ")
// => "testA, testV"
```

* * *

#### replaceKey
`replaceKey(oldKey<String>, newKey<String>)`

将所有的键连接到字符串中

#####Examples
```
replaceKey("testV", "testC")
// => undefined
```

* * *

#### insertAtIndex
`insertAtIndex(ind<Number>, key<String>, val<Any>)`

在集合中特殊的索引位置插入一个key/value

#####例子
```
insertAtIndex(1, "testB", "bbbb")
// => true
```

* * *

#### insertAfterKey
`insertAfterKey(refKey<String>, key<String>, val<Any>)`

在集合中给定的引用键之后插入一个key/value项。

#####例子
```
insertAfterKey("testB", "testB1", "b1b1b1b1b1b1")
// => true
```

* * *

#### getPosition
`getPosition(key<String>)`

检索键名的索引

#####例子
```
getPosition("testA")
// => 0

getPosition("testB1")
// => 2
```

* * *

#### each
`each(func<Function>, opts<Object>)`

#####Options
- `keyOnly` [Boolean] 只给函数键
- `valueOnly` [Boolean] 只给函数值

通过集合轮询并调用给定方法

#####例子
```
each(function (val, key) {
  console.log("Key: " + key + " Value: " + val);
})

each(function (key) {
  console.log("Key: " + key);
}, {keyOnly: true})

each(function (val) {
  console.log("Val: " + val);
}, {valueOnly: true})
```

* * *

#### eachKey
`eachKey(func<Function>)`

通过集合轮询并调用给定方法

#####例子
```
each(function (key) {
  console.log("Key: " + key);
}, {keyOnly: true})
```

* * *

#### eachValue
`eachValue(func<Function>)`

通过集合轮询并调用给定方法

#####例子
```
each(function (val) {
  console.log("Val: " + val);
}, {valueOnly: true})
```

* * *

#### clone
`clone()`

创建一个当前集合的克隆版本并返回之。

#####例子
```
clone()
// => SortedCollection
```

* * *

#### concat
`concat(hNew<Object>)`

用当前的拼接到给定集合中

#####例子
```
concat(new SortedCollection())
// => undefined
```

* * *

#### push
`push(key<String>, val<Any>)`

在集合中插入一个新项

#####Examples
```
push("testZ", "zzzz")
// => 5
```

* * *

#### pop
`pop()`

弹出集合中最后一项并返回其值

#####例子
```
pop()
// => "zzzz"
```

* * *

#### unshift
`unshift(key<String>, val<Any>)`

在集合的开始插入一个新值

#####例子
```
unshift("testA0", "a0a0a0a0")
// => 6
```

* * *

#### shift
`shift()`

移除列表中的第一项并返回其值

#####例子
```
shift()
// => "a0a0a0a0"
```

* * *

#### splice
`splice(index<Number>, numToRemove<Number>, hash<Object>)`

从索引到给定的最大值中移除项，然后添加给定的集合项

#####例子
```
splice(2, 1, new SortedCollection())
// => undefined
```

* * *

#### reverse
`reverse()`

反转集合

#####例子
```
reverse()
// => undefined
```

* * *

#### date

#### supportedFormats
`supportedFormats`

支持strftime格式的对象

* * *

#### getSupportedFormats
`getSupportedFormats()`

以字符串的形式返回列表

#####例子
```
getSupportedFormats()
// => "aAbhBcCdDefFgGHI..."
```

* * *

#### strftime
`strftime(dt<Date>, format<String>)`

用strftime格式话指定日期

#####例子
```
strftime(new Date(), "%w")
// => 3
```

* * *

#### calcCentury
`calcCentury(year<Number>)`

从给定年份中获取世纪

#####例子
```
calcCentury()
// => "21"

calcCentury(2000)
// => "20"
```

* * *

#### calcDays
`calcDays(dt<Date>)`

根据给定日期计算在一年中的日子数

#####例子
```
calcDays(new Date())
// => 150
```

* * *

#### getMeridiem
`getMeridiem(h<Number>)`

以24小时制返回 'AM' or 'PM'。

#####例子
```
getMeridiem(14)
// => "PM"

getMeridiem(7)
// => "AM"
```

* * *

#### hrMil2Std
`hrMil2Std(hour<String>)`

把24小时制转换为12小时制

#####例子
```
hrMil2Std("14")
// => 2

hrMil2Std("7")
// => 7
```

* * *

#### hrStd2Mil
`hrStd2Mil(hour<String>, pm<Boolean>)`

把12小时制转换为24小时制

#####Examples
```
hrStd2Mil("7", true)
// => 14

hrStd2Mil("7")
// => 7
```

* * *

#### add
`add(dt<Date>, interv<String>, incr<Number>)`

以不同大小的间隔添加日期，从毫秒到年

#####例子
```
add(new Date(), "hour", 1)
// => Date

add(new Date(), "minute", 10)
// => Date
```

* * *

#### diff
`diff(date1<Date>, date2<Date>, interv<String>)`

Get the difference in a specific unit of time (e.g., number of months, weeks, days, etc.) between two dates.
在两个日期内，获取特定的时间单位中的差值(例如几个月、几周、几天等)

#####Examples
```
diff(new Date(), new Date(), "hour")
// => 0

diff(new Date(), new Date(), "minute")
// => 0
```

* * *

#### parse
`parse(val<String>)`

转换不同字符串为js日期对象

#####例子
```
parse("12:00 March 5 1950")
// => Sun Mar 05 1950 12:00:00 GMT-0500 (EST)
```

* * *

#### relativeTime
`relativeTime(dt<Date>, opts<Object>)`

#####Options
- `abbreviated` [Boolean] 使用短字符(Default: false)

转换日期为一个英语表达式

#####例子
```
relativeTime(new Date())
// => 'less than a minute ago'
```

* * *

#### toISO8601
`toISO8601(dt<Date>)`

转换日期为一个ISO8601格式字符串

#####例子
```
toISO8601(new Date())
// => '2012-10-17T17:57:03.892-04'
```

* * *

#### object

#### merge
`merge(object<Object>, otherObject<Object>)`

合并将 `otherObject` 合并到 `object` 中，并处理对象的深度合并


#####例子
```
merge({user: 'geddy'}, {key: 'key'})
// => {user: 'geddy', key: 'key'}

merge({user: 'geddy', key: 'geddyKey'}, {key: 'key'})
// => {user: 'geddy', key: 'key'}
```

* * *

#### reverseMerge
`reverseMerge(object<Object>, defaultObject<Object>)`

反向合并 `object` 变为 `defaultObject`

#####Examples
```
reverseMerge({user: 'geddy'}, {key: 'key'})
// => {user: 'geddy', key: 'key'}

reverseMerge({user: 'geddy', key: 'geddyKey'}, {key: 'key'})
// => {user: 'geddy', key: 'geddyKey'}
```

* * *

#### isEmpty
`isEmpty(object<Object>)`

对象非空检测

#####例子
```
isEmpty({user: 'geddy'})
// => false

isEmpty({})
// => true
```

* * *

#### toArray
`toArray(object<Object>)`

把每一个包含原始对象的key/value的对象转为数组对象

#####例子
```
toArray({user: 'geddy'})
// => [{key: 'user', value: 'geddy'}]
```

* * *

#### network

#### isPortOpen
`isPortOpen(port<Number>, host<String>, callback<Function>)`

检测在给定主机中的给定端口是否打开

#####例子
```
isPortOpen(3000, 'localhost', function (err, isOpen) {
  if (err) { throw err; }

  console.log(isOpen)
})
```

* * *

#### request

#### request
`request(opts<Object>, callback<Function>)`

如果方法是POST或PUT，则向给定的url发送任何数据的请求发

#####Options
- `url` [String] 发送请求的url
- `method` [String] 请求发送的方法(Default: 'GET')
- `headers` [Object] 请求头
- `data` [String] 请求数据
- `dataType` [String] 发送的数据类型

#####例子
```
// 'GET' request
request({url: 'google.com', method: 'GET'}, function (err, data) {
  if (err) { throw err; }

  console.log(data)
})

// 'POST' request
request({url: 'google.com', data: geddy.uri.paramify({name: 'geddy', key: 'geddykey'}), headers: {'Content-Type': 'application/x-www-form-urlencoded'}, method: 'POST' }, function (err, data) {
  if (err) { throw err; }

  console.log(data)
})
```

* * *

### inflection

#### inflections
`inflections`

不同变化类型的规则和替换列表

* * *

#### parse
`parse(type<String>, word<String>)`

根据给定的变化类型解析一个单词

#####Examples
```
parse('plurals', 'carrier')
// => 'carriers'

parse('singulars', 'pluralities')
// => 'plurality'
```

* * *

#### pluralize
`pluralize(word<String>)`

把单词变为复数

#####Examples
```
pluralize('carrier')
// => 'carriers'
```

* * *

#### singularize
`singularize(word<String>)`

把单词变为单数

#####Examples
```
singularize('pluralities')
// => 'plurality'
```

* * *

### file

#### cpR
`cpR(fromPath<String>, toPath<String>, opts<Object>)`

#####Options
- `silent` [Boolean] 如果为假，记录命令

拷贝目录或文件

#####Examples
```
cpR('path/to/directory', 'destination/path')
// => undefined
```

* * *

#### mkdirP
`mkdirP(dir<String>, mode<Number>)`

根据给定mode权限创建指定目录

#####例子
```
mkdirP('dir', 0755)
// => undefined

mkdirP('recursive/dirs')
// => undefined
```

* * *

#### readdirR
`readdirR(dir<String>, opts<Object>)`

#####Options
- `format` [String] 设置返回格式(Default: Array)

读取指定目录并返回其内容

#####例子
```
readdirR('dir')
// => ['dir', 'item.txt']

readdirR('path/to/dir')
// => ['path/to/dir', 'path/to/dir/item.txt']
```

* * *

#### rmRf
`rmRf(p<String>, opts<Object>)`

#####Options
- `silent` [String] If false then logs the command

删除指定目录或文件

#####例子
```
rmRf('file.txt')
// => undefined
```

* * *

#### isAbsolute
`isAbsolute(p<String>)`

检测给定路径是绝对路径还是相对路径【译者注：绝对路径返回true】

#####例子
```
isAbsolute('/path/to/file.txt')
// => true

isAbsolute('C:\\path\\to\\file.txt')
// => true
```

* * *

#### absolutize
`absolutize(p<String>)`

根据给定路径返回其绝对路径

#####例子
```
absolutize(path/to/dir)
// => /home/user/path/to/dir
```

* * *

#### searchParentPath
`searchParentPath(p<String>, callback<Function>)`

在当前目录和父目录中搜索一个目录／文件。


#####例子
```
searchParentPath('path/to/file.txt', function (err, path) {
  if (err) { throw err; }

  console.log(path)
})
```

* * *

#### watch
`watch(path<String>, callback<Function>)`

观察给定路径，然后在发生变化时调用回调

#####例子
```
watch('path/to/dir', function (currStat, oldStat) {
  console.log('the current mtime is: ' + currStat.mtime);
  console.log('the previous mtime was: ' + oldStat.mtime);
})
```

* * *

#### requireLocal
`requireLocal(module<String>, message<String>)`

返回一个在当前目录中来自node_modules的本地模块。

#####例子
```
requireLocal('utilities', 'optional error message')
// => { ... }
```

* * *

#### string

#### escapeRegExpChars
`escapeRegExpChars(string<String>)`

在字符串中转移正则控制字符，用于动态构架正则。

#####例子
```
escapeRegExpChars('/\s.*/')
// => '\\\\/s\\\\.\\\\*\\\\/'
```

* * *

#### toArray
`toArray(string<String>)`

把字符串转位数组

#####例子
```
toArray('geddy')
// => ['g', 'e', 'd', 'd', 'y']
```

* * *

#### reverse
`reverse(string<String>)`

字符串反转

#####例子
```
reverse('geddy')
// => 'yddeg'
```

* * *

#### ltrim
`ltrim(string<String>, char<String>)`

根据第二个参数从左边开始截取字符串并返回除参数以外的字符，如果不给定第二个参数，默认截取掉空格。

#####例子
```
ltrim('&geddy', '&')
// => 'geddy'

ltrim('    geddy')
// => 'geddy'
```

* * *

#### rtrim
`rtrim(string<String>, char<String>)`

根据第二个参数从右边截取字符串并返回除参数以外的字符，如果不给定第二个参数，默认截取掉空格。

#####Examples
```
rtrim('geddy&', '&')
// => 'geddy'

rtrim('geddy    ')
// => 'geddy'
```

* * *

#### trim
`trim(string<String>, char<String>)`

根据第二个参数从左右两边截取字符串并返回除参数以外的字符，如果不给定第二个参数，默认截取掉空格。

#####例子
```
trim('&&&&geddy&', '&')
// => 'geddy'

trim('    geddy    ')
// => 'geddy'
```

* * *

#### chop
`chop(string<String>)`

移除最后的字符并返回新的字符串。如果字符串以空格换行结尾，都将被移除。空字符串调用chop仍返回空字符串。

#####例子
```
chop('geddy&')
// => 'geddy'
```

* * *

#### lpad
`lpad(string<String>, char<String>, width<Number>)`

lpad 在 `string` 左边添加 `char` ，直到 `string` 超出其 `width`

#####例子
```
lpad('geddy', '&', 6)
// => '&geddy'
```

* * *

#### rpad
`rpad(string<String>, char<String>, width<Number>)`

rpad 在 `string` 右边添加 `char` ，直到 `string` 超出其 `width`

#####例子
```
rpad('geddy', '&', 7)
// => 'geddy&'
```

* * *

#### pad
`pad(string<String>, char<String>, width<Number>)`

pad 在 `string` 左右两边添加 `char` ，直到 `string` 超出其 `width`

#####Examples
```
rpad('geddy', '&', 6)
// => '&geddy&'
```

* * *

#### truncate 【译者注：truncate及truncateHTML 在 [helpers](https://github.com/geddy/geddy/blob/master/docs/zh-cn/reference/helpers.md#truncate) 有翻译】
`truncate(string<String>, options<Integer/Object>, callback<Function>)`

#####Options
- `length` [Integer] 输出字符串的长度(Default: string.length)
- `len` [Integer]  `length` 的别名
- `omission` [String] 被替换字符串的替代表示(Default: '...')
- `ellipsis` [String]  `omission` 的别名 (Default: '...')
- `seperator` [String/RegExp] 在最近的 `seperator` 截断

Truncates a given `string` after a specified `length` if `string` is longer than `length`. The last characters will be replaced with an `omission` for a total length not exceeding `length`. If `callback` is given it will fire if `string` is truncated.

#####Examples
```
truncate('Once upon a time in a world', { length: 10 })
// => 'Once up...'

truncate('Once upon a time in a world', { length: 10, omission: '///' })
// => 'Once up///'

truncate('Once upon a time in a world', { length: 15, seperator: /\s/ })
// => 'Once upon a...'

truncate('Once upon a time in a world', { length: 15, seperator: ' ' })
// => 'Once upon a...'

truncate('<p>Once upon a time in a world</p>', { length: 20 })
// => '<p>Once upon a ti...'
```

* * *

#### truncateHTML
`truncateHTML(string<String>, options<Integer/Object>, callback<Function>)`

#####Options
- `once` [Boolean] If true, it will only be truncated once, otherwise the(Default: false)

Truncates a given `string` inside HTML tags after a specified `length` if string` is longer than `length`. The last characters will be replaced with an `omission` for a total length not exceeding `length`. If `callback` is given it will fire if `string` is truncated. If `once` is true only the first string in the first HTML tags will be truncated leaving the others as they were

#####Examples
```
truncateHTML('<p>Once upon a time in a world</p>', { length: 10 })
// => '<p>Once up...</p>'

truncateHTML('<p>Once upon a time <small>in a world</small></p>', { length: 10 })
// => '<p>Once up...<small>in a wo...</small></p>'

truncateHTML('<p>Once upon a time <small>in a world</small></p>', { length: 10, once: true })
// => '<p>Once up...<small>in a world</small></p>'
```

* * *

#### nl2br
`nl2br(string<String>)`

Nl2br返回一个字符串，其中所有的换行符都被转换成html标签。

#####Examples
```
nl2br("geddy\n")
// => 'geddy<br />'
```

* * *

#### snakeize
`snakeize(string<String>, separ='_'<String>)`

Snakeize 把驼峰式转位为蛇底式。

#####例子
```
snakeize("geddyJs")
// => 'geddy_js'

snakeize("GeddyJs")
// =>  'geddy_js'
```

* * *

#### camelize
`camelize(string<String>, options<Object>)`

#####Options
- `initialCap` [Boolean] 为真则首字母也大些
- `leadingUnderscore` [Boolean] If leadingUnderscore os true then if Camelize takes a string and optional options and returns a camelCase version of the given `string`

#####Examples
```
camelize("geddy_js")
// => 'geddyJs'

camelize("geddy_js", {initialCap: true})
// => 'GeddyJs'

camelize("geddy_js", {leadingUnderscore: true})
// => 'geddyJs'

camelize("_geddy_js", {leadingUnderscore: true})
// => '_geddyJs'
```

* * *

#### decapitalize
`decapitalize(string<String>)`

返回首字母小写

#####例子
```
decapitalize("Geddy")
// => 'geddy'
```

* * *

#### capitalize
`capitalize(string<String>)`

返回首字母大写

#####例子
```
decapitalize("geddy")
// => 'Geddy'
```

* * *

#### dasherize
`dasherize(string<String>, replace='-'<String>)`

在驼峰式或蛇底式之间已给定字符串隔开

#####例子
```
dasherize("geddyJs")
// => 'geddy-js'

dasherize("geddyJs", "_")
// => 'geddy_js'
```

* * *

#### include
`include(searchIn<String>, searchFor<String>)`

在另一个字符串中搜索特定字符串

#####Examples
```
include('geddy', 'js')
// => false

include('geddyjs', 'js')
// => true
```

* * *

#### getInflections
`getInflections(string<String>, options<Object>)`

#####Options
- `initialCap` [Boolean]

根据给定的 `name` 返回一个包含创建的不同的对象。

#####例子
```
getInflections('user')
// => {filename: { ... }, constructor: { ... }, property: { ... }}
```
