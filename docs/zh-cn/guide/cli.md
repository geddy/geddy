Geddy有一个健壮的CLI工具帮你新建app，在你的app项目下运行tests or scripting，可以在控制台与你的应用程序交互
#### geddy

在当前目录不带参数的运行 geddy 命令将会运行geddy项目

```
cd path/to/app
geddy
// 将在 path/to/app 运行app
```

*选项*:

- `--environment, -e`: Environment to use
- `--hostname, -b`: Host name or IP to bind the server to (default: localhost)
- `--port, -p`: Port to bind the server to (default: 4000)
- `--geddy-root, -g`: /path/to/approot The path to the root for the app you want to run (default is current working directory)
- `--workers, -w`: Number of worker processes to start (default: 1)
- `--debug, -d`: Sets the log level to output debug messages to the console
- `--help, -h`: Output this usage dialog
- `--version, -v`: Output the version of Geddy that's installed

*例子*

```
# Start Geddy on localhost:4000 in development mode or if the
# directory isn't a Geddy app it'll display a prompt to use "geddy -h"
geddy
# Start Geddy on port 3000
geddy -p 3000
# Start Geddy in production mode
geddy -e production
# Generate a users scaffolding using Jade templates
geddy -j scaffold user

```

#### geddy控制台

在你项目的上下文中启动REPL。这将加载你的项目环境，以及与你的models交互。

*例子*

```
# Start a REPL (in 'production' mode)
geddy console
# Start a REPL in 'development' mode
geddy console environment=development
```

#### geddy gen [command] [options] [arguments]

这是一个帮你生成app、资源脚手架、空的模型和控制器的生成器脚本

*Commands*

- `gen app <name>`: 生成一个Geddy项目
- `gen resource <name> [attrs]`: 生成一个包含model controller and route资源
- `gen scaffold <name> [attrs]`: 生成一个包含views, a model, controller and route的脚手架
- `gen secret`: 在 `config/secret.json` 文件中生成一个密钥
- `gen controller <name>`: 生成一个新的 controller 包含一个索引 view and and a route
- `gen model <name> [attrs]`: 生成一个新的 model
- `gen auth[:update]`: 创建用户验证
- `gen migration <name>`: 为 SQL 数据库创建一个迁移

以上所有命令 `[attrs]` 是 'name:datatype'格式 (例如foo:int) 模型的属性列表

*Options*

- `--realtime, -rt`: When generating or scaffolding, take realtime into account
- `--pug, -j`: When generating views this will create Jade templates (Default: EJS)
- `--handle, -H`: When generating views this will create Handlebars templates (Default: EJS)
- `--mustache, -m`: When generating views this will create Mustache templates (Default: EJS)
- `--swig, -s`: When generating views this will create Swig templates (Default: EJS)

*Examples*

```
# Generate an app in a directory named 'foo'
geddy gen app foo
# Generate a users resource with the model properties name as a string and admin as a boolean
geddy gen resource user name admin:boolean
# Generate a users scaffolding user name as the default value to display data with
geddy gen scaffold user name:string:default

```

#### geddy jake [task] [options] [env vars]

该命令在当前项目上下文执行一个Jake任务。它允许你在你的项目上下文运行你的测试或者任何其他的命令行任务

Geddy有很多有用的Jake构建任务，比如在你的app中显示所有路由的`routes`任务

*Options*

详见： https://github.com/mde/jake

*Examples*

```
# Run your app's tests in the app environment
geddy jake test
# Initialize the development database for your app
geddy jake db:init environment=development
# Show all routes
geddy jake routes
# Show all routes for the user resource
geddy jake routes[user]
# Show the index route for the user resource
geddy jake routes[user.index]
```

**在不同环境运行 "geddy jake" ** 

```
geddy jake environment=[myEnvironment]
```

