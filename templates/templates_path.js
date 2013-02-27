var path = require('path')
  , utils = require('../lib/utils')
  , exec = require('child_process').exec;

var reportPath = function (path, cb) {
  console.log("Using templates in: " + path);
  cb(path);
};

var getModulePath = function (cmdToGetPathFrom, templatesFullName, getModulePathCallback) {
  exec(cmdToGetPathFrom, function (err, stdout, stderror) {
    if (err) {
      throw err;
    }
    var modulesPath = stdout.split("\n")[0];
    modulesPath = path.join(modulesPath, templatesFullName, 'templates');
    getModulePathCallback(modulesPath);  
  });
};

var getTemplatesPath = function (templatesNameOrPath, cb) {
  var customTemplatePath = path.join(templatesNameOrPath, 'templates')
    , templatesFullName = 'geddy-'+ templatesNameOrPath + '-templates'
  
  if (templatesNameOrPath == undefined) { 
    return reportPath(__dirname, cb);
  }
  
  if (utils.file.existsSync(customTemplatePath)) {    
    return reportPath(customTemplatePath, cb);
  }        

  getModulePath("npm root", templatesFullName, function (localModulePath) {
    if(utils.file.existsSync(localModulePath)) {
      return reportPath(localModulePath, cb);
    }
    getModulePath("npm root -g", templatesFullName, function (globalModulePath) {
      if(utils.file.existsSync(globalModulePath)) {
        return reportPath(globalModulePath, cb);
      }
      throw new Error("The specified templates weren't found. Check they exists as a full or relatvie path or as a local or global module");    
    });
  });
};

module.exports.getTemplatesPath = getTemplatesPath;
//require('./templates/templates_path')