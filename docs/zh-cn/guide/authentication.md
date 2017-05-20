Geddy提供了内置的验证,与 [Passport](http://passportjs.org/) 允许集成本地帐户，和第三方如Facebook和Twitter等社会服务进行身份验证。

#### 使用生成器

要创建一个带有内置身份验证的新Geddy应用程序，请正常创建应用程序
,然后运行 'geddy gen auth' 命令,如下所示:

```
$ geddy app by_tor
$ cd by_tor
$ geddy gen auth
```

以上操作将在你的app使用npm下载 [Geddy-Passport](https://github.com/mde/geddy-passport) 安装你需要的依赖。这包括需要的 Passport 库，本地用户和当前登录账号所需的Geddy模型和控制器。

#### 危险、警告等.

`geddy gen auth` 生成器仅使用在新建的Geddy app中。 如果你在已存在的app中运行，它将重写该文件。

如果需要在现有的应用程序中添加身份验证，可以查看一下
Geddy-Passport项目是否是一个Geddy应用。

#### 配置

你需要在 config/secrets.json添加设置。这包括在身份验证失败/成功之后的重定向位置，以及
你的应用程序中的OAuth密钥，设置大致如下:

```json
{
  "passport": {
    "successRedirect": "/",
    "failureRedirect": "/login",
    "twitter": {
      "consumerKey": "XXXXXX",
      "consumerSecret": "XXXXXX"
    },
    "facebook": {
      "clientID": "XXXXXX",
      "clientSecret": "XXXXXX"
    },
    "yammer": {
      "clientID": "XXXXXX",
      "clientSecret": "XXXXXX"
    }
  }
}
```

#### 本地用户

本地用户只需在你的Geddy resource正常使用RESTful模式即可。使用"/users/add"创建一个新用户。你可以修改"/app/models/user.js"去增加你想要的其他属性。

#### 通过第三方服务登录

一个成功的第三方服务（如Facebook、Twitter）会创建一个本地用户（如果不存在的话）。

#### 激活 E-mail

默认情况下，本地用户需要通过电子邮件激活。这并不适用于通过第三方服务进行身份验证。

当用户注册时，一封电子邮件将被发送到他们的帐户。在激活之前，用户将无法进行身份验证。Geddy 身份验证通过 [Nodemailer](http://www.nodemailer.com/)发送电子邮件。

为了使之正常运行,你需要在你的应用程序中运行 npm install nodemailer 来安装。您还需要为您的应用程序设置一个主机名(用于激活链接)使之生效。你也可以很容易地在用户控制器中将这个功能关闭。

#### 已认证用户

用户成功通过验证之后，他最终将跳转到你指定的 'successRedirect',而且这将有两个新的用户session：

 * userId -- 本地用户id
 * authType -- 认证方法 (如'local', 'twitter'等)

#### 在应用在包含身份验证

如果在用户的session中没有userId，使用before-filter跳转到登录页面。如果有userId表明用户已经验证。在helper-library中有一个内置的reequireAuth方法，用法如下：

本地帐户的控制器就像这样受到保护：

```javascript
var passport = require('../helpers/passport')
  , cryptPass = passport.cryptPass
  , requireAuth = passport.requireAuth;

var Users = function () {
  this.before(requireAuth, {
    except: ['add', 'create']
  });

// 其他代码
```

这允许创建新帐户,因为'add' and 'create'是豁免,但只有通过身份验证的用户可以查看或更新现有用户。

