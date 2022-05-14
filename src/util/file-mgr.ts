// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var fs = require('fs');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var iconv = require('iconv-lite');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var Buffer = require('safe-buffer').Buffer;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var config = require('../config');
// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'isUtf8'.
var isUtf8 = require('./is-utf8');

var UTF8_RE = /^utf-?8$/i;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
var isWin32 = process.platform === 'win32';
var MAX_SIZE = 1024 * 1024 * 64;
var LOCAL_FILES = config.LOCAL_FILES;
var LOCAL_FILE_PATH_RE = /^(\/*\$(?:whistle|w2)\/)/i;
var CRLF = Buffer.from('\r\n');
var RSLASH_RE = /\\/g;
// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'noop'.
var noop = function (_: any) {
  return _;
};

// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'toBuffer'.
function toBuffer(buf: any, charset: any) {
  if (buf == null || Buffer.isBuffer(buf)) {
    return buf;
  }
  buf += '';
  if (charset && typeof charset === 'string' && !UTF8_RE.test(charset)) {
    try {
      charset = charset.toLowerCase();
      if (charset === 'base64') {
        return Buffer.from(buf, 'base64');
      }
      return iconv.encode(buf, charset);
    } catch (e) {}
  }
  return Buffer.from(buf);
}

function convertSlash(filePath: any) {
  if (LOCAL_FILE_PATH_RE.test(filePath)) {
    filePath = LOCAL_FILES + '/' + filePath.substring(RegExp.$1.length);
  } else {
    filePath = config.getHomePath(filePath);
  }
  return isWin32 ? filePath : filePath.replace(RSLASH_RE, '/');
}

function decode(buf: any) {
  if (!Buffer.isBuffer(buf)) {
    return buf ? String(buf) : '';
  }
  if (!isUtf8(buf)) {
    try {
      return iconv.decode(buf, 'GB18030');
    } catch (e) {}
  }
  return String(buf);
}

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
function isString(path: any) {
  return path && typeof path === 'string';
}

function readSingleFile(path: any, callback: any) {
  if (!isString(path)) {
    return callback();
  }
  var stream = fs.createReadStream(convertSlash(path));
  var done: any, buf: any;
  var execCallback = function (err: any) {
    if (done) {
      return;
    }
    done = true;
    stream.close();
    callback(err ? null : buf);
  };
  stream.on('data', function (data: any) {
    if (done) {
      return;
    }
    buf = buf ? Buffer.concat([buf, data]) : data;
    if (buf.length > MAX_SIZE) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
      execCallback();
    }
  });
  stream.on('error', execCallback);
  stream.on('end', execCallback);
}

function getFileMap(list: any) {
  if (Array.isArray(list)) {
    list = list.join('|');
  }
  if (!isString(list)) {
    return '';
  }
  var fileMap = {};
  list = list.split('|');
  list.forEach(function (file: any) {
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    fileMap[file || ''] = 1;
  });
  return fileMap;
}

function readFileMap(list: any, callback: any, isText: any) {
  var fileMap = getFileMap(list);
  if (!fileMap) {
    return callback('');
  }
  var files = Object.keys(fileMap);
  var len = files.length;
  files.forEach(function (file) {
    readSingleFile(file, function (data: any) {
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      fileMap[file || ''] = isText ? decode(data) : data;
      if (--len <= 0) {
        callback(fileMap);
      }
    });
  });
}

function joinData(list: any, isText: any, charset: any) {
  if (!list || !list.length) {
    return '';
  }
  if (isText) {
    return list.filter(noop).join('\r\n');
  }
  var result: any = [];
  list.forEach(function (buf: any) {
    if (buf) {
      buf = toBuffer(buf, charset);
      result.push(buf, CRLF);
    }
  });
  result.pop();
  return result.length ? Buffer.concat(result) : '';
}

function readFileFromMap(path: any, fileMap: any, isText: any) {
  if (!isString(path)) {
    return '';
  }
  path = path.split('|');
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
  return joinData(
    path.map(function (file: any) {
      return fileMap[file || ''];
    }),
    isText
  );
}

function readFileList(list: any, callback: any, isText: any) {
  readFileMap(
    list,
    function (fileMap: any) {
      if (!fileMap) {
        return callback('');
      }
      var result: any = [];
      list.forEach(function (file: any) {
        result.push(readFileFromMap(file, fileMap, isText));
      });
      callback(result);
    },
    isText
  );
}

function readFile(path: any, callback: any) {
  if (!isString(path)) {
    return callback();
  }
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
  readFileList(path.split('|'), function (result: any) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 1.
    callback(joinData(result));
  });
}

function readFilesText(list: any, callback: any) {
  readFileList(list, callback, true);
}

function readFileText(path: any, callback: any) {
  if (!isString(path)) {
    return callback();
  }
  readFilesText(
    path.split('|'),
    function (result: any) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
      callback(joinData(result, true));
    },
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 3.
    true
  );
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.toBuffer = toBuffer;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.joinData = joinData;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.decode = decode;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.readFile = readFile;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.readFileList = readFileList;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.readFileText = readFileText;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.readFilesText = readFilesText;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.convertSlash = convertSlash;
