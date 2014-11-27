Geddy provides e-mail support, allowing your app to do things like requiring
e-mail activation for new accounts, or sending notifications to your users.
Geddy uses [Nodemailer](http://www.nodemailer.com/) for this feature.

Configure your mail support in your app's configuration (e.g., your
development.js or production.js files). You can set the e-mail username that
will be used in outgoing mails (will be used with the 'hostname' in your
config), and the Nodemailer transport and options. See
[usage of nodemailer-smtp-transport](https://github.com/andris9/nodemailer-smtp-transport#usage)
for more details on transports.

Here's an example of a configuration using SMTP transport:

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

When you use some well known providers, you can use `service`.

For example, when you use Gmail as an SMTP server:

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

For more email servers you can specify in `service`, see [this page](https://github.com/andris9/nodemailer-wellknown#supported-services).

You can send email as follows:

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
