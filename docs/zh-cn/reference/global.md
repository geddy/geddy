Geddy项目创建的全局 `geddy` 对象。在这个全局对象中，有很多可用的命名空间以及方法直接拿来用。全局对象一旦定义，方法就可以拿来使用（例如，在config/init.js使用）。

`geddy`全局对象也是一个事件触发器，自带一些生命周期方法。

#### "initialized" (event, worker only)

当项目启动时，该事件就被触发。

#### "started" (event, worker only)

当Geddy的HTTP服务已经启动监听请求时触发该事件。这个事件在您的应用程序中很有用，因为它知道何时与socket.io建立一个实时连接。

#### "clusterStarted" (event, cluster master only)

当所有工作进程的HTTP服务器开始监听请求时，该事件由集群的主进程发出。

#### .start
`start(config)`

该命令直接在当前进程中开启一个不聚集的Geddy应用。这前提是，你本地安装而非全局安装的Geddy，也就是在当前目录说包含`geddy`对象。

##### config
- `config [object]`: 启动时，配置对象传递给Geddy应用。配置对象与传递给CLI启动脚本一致。

##### 例子
```
var geddy = require('geddy');
// Start up an unclustered app in the current process
geddy.start({
  port: 4001
});
```

#### .startCluster
`startCluster(config)`

通过多个工作进程的负载共享来启动一个Geddy集群应用，假设你已经在本地安装而非全局安装Geddy，也就是在当前目录说包含`geddy`对象。

##### config
- `config [object]`: 启动时，配置对象传递给Geddy应用。配置对象与传递给CLI启动脚本一致。

##### 例子
```
var geddy = require('geddy');
// Start up a clustered app
geddy.startCluster({
  environment: 'production'
, port: 4002
, workers: 3
});
```
#### .stop
`stop`

常用于停止一个未集群的Geddy应用该命令，不能适用于一个集群的app。

##### 例子
```
var geddy = require('geddy');
// Start up a server and immediately shut it back down
geddy.start();
geddy.on('started', function () {
  console.log('server started, now shutting down');
  geddy.stop();
});
```

#### .stopCluster
`stopCluster`

常用于停止一个未集群的Geddy应用该命令。该命令仅仅用于一个集群服务的主进程。

##### 例子
```
var geddy = require('geddy');
// Start up a clustered server and immediately shut it back down
geddy.startCluster({
  workers: 3
});
geddy.on('clusterStarted', function () {
  console.log('cluster started, now shutting down');
  geddy.stopCluster();
});

```

#### .addFormat
`addFormat(name, contentType, formatter)`

增加一个app能处理的格式(例如： content-type 或者 MIME type)。

##### name
- `name [string]`: 格式名 (例如：Geddy内建的像 'json', 'txt', 'html')

##### contentType
- `contentType [string|array]`: Content-type (or array of types) 浏览器传给服务器的格式。如果是数组, 首项将用于作为输出响应的Content-Type头。

##### formatter
- `formatter [function]`: 把内容放进想要格式的函数。带一个参数，一个对象输入返回格式化内容。例如，内建的 'json' 格式化函数，执行 `JSON.stringify` 返回结果。

##### 例子
```
this.addFormat('zerp', ['application/zerp', 'text/zerp'], function (content) {
  var res;
  if (content) {
    // Zerpify the content if possible
    if (typeof content.zerpify == 'function') {
      res = content.zerpify();
    }
    // Fall back to string
    else {
      res = content.toString();
    }
  }
  else {
    res = '';
  }
  return res;
});
```


