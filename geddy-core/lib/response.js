/*
 * Geddy JavaScript Web development framework
 * Copyright 2112 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/

var fs = require('fs');
var util = require('util');
var fleegix = require('./fleegix');
var errors = require('geddy-core/lib/errors');
var log = require('geddy-core/lib/log');

var response = new function () {

  this.formats = {
    txt: 'text/plain',
    html: 'text/html',
    json: 'application/json|text/json',
    js: 'application/javascript|text/javascript',
    xml: 'application/xml|text/xml'
  };
  
  this.formatsReverseMap = {};
  this.formatPatterns = {};
  this.formatsPreferred = {};
  var formatTypes;
  for (var p in this.formats) {
    formatTypes = this.formats[p].split('|');
    this.formatsPreferred[p] = formatTypes[0];
    for (var i = 0; i < formatTypes.length; i++) {
      this.formatsReverseMap[formatTypes[i]] = p;
    }
    this.formatPatterns[p] = new RegExp(
        this.formats[p].replace(/(\/)/g, "\\$1"));
  }
  
  // From Paperboy, http://github.com/felixge/node-paperboy
  this.contentTypes = {
    "txt": "text/plain",
    "aiff": "audio/x-aiff",
    "arj": "application/x-arj-compressed",
    "asf": "video/x-ms-asf",
    "asx": "video/x-ms-asx",
    "au": "audio/ulaw",
    "avi": "video/x-msvideo",
    "bcpio": "application/x-bcpio",
    "ccad": "application/clariscad",
    "cod": "application/vnd.rim.cod",
    "com": "application/x-msdos-program",
    "cpio": "application/x-cpio",
    "cpt": "application/mac-compactpro",
    "csh": "application/x-csh",
    "css": "text/css",
    "deb": "application/x-debian-package",
    "dl": "video/dl",
    "doc": "application/msword",
    "drw": "application/drafting",
    "dvi": "application/x-dvi",
    "dwg": "application/acad",
    "dxf": "application/dxf",
    "dxr": "application/x-director",
    "etx": "text/x-setext",
    "ez": "application/andrew-inset",
    "fli": "video/x-fli",
    "flv": "video/x-flv",
    "gif": "image/gif",
    "gl": "video/gl",
    "gtar": "application/x-gtar",
    "gz": "application/x-gzip",
    "hdf": "application/x-hdf",
    "hqx": "application/mac-binhex40",
    "html": "text/html",
    "ice": "x-conference/x-cooltalk",
    "ief": "image/ief",
    "igs": "model/iges",
    "ips": "application/x-ipscript",
    "ipx": "application/x-ipix",
    "jad": "text/vnd.sun.j2me.app-descriptor",
    "jar": "application/java-archive",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "js": "text/javascript",
    "json": "application/json",
    "latex": "application/x-latex",
    "lsp": "application/x-lisp",
    "lzh": "application/octet-stream",
    "m": "text/plain",
    "m3u": "audio/x-mpegurl",
    "man": "application/x-troff-man",
    "me": "application/x-troff-me",
    "midi": "audio/midi",
    "mif": "application/x-mif",
    "mime": "www/mime",
    "movie": "video/x-sgi-movie",
    "mp4": "video/mp4",
    "mpg": "video/mpeg",
    "mpga": "audio/mpeg",
    "ms": "application/x-troff-ms",
    "nc": "application/x-netcdf",
    "oda": "application/oda",
    "ogm": "application/ogg",
    "pbm": "image/x-portable-bitmap",
    "pdf": "application/pdf",
    "pgm": "image/x-portable-graymap",
    "pgn": "application/x-chess-pgn",
    "pgp": "application/pgp",
    "pm": "application/x-perl",
    "png": "image/png",
    "pnm": "image/x-portable-anymap",
    "ppm": "image/x-portable-pixmap",
    "ppz": "application/vnd.ms-powerpoint",
    "pre": "application/x-freelance",
    "prt": "application/pro_eng",
    "ps": "application/postscript",
    "qt": "video/quicktime",
    "ra": "audio/x-realaudio",
    "rar": "application/x-rar-compressed",
    "ras": "image/x-cmu-raster",
    "rgb": "image/x-rgb",
    "rm": "audio/x-pn-realaudio",
    "rpm": "audio/x-pn-realaudio-plugin",
    "rtf": "text/rtf",
    "rtx": "text/richtext",
    "scm": "application/x-lotusscreencam",
    "set": "application/set",
    "sgml": "text/sgml",
    "sh": "application/x-sh",
    "shar": "application/x-shar",
    "silo": "model/mesh",
    "sit": "application/x-stuffit",
    "skt": "application/x-koan",
    "smil": "application/smil",
    "snd": "audio/basic",
    "sol": "application/solids",
    "spl": "application/x-futuresplash",
    "src": "application/x-wais-source",
    "stl": "application/SLA",
    "stp": "application/STEP",
    "sv4cpio": "application/x-sv4cpio",
    "sv4crc": "application/x-sv4crc",
    "swf": "application/x-shockwave-flash",
    "tar": "application/x-tar",
    "tcl": "application/x-tcl",
    "tex": "application/x-tex",
    "texinfo": "application/x-texinfo",
    "tgz": "application/x-tar-gz",
    "tiff": "image/tiff",
    "tr": "application/x-troff",
    "tsi": "audio/TSP-audio",
    "tsp": "application/dsptype",
    "tsv": "text/tab-separated-values",
    "unv": "application/i-deas",
    "ustar": "application/x-ustar",
    "vcd": "application/x-cdlink",
    "vda": "application/vda",
    "vivo": "video/vnd.vivo",
    "vrm": "x-world/x-vrml",
    "wav": "audio/x-wav",
    "wax": "audio/x-ms-wax",
    "wma": "audio/x-ms-wma",
    "wmv": "video/x-ms-wmv",
    "wmx": "video/x-ms-wmx",
    "wrl": "model/vrml",
    "wvx": "video/x-ms-wvx",
    "xbm": "image/x-xbitmap",
    "xlw": "application/vnd.ms-excel",
    "xml": "text/xml",
    "xpm": "image/x-xpixmap",
    "xwd": "image/x-xwindowdump",
    "xyz": "chemical/x-pdb",
    "zip": "application/zip"
  };

  this.charsets = {
    'text/javascript': 'UTF-8',
    'text/html': 'UTF-8'
  };

}();

var Response = function (resp) {
  this.resp = resp;
};

Response.prototype = new function () {
  this.send = function (content, statusCode, headers) {
    var success = !errors.errorTypes[statusCode];
    var s = statusCode || 200;
    var h = headers || {};
    this.writeHeaders(s, h);
    this.writeBody(content);
    this.finish(success);
  };

  this.sendFile = function (filepath) {
    var _this = this;
    var ext = fleegix.url.getFileExtension(filepath);
    var contentType = response.contentTypes[ext] || 'application/octet-stream';
    var encoding = 'binary';

    this.writeHeaders(200, {'Content-Type': contentType});

    // From Paperboy, http://github.com/felixge/node-paperboy
    fs.open(filepath, 'r', 0666, function (err, fd) {
      var pos = 0;
      var streamChunk = function () {
        fs.read(fd, 16 * 1024, pos, encoding,
            function (err, chunk, bytesRead) {
          if (!chunk) {
            fs.close(fd);
            _this.resp.end();
            log.debug('FILE: sent static file ' + filepath + '\nFinished handling request in ' +
                ((new Date().getTime()) - _this.resp.startTime) + ' ms').flush();
            geddy.app.nextReq();
            return;
          }

          _this.resp.write(chunk, encoding);
          pos += bytesRead;

          streamChunk();
        });
      }
      streamChunk();
    });

  };
  
  this.writeHeaders = function (statusCode, headers) {
    var contentType = headers['Content-Type'];
    var charset = response.charsets[contentType];
    if (charset) {
      contentType += '; charset: ' + charset;
    }
    this.resp.writeHead(statusCode, headers);
  };

  this.writeBody = function (content) {
    this.resp.write(content);
  };

  this.finish = function (success) {
    this.resp.end();
    if (success) {
      log.debug('Finished handling request in ' +
          ((new Date().getTime()) - this.resp.startTime) + ' ms').flush();
    }
    geddy.app.nextReq();
  };

}();

for (var p in response) { exports[p] = response[p]; }
exports.Response = Response;

