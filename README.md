# Geddy
#### A simple, structured web framework for Node

[![Build Status](https://travis-ci.org/geddy/geddy.png?branch=master)](https://travis-ci.org/geddy/geddy) [![Gitter](https://badges.gitter.im/geddy/geddy.svg)](https://gitter.im/geddy/geddy)

## DEPRECATION NOTICE
**Geddy is no longer actively maintained, and therefore it is not recommended to be used for any new projects. For current users, it is highly recommended to migrate another framework.**

#### Install Geddy:

```
$ npm install -g geddy
```

> **Note:**
> Make sure your installed node version is not v6 or higher, as Geddy will not function properly. This will be fixed in the, hopefully, soon future.
>
> Consider using '[nvm](https://github.com/creationix/nvm)' to help you manage your node versions.

#### Create an app, start it up:

```
$ geddy gen app my_app
$ cd my_app
$ geddy
Creating 1 worker process.
Server worker running in development on port 4000
```

#### Create a CRUD resource

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

#### Documentation

Docs are on the GeddyJS Website: http://geddyjs.org/documentation

#### Community Tutorials

Geddy.JS: A No-Brainer MVC Node.js Framework - Bhanu Pratap Chaudhary
https://www.digitalocean.com/community/articles/geddy-js-a-no-brainer-mvc-node-js-framework

#### Community

* Mailing list: [https://groups.google.com/group/geddyjs](https://groups.google.com/group/geddyjs)
* [Gitter](https://gitter.im/geddy/geddy)

#### License

Copyright 2017. Geddy - Web-app development framework

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

- - -

mde@fleegix.org

:octocat:
