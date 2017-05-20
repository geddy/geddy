Geddy的视图层提供了一套通用的模板语言和帮助程序，让你快速开始。

视图层支持以下四种模版引擎：
+ EJS (.ejs)
+ Jade (.jade)
+ Mustache (.mu, .ms, .mustache)
+ Handlebars (.hbs, .handlebars)
+ [Swig](http://paularmstrong.github.io/swig/) (.swig)

要使用特定的模板引擎，只需在上面列出相应的扩展名即可。

当使用Geddy命令行创建应用，你可以在命令行给定一个参数来使用不同的模版语言，请看下面的例子：

```
geddy app --mustache my_app
geddy scaffold -m user


geddy app --jade my_app
geddy scaffold -j user


geddy app --handle my_app
geddy scaffold -H user

geddy app --swig my_app
geddy scaffold --swig user
```

* * *

