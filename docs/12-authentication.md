Nails provides built-in authentication which integrates with
[Passport](http://passportjs.org/) to allow auth against either local accounts
or third-party social services like Facebook and Twitter.

#### Using the generator

To set up a new Nails app with built-in authentication, create your application
like normal, then run the `nails auth` command inside, like so:

```
$ nails app by_tor
$ cd by_tor
$ nails auth
```

This will pull down [Nails-Passport](https://github.com/mde/nails-passport)
using NPM, and install all the needed code into your app. This includes the
needed Passport libraries, and the Nails models and controllers for the local
User accounts and the login process.

#### Danger, Warning, etc.

The `nails auth` generator should only be used in a new Nails app. If you
run it inside an existing app, it may overwrite existing files that you wanted
to keep.

If you need to add auth to an existing app, you can take a look at the
Nails-Passport project, which is itself a Nails app scaffold, and use the pieces
you need.

#### Configuring Passport

You'll need to add the settings for Passport in your config/secrets.json file.
That includes the redirect locations for after an auth failure/success, and the
OAuth keys for your app. The setting will look similar to this: 
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

#### Local users

Local User accounts just go through the usual RESTful actions you'd get in a
normal Nails resource. Start at "/users/add" to create a new User. You can
modify "/app/models/user.js" to add any other properties you want.

#### Login with third-party services

A successful login with a third-party service like Facebook or Twitter will
create a linked local User account if one does not exist.

#### Authenticated users

After a user successfully authenticates, she will end up redirected to the
`successRedirect` you've specified, and there will be two new items in the
user's session:

 * userId -- the id for the local User account
 * authType -- the method of authentication (e.g., 'local', 'twitter')

#### Requiring authentication in your app

Use a before-filter, and redirect to the login page if there is no `userId` in
the user's session. If there is a `userId`, that means the user is
authenticated. There is a built-in `reequireAuth` function in the Passport
helper-library, which does just this.

The User controller for local accounts is protected like this:

```javascript
var passport = require('../helpers/passport')
  , cryptPass = passport.cryptPass
  , requireAuth = passport.requireAuth;

var Users = function () {
  this.before(requireAuth, {
    except: ['add', 'create']
  });

// Rest of controller omitted
```

This allows new accounts to be created, because the 'add' and 'create' actions
are exempted, but only authenticated users can view or update existing users.

