// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var os = require('os');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var path = require('path');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var fse = require('fs-extra2');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var fs = require('fs');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var pkgConf = require('../../package.json');

var HEAD_RE = /^head$/i;
var HOME_DIR_RE = /^[~～]\//;
var ILLEGAL_TRAILERS = [
  'host',
  'transfer-encoding',
  'content-length',
  'cache-control',
  'te',
  'max-forwards',
  'authorization',
  'set-cookie',
  'content-encoding',
  'content-type',
  'content-range',
  'trailer',
  'connection',
  'upgrade',
  'http2-settings',
  'proxy-connection',
  'transfer-encoding',
  'keep-alive'
];
var REMOTE_URL_RE = /^\s*((?:git[+@]|github:)[^\s]+\/whistle\.[a-z\d_-]+(?:\.git)?|https?:\/\/[^\s]+)\s*$/i;

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.REMOTE_URL_RE = REMOTE_URL_RE;

function isHead(req: any) {
  return HEAD_RE.test(req.method);
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.isHead = isHead;


// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getUpdateUrl = function(conf: any) {
  var url = conf.updateUrl;
  if (url && REMOTE_URL_RE.test(url) && url.length < 2100) {
    return url;
  }
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.noop = function () {};

// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'removeIPV6Prefix'.
function removeIPV6Prefix(ip: any) {
  if (typeof ip != 'string') {
    return '';
  }
  return ip.indexOf('::ffff:') === 0 ? ip.substring(7) : ip;
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.removeIPV6Prefix = removeIPV6Prefix;

// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'hasBody'.
function hasBody(res: any, req: any) {
  if (req && isHead(req)) {
    return false;
  }
  var statusCode = res.statusCode;
  return !(
    statusCode == 204 ||
    (statusCode >= 300 && statusCode < 400) ||
    (100 <= statusCode && statusCode <= 199)
  );
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.hasBody = hasBody;

function isEmptyObject(a: any) {
  if (a) {
    for (var i in a) { // eslint-disable-line
      return false;
    }
  }
  return true;
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.isEmptyObject = isEmptyObject;

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.lowerCaseify = function (obj: any, rawNames: any) {
  var result = {};
  if (!obj) {
    return result;
  }
  Object.keys(obj).forEach(function (name) {
    var value = obj[name];
    if (value !== undefined) {
      var key = name.toLowerCase();
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      result[key] = Array.isArray(value) ? value : value + '';
      if (rawNames) {
        rawNames[key] = name;
      }
    }
  });
  return result;
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.removeIllegalTrailers = function (headers: any) {
  ILLEGAL_TRAILERS.forEach(function (key) {
    delete headers[key];
  });
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.addTrailerNames = function (
  res: any,
  newTrailers: any,
  rawNames: any,
  delTrailers: any,
  req: any
) {
  if (!hasBody(res, req) || isEmptyObject(newTrailers)) {
    return;
  }
  var headers = res.headers;
  delete headers['content-length'];
  delete headers['transfer-encoding'];
  var nameMap = {};
  var curTrailers = headers.trailer;
  if (curTrailers) {
    if (typeof curTrailers === 'string') {
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      nameMap[curTrailers.toLowerCase()] = curTrailers;
    } else if (Array.isArray(curTrailers)) {
      curTrailers.forEach(function (key) {
        if (key && typeof key === 'string') {
          // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          nameMap[key.toLowerCase()] = key;
        }
      });
    }
  }
  Object.keys(newTrailers).forEach(function (key) {
    var lkey = key.toLowerCase();
    if (
      (!delTrailers || !delTrailers[lkey]) &&
      ILLEGAL_TRAILERS.indexOf(lkey) === -1
    ) {
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      nameMap[lkey] = key;
    }
  });
  if (rawNames && !rawNames.trailer) {
    rawNames.trailer = 'Trailer';
  }
  headers.trailer = Object.keys(nameMap).map(function (key) {
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    return nameMap[key];
  });
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.onResEnd = function (res: any, callback: any) {
  var state = res._readableState || '';
  if (state.endEmitted) {
    return callback();
  }
  res.on('end', callback);
};

var UPGRADE_RE = /^\s*upgrade\s*$/i;
var WS_RE = /^\s*websocket\s*$/i;
var CONNECT_RE = /^\s*CONNECT\s*$/i;
var CONNECT_PROTOS = 'connect:,socket:,tunnel:,conn:,tls:,tcp:'.split(',');

function isWebSocket(options: any, headers: any) {
  var p = options.protocol;
  if (p === 'ws:' || p === 'wss:' || options.method === 'UPGRADE') {
    return true;
  }
  return (
    headers &&
    UPGRADE_RE.test(headers.connection) &&
    WS_RE.test(headers.upgrade)
  );
}

function isConnect(options: any) {
  return (
    CONNECT_RE.test(options.method) ||
    CONNECT_PROTOS.indexOf(options.protocol) !== -1
  );
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.isWebSocket = isWebSocket;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.isConnect = isConnect;

var PROTOCOL_RE = /^[a-z0-9.-]+:\/\//i;

// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'hasProtocol'.
function hasProtocol(url: any) {
  return PROTOCOL_RE.test(url);
}

function setProtocol(url: any, isHttps: any) {
  return hasProtocol(url) ? url : (isHttps ? 'https://' : 'http://') + url;
}

function getProtocol(url: any) {
  return hasProtocol(url) ? url.substring(0, url.indexOf('://') + 1) : null;
}

// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'removeProtocol'.
function removeProtocol(url: any, clear: any) {
  return hasProtocol(url)
    ? url.substring(url.indexOf('://') + (clear ? 3 : 1))
    : url;
}

function replaceProtocol(url: any, protocol: any) {
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
  return (protocol || 'http:') + removeProtocol(url);
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.hasProtocol = hasProtocol;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.setProtocol = setProtocol;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getProtocol = getProtocol;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.removeProtocol = removeProtocol;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.replaceProtocol = replaceProtocol;

// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'getHomedir'.
function getHomedir() {
  //默认设置为`~`，防止Linux在开机启动时Node无法获取homedir
  return (
    (typeof os.homedir == 'function'
      ? os.homedir()
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      : process.env[process.platform == 'win32' ? 'USERPROFILE' : 'HOME']) ||
    '~'
  );
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getHomedir = getHomedir;

// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'getHomePath'.
function getHomePath(dir: any) {
  if (!dir || !HOME_DIR_RE.test(dir)) {
    return dir;
  }
  return path.join(getHomedir(), '.' + dir.substring(1));
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getHomePath = getHomePath;

// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'getWhistlePath'.
function getWhistlePath() {
  return (
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    getHomePath(process.env.WHISTLE_PATH) ||
    path.join(getHomedir(), '.WhistleAppData')
  );
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getWhistlePath = getWhistlePath;

function getLogFile(name: any) {
  var whistlePath = getWhistlePath();
  fse.ensureDirSync(whistlePath);
  return path.join(whistlePath, pkgConf.name + (name ? '-' + name : '') + '.log');
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getLogFile = getLogFile;

function padLeft(n: any) {
  return n > 9 ? n + '' : '0' + n;
}

function getDate() {
  var date = new Date();
  return date.getFullYear() + padLeft(date.getMonth() + 1) + padLeft(date.getDate());
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.writeLogSync = function(msg: any) {
  try {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
    fs.writeFileSync(getLogFile(), msg, { flag: 'a' });
  } catch (e) {
    msg += '\r\n' +  e.stack;
    try {
      fs.writeFileSync(getLogFile('error'), msg, { flag: 'a' });
    } catch (e) {
      fs.writeFileSync(getLogFile(getDate()), msg + '\r\n' +  e.stack, { flag: 'a' });
    }
  }
};
