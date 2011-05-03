(function (foounit){

  // Set __dirname if it doesn't exist (like in the browser)
  __dirname = typeof __dirname !== 'undefined' ?
                __dirname : foounit.browser.dirname(/suite.js$/);

  foounit.mount('src',  __dirname + '/../lib');
  foounit.mount('util',  __dirname + '/../../geddy-util/lib');
  foounit.mount('test', __dirname);

  // If we've already loaded files into the foounit suite under node then just run those
  if (foounit.hostenv.type == 'node' && !foounit.getSuite().getFiles().length){
    // This is what is easy
    var files = [];
    files = files.concat(fsh.findSync(__dirname + '/shared', /.*.js$/));

    for (var i = 0; i < files.length; ++i){
      foounit.getSuite().addFile(files[i]);
    }
  }

  if (foounit.hostenv.type == 'browser'){
    // In order to run shared specs we need to be able to foounit.require which expects to
    // load dependencies in a functional scope.  The JsonpLoaderStrategy defines a require
    // method that loads dependencies syncronously via json-p.  In order for this to work
    // we need a server that wraps the dependecies in a function that will load the files
    // in a functional scope.  "Todays hacks are tomorrows standards"
    var loaderStrategy = new foounit.browser.XhrLoaderStrategy();
    foounit.browser.setLoaderStrategy(loaderStrategy);

    // There is no way to know what test files we want to run when the browser loads suite.js
    // from the file system.  We auto generate a file that adds all of the shared and browser
    // spec files to the suite from a jake task that runs before we run these tests. Sorry
    // for the magic, see the Jakefile's spec:browser task.
    foounit.load(':test/browser/autogen_suite');
  }

  foounit.getSuite().run();

})(foounit);
