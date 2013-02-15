var assert = require('assert')
	, path = require('path')
  , getTemplatesPath = require('../../templates/Jakefile').getTemplatesPath  
  , fileUtils = require('../../lib/utils').file
  , originalExistsSync = fileUtils.existsSync
  , originalLog = console.log
  , localModulePath = path.resolve("node_modules/geddy-localModuleShortName-templates/templates")
  , globalModulePath = "/usr/local/lib/node_modules/geddy-globalModuleShortName-templates/templates";

testGetPathTest = function (pathOrModuleName, expectedPath, done) {
	console.log = function () { }
	fileUtils.existsSync = function (receivedPath) {
		return receivedPath == "existingLocalPath/templates" 
			|| receivedPath == localModulePath
			|| receivedPath == globalModulePath;
	};
	getTemplatesPath(pathOrModuleName, function(path) {
		assert.equal(path, expectedPath);
		fileUtils.existsSync = originalExistsSync;
		console.log = originalLog;
		done();
	});
};


tests = {
	'default': function (done) {
		testGetPathTest("default", path.join(__dirname, "../../templates"), done);
	}
, 'localPath': function (done) {
		console.log("starting test");
  	testGetPathTest("existingLocalPath", "existingLocalPath/templates", done);
  }
, 'localModule': function (done) {
		testGetPathTest("localModuleShortName", localModulePath, done);
	}
, 'globalModule': function (done) {
		testGetPathTest("globalModuleShortName", globalModulePath, done);		
	}
};

module.exports = tests;