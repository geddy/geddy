Geddy提供e-mail支持，允许你对于新账号使用e-mail验证，或者发送通知给你的用户，Geddy对于此功能使用[Nodemailer](http://www.nodemailer.com/)

在的项目配置文件中，配置你的mail支持（例如你的development.js or production.js文件）。你可以设置用户名用来发送邮件（在你的配置中设置 hostname）,有关更多请看：[usage of nodemailer-smtp-transport](https://github.com/andris9/nodemailer-smtp-transport#usage)

以下是一个使用SMTP传输的配置的例子：

```javascript
, mailer: {
    fromAddressUsername: 'noreply'
  , transport: {
      host: 'smtp.gmail.com'
    , port: 465 // port for secure SMTP
    , secure: true // use SSL
    , auth: {
        user: 'gmail.user@gmail.com'
      , pass: 'userpass'
      }
    }
  }
```

当你使用一些比较熟知的服务商，你可以使用 `service`.

例如，你使用Gmail作为SMTP服务：
```javascript
, mailer: {
    fromAddressUsername: 'noreply'
  , transport: {
      service: "Gmail"
    , auth: {
        user: "gmail.user@gmail.com"
      , pass: "userpass"
      }
    }
  }
```

有关更多指定的email服务，请看 [this page](https://github.com/andris9/nodemailer-wellknown#supported-services).

你可以像下面那样发送邮件：

```javascript
geddy.mailer.sendMail({
  from: "noreply@geddyjs.org"
, to: params.email
, subject: "Email title"
, text: "Email Content"
}, function(err, info) {
  if (err) {
    throw err;
  }
});
```
