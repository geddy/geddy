var assert = require('assert')
	, path = require('path')
  , getTemplatesPath = require('../../templates/templates_path').getTemplatesPath  
  , fileUtils = require('../../lib/utils').file;

testGetPathTest = function (pathOrModuleName, expectedPath, done) {
	var originalExistsSync = fileUtils.existsSync
  	, originalLog = console.log;

	console.log = function () { };
	fileUtils.existsSync = function (receivedPath) {
		return receivedPath == expectedPath;
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
		testGetPathTest(null, path.join(__dirname, "../../templates"), done);
	}
, 'localPath': function (done) {
  	testGetPathTest("existingLocalPath", "existingLocalPath/templates", done);
  }
, 'localModule': function (done) {
		var localModulePath = path.resolve("node_modules/geddy-localModuleShortName-templates/templates");
		testGetPathTest("localModuleShortName", localModulePath, done);
	}
, 'globalModule': function (done) {
		var globalModulePath = "/usr/local/lib/node_modules/geddy-globalModuleShortName-templates/templates";
		testGetPathTest("globalModuleShortName", globalModulePath, done);		
	}
};

module.exports = tests;