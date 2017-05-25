Sessions通常用于记录与服务器的保持当前连接。

#### .get
`get( key )`

从当前session中获取key

##### key
- `key [string]`: 返回值的键

##### example
```
var user = this.session.get(‘user’);
```

#### .set
`set( key, value )`

按照key,value的形式保存当前会话。

##### key
- `key [string]`: 设置session的键名

##### value
- `value [object]`: 保存session的键值

##### 例子
```
this.session.set(‘user’, user);
```

#### .unset
`unset( key )`

从当前会话中移除键名和键值

##### key
- `key [string]`: 待移除的键名

##### 例子
```
this.session.unset(‘user’);
```

#### .isExpired
```
isExpired()
```

如果当前会话已过期，则返回true

##### 例子
```
this.session.isExpired
```

#### .reset
```
reset()
```

完全重置用户会话 —— 清除所有数据，设置一个新的会话ID。

##### 例子
```
this.session.reset
```
