Geddy通过SSL/TLS or SPDY支持HTTPS。要启用它，请将以下内容添加到您的配置文件中。配置至少需要'key'和'cert'选项，但是支持https和spdy模块的所有选项都是支持的。

要添加SSL/TLS，只需在配置文件中添加以下行:
```
// ...
, ssl: {
    key: 'config/key.pem',
    cert: 'config/cert.pem'
  }
// ...
```

要添加支持SPDY，请添加以下行：
```
// ...
, spdy: {
    key: 'config/key.pem',
    cert: 'config/cert.pem'
  }
// ...
```

如果您注意到以下配置选项使用文件名而不是文件内容，就像“https”和“spdy”的标准选项,这是因为Geddy已经为你处理好了。如果
您还必须包括一个证书权威列表，使用ca选项，而不是为每个权限赋予它一组文件名，您还可以包括一个文件名指向一个捆绑的证书。

下面链接是一个创建签名的SSL证书分步指南:
[http://www.akadia.com/services/ssh_test_certificate.html](http://www.akadia.com/services/ssh_test_certificate.html)
