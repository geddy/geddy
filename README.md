# Geddy

**`node "~> 5.12.0"`**

#### A simple, structured web framework for Node

[![Build Status](https://travis-ci.org/geddy/geddy.png?branch=master)](https://travis-ci.org/geddy/geddy) [![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/geddy/geddy)

## Install Geddy:

```
$ npm install -g geddy
```

## Create an app, start it up:

```
$ geddy gen app my_app
$ cd my_app
$ geddy
Creating 1 worker process.
Server worker running in development on port 4000
```

## Create a CRUD resource

```
$ geddy gen scaffold foobar baz:string qux:int
[Added] app/models/foobar.js
[Added] db/migrations/20130809201124_create_foobars.js
[Added] test/models/foobar.js
[Added] test/controllers/foobars.js
[Added] app/controllers/foobars.js
[Added] Resource foobars route added to config/router.js
[Added] View templates
```

## Documentation

Docs are on the GeddyJS Website: http://geddyjs.org/documentation

## Community Tutorials

[Geddy.JS: A No-Brainer MVC Node.js Framework](https://www.digitalocean.com/community/articles/geddy-js-a-no-brainer-mvc-node-js-framework) - Bhanu Pratap Chaudhary

## Community

* [Mailing list](https://groups.google.com/group/geddyjs)
* [Gitter](https://gitter.im/geddy/geddy)

## Contributing

Contributions are definitely welcome, but we will need you to do it in an organised manner. So please refer to [CONTRIBUTING.md](CONTRIBUTING.md) for instructions on how to contribute to the project.

Once you have carefully read through the contributing guidelines, fork the repo, make the changes, and open a pull request pointing to the respective branch. We will shortly get back to you.

Thank you for taking time out your day to contribute :+1: :octocat:

## License

Apache License, Version 2

- - -

Geddy Web-app development framework copyright 2112
mde@fleegix.org.
