/*
* Runs the asset compiler on the default paths
*/
var run = function() {
  /*
  * Config
  */
  var minify = true;
  var source = 'assets';
  var output = 'public';
  var ignoredExts = ['less'];
  
  this.compile(source, output, ignoredExts, minify);
};

/*
* Compiles a directory of assets into another
*/
var compile = function(source, output, ignoredExts, minify) {
  var self = this;
  
  /*
  * Deps
  */
  var async = require('async');
  var path = require('path');
  
  /*
  * Debug function
  */
  var logBuffer = '';
  var logToBuffer = function(message) {
    console.log(message);
  };
  
  /*
  * Read packages
  */
  var packages_def = path.join('../',source,'packages');
  var packages = require(packages_def);
  
  //Remember packaged files so we don't copy them later
  var packagedFiles = [];
  
  //Append the source prefix to package definitions
  for(var key in packages) {
    if(packages.hasOwnProperty(key)) {
      for(var i=0; i<packages[key].length; i++) {
        packages[key][i] = path.join(source,packages[key][i]);
        packagedFiles.push(packages[key][i]);
      }
    }
  }
  
  /**
  * Prepare the output dir
  */
  self.prepare(output, function(err) {
    if(err) {
      console.log(err);
    }
    else {
      //Returns an async worker that calls compileAsset
      var processAsset = function(outputFile, inputFiles) {
        return function(async_cb) {
          self.compileAsset(path.join(output,outputFile), inputFiles, minify, async_cb);
        };
      };
      
      //Create a worker for each package
      var assetWorkers = [];
      for(var assetName in packages) {
        if(packages.hasOwnProperty(assetName)) {
          assetWorkers.push(processAsset(assetName,packages[assetName]));
        }
      }
      
      //Run the workers in parallel
      async.parallel(assetWorkers,function(err,results) {
        if(err) {
          console.log("Failed to compile: " + err);
        }
        else {
          //Packages have been compiled at this point
          console.log("Compiled "+results.length+" assets from "+packagedFiles.length+" files"+(minify?" with":" without")+" minification.");
          
          //Copy over any assets that were not part of a package
          self.copyDir(source, output, packagedFiles, ignoredExts, function(err, copied) {
            if(err) {
              console.log("Failed to copy: " + err);
            }
            else {
              console.log("Copied "+copied.length+" assets.");
            }
          });
        }
      });
    }
  });
};

/*
* Compiles a resource into a file
*/
var compileAsset = function(outputFile, inputFiles, minify, cb) {
  var self = this;
  
  //Check if we are compiling a supported format
  var supportedFormats = ['js','css'];
  var outputFormat = outputFile.split('.').pop();
  var outputIsSupported = supportedFormats.indexOf(outputFormat) >= 0;
  if(!outputIsSupported) {
    cb('We only support ' + supportedFormats.join(',') + ' compilation at this time, not ' + outputFormat);
    return;
  }
  
  //Called after the asset is compiled
  var afterCompile = function(err, buffer) {
    if(err) {
      cb(err);
    }
    else {
      //Buffer will contain the compiled asset data, this function writes it
      var writeFile = function() {
        var fs = require('fs');
        fs.writeFile(outputFile, buffer, function(err) {
          if(err) {
            cb(err);
          }
          else {
            cb(null,outputFile);
          }
        });
      };
      
      //Is this file in a directory?
      if(outputFile.indexOf('/') > 0) {
        //If so, make sure it exists
        var targetDir = outputFile.substring(0, outputFile.lastIndexOf('/'));
        self.prepare(targetDir,function(err) {
          if(err) {
            cb(err);
          }
          else {
            writeFile();
          }
        });
      }
      else {
        writeFile();
      }
    }
  };
  
  //Compile for that specific format
  switch(outputFormat) {
    case 'js':
      self.compileJS(outputFile,inputFiles,minify,afterCompile);
    break;
    case 'css':
      self.compileCSS(outputFile,inputFiles,minify,afterCompile);
    break;
  }
};

/*
* Compiles a Javascript resource into a string
*/
var compileJS = function(output, inputFiles, minify, cb) {
  //Minify? Easy top level function...
  if(minify) {
    var uglifyjs = require('uglify-js2');
    cb(null, uglifyjs.minify(inputFiles).code);
  }
  else {
    //If not minifying, just concat the files together
    self.concat(inputFiles, cb);
  }
};

/*
* Compiles a CSS resource into a string
*/
var compileCSS = function(output, inputFiles, minify, cb) {
  var self = this;
  var cleanCSS = require('clean-css');
  var less = require('less');
  
  var lessHander = function(filename, data, handler_cb) {
    var filedir = filename.substring(0, filename.lastIndexOf('/'));
    
    if(filename.split('.').pop().toLowerCase()==='less') {
      var parser = new(less.Parser)({
          paths: [filedir], // Specify search paths for @import directives
          filename: filename // Specify a filename, for better error messages
      });
      
      parser.parse(data, function (err, tree) {
        if(err) {
          handler_cb(err);
        }
        else {
          handler_cb(null,tree.toCSS({ compress: minify }));
        }
      });
    }
    else {
      handler_cb(null, data);
    }
  };

  self.concat(inputFiles, lessHander, function(err,buffer) {
    if(err) {
      cb(err);
    }
    //Minify?
    else if(minify) {
      cb(null, cleanCSS.process(buffer) );
    }
    else {
      cb(null, buffer);
    }
  });
};

/*
* Concatenates files
*/
var concat = function(inputFiles, handler, cb) {
  var async = require('async');
  var fs = require('fs');
  
  if(cb === undefined) {
    cb = handler;
    handler = null;
  }

  //Returns an async worker
  var loadFile = function(path) {
    return function(async_cb) {
      fs.readFile(path, 'utf-8', function(err, data) {
        if (err) {
          async_cb(err);
        } else {
          //Do we have to run a handler?
          if(handler) {
            handler(path,data,async_cb);
          }
          else {
            async_cb(null, data);
          }
        }
      });
    };
  };
  
  //Create a worker for each file
  var fileWorkers = [];
  for(var i=0; i<inputFiles.length; i++) {
    fileWorkers.push(loadFile(inputFiles[i]));
  }
  
  //Run all the workers in series
  async.series(fileWorkers, function(err,results) {
    if(err) {
      cb(err);
    }
    else {
      //Results is an array of data, so concatenate that into a string buffer and return it
      cb(null, results.join('\n') );
    }
  });
}

/*
* Creates and empties a directory
*/
var prepare = function(dir, cb) {
  var nodefs = require('node-fs');
  var self = this;
  nodefs.mkdir(dir, 511, true, function(err) {
    if(err) {
      cb(err);
    }
    else {
      self.empty(dir,function(err) {
        if(err) {
          cb(err);
        }
        else {
          cb(null);
        }
      });
    }
  });
}

/*
* Empties a directory
* @param {String} The directory to empty
*/
var empty = function(dir, cb) {
  var fs = require("fs");
  var path = require("path");
  var async = require("async");
  
  //Returns an async task for the filename
  var processFile = function(filename) {
    return function(async_cb) {
      fs.stat(filename, function(err, stats) {
        if(err) {
          async_cb(err);
        }
        else {
          if(stats.isDirectory()) {
            //Recursively empty directory
            empty(filename, function(err) {
              if(err) {
                async_cb(err);
              }
              else {
                //Complete by removing the directory
                fs.rmdir(filename,async_cb);
              }
            });
          }
          else {
            fs.unlink(filename, async_cb);
          }
        }
      });
    };
  };
  
  //Read directory
  fs.readdir(dir,function(err,files) {
    if(err) {
      cb(err);
    }
    else {
      //Build an array of async tasks for each file we encounter
      var todo = [];
      for(var i=0; i<files.length; i++) {
        var filename = path.join(dir, files[i]);
        todo.push(processFile(filename));
      }
      //Execute the tasks in parallel
      async.parallel(todo, cb);
    }
  });
};

/*
* Copies a file
*/
var copyFile = function(source, target, cb) {
  var self=this;
  
  var fs = require('fs');
  var nodefs = require('node-fs');
  
  //Recursively ensure that directory exists
  var targetDir = target.substring(0, target.lastIndexOf('/'));
  
  nodefs.mkdir(targetDir, 511, true, function(err) {
    if (err) {
      cb(err);
    } else {
      var done = function(err) {
        if (!cbCalled) {
          if (err) {
            cb(err);
          } else {
            cb(null, source, target);
          }
          cbCalled = true;
        }
      };
      var cbCalled = false;
      var rd = fs.createReadStream(source);
      rd.on('error', function(err) {
        done(err);
      });
      var wr = fs.createWriteStream(target);
      wr.on('error', function(err) {
        console.log(err);
        done(err);
      });
      wr.on('close', function() {
        done();
      });
      rd.pipe(wr);
    }
  });
}

/*
* Copies a directory into another, ignoring some files
*/
var copyDir = function(source, target, ignoreFiles, ignoreExts, cb) {
  var self = this;
  var walk = require('walk');
  var async = require('async');
  var path = require('path');
  
  // Walker options
  var walker = walk.walk(source, {
    followLinks: false
  });
  
  //Returns an async worker that copies the file with copyFile
  var processFile = function(filename) {
    return function(async_cb) {
      var outputFile = filename.replace(source, target);
      
      self.copyFile(filename, outputFile, function(err) {
        if(err) {
          async_cb(err);
        }
        else {
          async_cb(null, outputFile);
        }
      });
    };
  };
  
  //Walk the source directory, adding a worker for each file
  var fileWorkers = [];
  
  walker.on('file', function(root, stat, next) {
    var filename = path.join(root,stat.name);
    var fileext = stat.name.split('.').pop().toLowerCase();
    
    //Don't copy ignored files
    if(ignoreFiles.indexOf(filename) < 0 && ignoreExts.indexOf(fileext) < 0) {
      fileWorkers.push(processFile(filename));
    }
    
    next();
  });
  walker.on('end', function() {
    async.parallel(fileWorkers,cb);
  });
};

//Exports
exports.run = run;
exports.compile = compile;
exports.compileAsset = compileAsset;
exports.compileJS = compileJS;
exports.compileCSS = compileCSS;
exports.copyFile = copyFile;
exports.copyDir = copyDir;
exports.concat = concat;
exports.prepare = prepare;
exports.empty = empty;
