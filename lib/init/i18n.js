var path = require('path')
  , fs = require('fs')
  , utils = require('utilities')
  , i18n = utils.i18n
  , file = utils.file;

module.exports = new (function () {

  this.init = function (app, callback) {
    var localePaths = [
          __dirname + '/../../templates/locales'
        ]
      , loadLocaleData = function () {
          localePaths.forEach(function (directory) {
            directory = path.normalize(directory);
            if (file.existsSync(directory)) {
              var f
                , files = file.readdirR(directory);
              for (var i = 0; i < files.length; i++) {
                f = files[i];
                if (f && /.json$/.test(f)) {
                  // Extract the locale-name from the filename (e.g.,
                  // foo/bar/baz/en-us.json => 'en-us'
                  locale = path.basename(f, ".json");
                  try {
                    data = fs.readFileSync(f).toString();
                    data = JSON.parse(data);
                  }
                  catch (e) {
                    throw new Error('Could not parse locale-data in file: ' +
                      f);
                  }
                  i18n.loadLocale(locale, data);
                  
                }
              }
            }
          });
          callback();
        };
    
    localePaths = localePaths.concat(nails.config.i18n.loadPaths || []);
    i18n.setDefaultLocale(nails.config.i18n.defaultLocale);
    loadLocaleData();
  };

})();

