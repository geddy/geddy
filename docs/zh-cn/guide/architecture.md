Geddy基于许多流行框架所基于的MVC原则。每个Geddy应用都有它的模型、控制器、视图以及配置文件和路由。

* * *

#### 文件结构

```
├── app
│   ├── controllers
│   │   ├── application.js
│   │   └── main.js
│   ├── helpers
│   ├── models
│   └── views
│       ├── layouts
│       │   └── application.html.ejs
│       └── main
│           └── index.html.ejs
├── config
    ├── development.js
    ├── environment.js
    ├── init.js
    ├── production.js
    └── router.js
├── lib
├── log
├── node_modules
└── public
```

* * *

#### 配置
`geddy.config`

Geddy建立在配置管理基础上。全局配置在 'config/environments'文件里设置。同样，您的生产和开发配置选项也在对应的文件中。

如果你想在特定的环境中启动你的应用程序，可以使用 -e 选项:

```
$ geddy -e production
```

* * *

#### 引导

如果您需要在应用程序启动时执脚本，你可以把它放在 'config/init.js' 文件中。

* * *

#### 日志
`geddy.log[level]`

Geddy自动将请求记录到访问日志中，你可以记录任何你想要的。Geddy支持从调试到紧急等9个不同的日志级别。

##### 级别
- `access`: 标准输出
- `debug`: 调试级别
- `info`: 消息级别
- `notice`: 通知级别
- `warning`: 警告级别
- `error`: 错误级别
- `critical`: 重要级别
- `alert`: 警戒
- `emergency`: 紧急

##### 例子
```
geddy.log.debug('调试')
// 在控制台打印 '调试'


geddy.log.error('出错')
// 打印 '出错'
```

* * *
