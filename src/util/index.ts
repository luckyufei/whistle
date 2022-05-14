// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var http = require('http');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var path = require('path');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var os = require('os');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var fs = require('fs');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var vm = require('vm');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var net = require('net');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var tls = require('tls');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var crypto = require('crypto');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var fse = require('fs-extra2');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var qs = require('querystring');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var extend = require('extend');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var LRU = require('lru-cache');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var json5 = require('json5');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var PassThrough = require('stream').PassThrough;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var iconv = require('iconv-lite');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var zlib = require('zlib');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var dns = require('dns');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var PipeStream = require('pipestream');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var Q = require('q');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var Buffer = require('safe-buffer').Buffer;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var protoMgr = require('../rules/protocols');
var protocols = protoMgr.protocols;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var logger = require('./logger');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var config = require('../config');
// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'isUtf8'.
var isUtf8 = require('./is-utf8');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var fileMgr = require('./file-mgr');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var httpMgr = require('./http-mgr');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var ReplacePatternTransform = require('./replace-pattern-transform');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var parseQuery = require('./parse-query');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var common = require('./common');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var proc = require('./process');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var parseUrl = require('./parse-url');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var h2Consts = config.enableH2 ? require('http2').constants : {};

// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'toBuffer'.
var toBuffer = fileMgr.toBuffer;
var pendingFiles = {};
var localIpCache = new LRU({ max: 120 });
var CRLF_RE = /\r\n|\r|\n/g;
var SEARCH_RE = /[?#].*$/;
var UTF8_OPTIONS = { encoding: 'utf8' };
var LOCALHOST = '127.0.0.1';
var aliasProtocols = protoMgr.aliasProtocols;
var CONTEXT = vm.createContext();
var END_WIDTH_SEP_RE = /[/\\]$/;
var GEN_URL_RE = /^\s*(?:https?:)?\/\/\w[^\s]*\s*$/i;
var G_NON_LATIN1_RE = /\s|[^\x00-\xFF]/gu;
var NON_LATIN1_RE = /[^\x00-\xFF]/;
var SCRIPT_START = toBuffer('<script>');
var SCRIPT_END = toBuffer('</script>');
var STYLE_START = toBuffer('<style>');
var STYLE_END = toBuffer('</style>');
var RAW_CRLF_RE = /\\n|\\r/g;
var NUM_RE = /^\d+$/;
var DIG_RE = /^[+-]?[1-9]\d*$/;
var INDEX_RE = /^\[(\d+)\]$/;
var ARR_FILED_RE = /(.)?(?:\[(\d+)\])$/;
var PROXY_RE = /^x?(?:socks|https?-proxy|proxy|internal(?:-https)?-proxy)$/;
var DEFAULT_REGISTRY = 'https://registry.npmjs.org';
var HTTP_RE = /^https?:\/\/[^/?]/;
var SEP_RE = /[|&]/;
var ctxTimer: any;
var END_RE = /[/\\]$/;
var resetContext = function () {
  ctxTimer = null;
  CONTEXT = vm.createContext();
};
var SUB_MATCH_RE = /\$[&\d]/;
var HTTP_URL_RE = /^https?:\/\//;
var PROTO_NAME_RE = /^([\w.-]+):\/\//;
// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'replacePattern'.
var replacePattern = ReplacePatternTransform.replacePattern;
var CIPHER_OPTIONS = [
  'NULL-SHA256',
  'AES128-SHA256',
  'AES256-SHA256',
  'AES128-GCM-SHA256',
  'AES256-GCM-SHA384',
  'DH-RSA-AES128-SHA256',
  'DH-RSA-AES256-SHA256',
  'DH-RSA-AES128-GCM-SHA256',
  'DH-RSA-AES256-GCM-SHA384',
  'DH-DSS-AES128-SHA256',
  'DH-DSS-AES256-SHA256',
  'DH-DSS-AES128-GCM-SHA256',
  'DH-DSS-AES256-GCM-SHA384',
  'DHE-RSA-AES128-SHA256',
  'DHE-RSA-AES256-SHA256',
  'DHE-RSA-AES128-GCM-SHA256',
  'DHE-RSA-AES256-GCM-SHA384',
  'DHE-DSS-AES128-SHA256',
  'DHE-DSS-AES256-SHA256',
  'DHE-DSS-AES128-GCM-SHA256',
  'DHE-DSS-AES256-GCM-SHA384',
  'ECDHE-RSA-AES128-SHA256',
  'ECDHE-RSA-AES256-SHA384',
  'ECDHE-RSA-AES128-GCM-SHA256',
  'ECDHE-RSA-AES256-GCM-SHA384',
  'ECDHE-ECDSA-AES128-SHA256',
  'ECDHE-ECDSA-AES256-SHA384',
  'ECDHE-ECDSA-AES128-GCM-SHA256',
  'ECDHE-ECDSA-AES256-GCM-SHA384',
  'ADH-AES128-SHA256',
  'ADH-AES256-SHA256',
  'ADH-AES128-GCM-SHA256',
  'ADH-AES256-GCM-SHA384',
  'AES128-CCM',
  'AES256-CCM',
  'DHE-RSA-AES128-CCM',
  'DHE-RSA-AES256-CCM',
  'AES128-CCM8',
  'AES256-CCM8',
  'DHE-RSA-AES128-CCM8',
  'DHE-RSA-AES256-CCM8',
  'ECDHE-ECDSA-AES128-CCM',
  'ECDHE-ECDSA-AES256-CCM',
  'ECDHE-ECDSA-AES128-CCM8',
  'ECDHE-ECDSA-AES256-CCM8'
];
var TLSV2_CIPHERS = 'ECDHE-ECDSA-AES256-GCM-SHA384';
var EMPTY_BUFFER = toBuffer('');
var lowerCaseify = common.lowerCaseify;
// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'removeIPV6Prefix'.
var removeIPV6Prefix = common.removeIPV6Prefix;
// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'hasBody'.
var hasBody = common.hasBody;
// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'hasProtocol'.
var hasProtocol = common.hasProtocol;
// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'removeProtocol'.
var removeProtocol = common.removeProtocol;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
var workerIndex = process.env && process.env.workerIndex;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
var INTERNAL_ID = process.pid + '-' + Math.random();
var pluginMgr;

workerIndex = workerIndex >= 0 ? padReqId(config.workerIndex) : '';

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.hasProtocol = hasProtocol;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.removeProtocol = removeProtocol;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.setProtocol = common.setProtocol;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getProtocol = common.getProtocol;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.replaceProtocol = common.replaceProtocol;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.workerIndex = workerIndex;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.proc = proc;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.INTERNAL_ID = INTERNAL_ID;
// 避免属性被 stringify ，减少冗余数据传给前端
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.PLUGIN_VALUES =
  typeof Symbol === 'undefined' ? '_values' : Symbol('_values'); // eslint-disable-line
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.PLUGIN_MENU_CONFIG =
  typeof Symbol === 'undefined' ? '_menuConfig' : Symbol('_menuConfig'); // eslint-disable-line
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.PLUGIN_INSPECTOR_CONFIG =
  typeof Symbol === 'undefined'
    ? '_inspectorConfig'
    : Symbol('_inspectorConfig'); // eslint-disable-line
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.drain = require('./drain');
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.isWin = process.platform === 'win32';
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.isUtf8 = isUtf8;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.WhistleTransform = require('./whistle-transform');
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.ReplacePatternTransform = ReplacePatternTransform;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.replacePattern = replacePattern;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.ReplaceStringTransform = require('./replace-string-transform');
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.SpeedTransform = require('./speed-transform');
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.FileWriterTransform = require('./file-writer-transform');
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getServer = require('hagent').getServer;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.parseUrl = parseUrl;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.request = httpMgr.request;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.parseQuery = parseQuery;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.localIpCache = localIpCache;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.listenerCount = require('./patch').listenerCount;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.EMPTY_BUFFER = EMPTY_BUFFER;

// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'noop'.
function noop(_: any) {
  return _;
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.noop = noop;

function isUrl(str: any) {
  return HTTP_URL_RE.test(str);
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.isUrl = isUrl;

function isCiphersError(e: any) {
  return (
    e.code === 'EPROTO' ||
    String(e.message).indexOf(
      'disconnected before secure TLS connection was established'
    ) !== -1
  );
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.isCiphersError = isCiphersError;

function wrapJs(js: any, charset: any, isUrl: any) {
  if (!js) {
    return '';
  }
  if (isUrl) {
    return toBuffer('<script src="' + js + '"></script>', charset);
  }
  return Buffer.concat([SCRIPT_START, toBuffer(js, charset), SCRIPT_END]);
}

function wrapCss(css: any, charset: any, isUrl: any) {
  if (!css) {
    return '';
  }
  if (isUrl) {
    return toBuffer('<link rel="stylesheet" href="' + css + '" />', charset);
  }
  return Buffer.concat([STYLE_START, toBuffer(css, charset), STYLE_END]);
}

function evalJson(str: any) {
  try {
    return json5.parse(str);
  } catch (e) {}
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.parseRawJson = function (str: any) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return evalJson(str);
  }
};

function getRegistry(pkg: any) {
  var registry = pkg.whistleConfig && pkg.whistleConfig.registry;
  if (!registry || !HTTP_RE.test(registry)) {
    return;
  }
  return registry === DEFAULT_REGISTRY ? undefined : registry;
}

var MAX_LEN = 1024 * 1024 * 5;

function getLatestVersion(registry: any, cb: any) {
  if (registry && typeof registry !== 'string') {
    var name = registry.moduleName;
    registry = registry.registry;
    if (registry) {
      registry += '/' + name;
    }
  }
  if (!registry) {
    return cb();
  }
  httpMgr.request(
    {
      url: registry,
      maxLength: MAX_LEN
    },
    function (err: any, body: any, res: any) {
      if (err || res.statusCode !== 200) {
        body = null;
      } else if (body) {
        body = parseJSON(body);
      }
      body = body && body['dist-tags'];
      cb(body && body['latest']);
    }
  );
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getRegistry = getRegistry;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getLatestVersion = getLatestVersion;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.isEmptyObject = common.isEmptyObject;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.addTrailerNames = common.addTrailerNames;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.removeIllegalTrailers = common.removeIllegalTrailers;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.isHead = common.isHead;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.hasBody = hasBody;

var ESTABLISHED_CTN =
  'HTTP/1.1 200 Connection Established\r\nProxy-Agent: ' +
  config.name +
  '\r\n\r\n';
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.setEstablished = function (socket: any) {
  socket.write(ESTABLISHED_CTN);
};

function changePort(url: any, port: any) {
  var index = url.indexOf('/', url.indexOf('://') + 3);
  if (index != -1) {
    var host = url.substring(0, index).replace(/:\d*$/, '');
    url = host + ':' + port + url.substring(index);
  }
  return url;
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.changePort = changePort;

function handleStatusCode(statusCode: any, headers: any) {
  if (statusCode == 401) {
    headers['www-authenticate'] = 'Basic realm=User Login';
  }
  return headers;
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.handleStatusCode = handleStatusCode;

function getStatusCode(statusCode: any) {
  statusCode |= 0;
  return statusCode < 100 || statusCode > 999 ? 0 : statusCode;
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getStatusCode = getStatusCode;

function compare(v1: any, v2: any) {
  return v1 == v2 ? 0 : v1 > v2 ? -1 : 1;
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.compare = compare;

var scriptCache = {};
var VM_OPTIONS = {
  displayErrors: false,
  timeout: 60
};
var MAX_SCRIPT_SIZE = 1024 * 256;
var MAX_SCRIPT_CACHE_COUNT = 64;
var MIN_SCRIPT_CACHE_COUNT = 32;

function getScript(content: any) {
  content = content.trim();
  var len = content.length;
  if (!len || len > MAX_SCRIPT_SIZE) {
    return;
  }

  // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  var script = scriptCache[content];
  // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  delete scriptCache[content];

  var list = Object.keys(scriptCache);
  if (list.length > MAX_SCRIPT_CACHE_COUNT) {
    list = list
      .map(function (content) {
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        var script = scriptCache[content];
        script.content = content;
        return script;
      })
      .sort(function (a, b) {
        return compare(a.time, b.time);
      })
      .splice(0, MIN_SCRIPT_CACHE_COUNT);

    scriptCache = {};
    list.forEach(function (script) {
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      scriptCache[script.content] = {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'script' does not exist on type 'string'.
        script: script.script,
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'time' does not exist on type 'string'.
        time: script.time
      };
    });
  }

  // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  script = scriptCache[content] = script || {
    script: new vm.Script('(function(){\n' + content + '\n})()')
  };
  script.time = Date.now();

  return script.script;
}

function clearContext() {
  Object.keys(CONTEXT).forEach(function (key) {
    delete CONTEXT[key];
  });
  if (!ctxTimer) {
    ctxTimer = setTimeout(resetContext, 30000);
  }
}

function execScriptSync(script: any, context: any) {
  try {
    if ((script = getScript(script))) {
      CONTEXT.console = {};
      ['fatal', 'error', 'warn', 'info', 'log', 'debug'].forEach(function (
        level
      ) {
        CONTEXT.console[level] = logger[level];
      });
      Object.keys(context).forEach(function (key) {
        CONTEXT[key] = context[key];
      });
      script.runInContext(CONTEXT, VM_OPTIONS);
    }
    return true;
  } catch (e) {
    logger.error(e);
  } finally {
    clearContext();
  }
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.execScriptSync = execScriptSync;

// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'stat'.
function stat(file: any, callback: any, force: any) {
  if (force) {
    return callback(true);
  }
  fs.stat(file, function (err: any) {
    if (!err || err.code === 'ENOTDIR') {
      return callback();
    }
    if (err.code === 'ENOENT') {
      return callback(true);
    }
    fs.stat(file, callback);
  });
}

function getFileWriter(file: any, callback: any, force: any) {
  if (!file) {
    return callback();
  }
  if (END_RE.test(file)) {
    file = path.join(file, 'index.html');
  }
  // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  if (!force && pendingFiles[file]) {
    return callback();
  }
  var execCb = function (writer: any) {
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    delete pendingFiles[file];
    callback(writer);
  };
  // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  pendingFiles[file] = 1;
  stat(
    file,
    function (notExists: any) {
      if (!notExists) {
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
        return execCb();
      }
      fse.ensureFile(file, function (err: any) {
        if (err) {
          logger.error(err);
          // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
          return execCb();
        }
        execCb(fs.createWriteStream(file).on('error', logger.error));
      });
    },
    force
  );
}

function getFileWriters(files: any, callback: any, force: any) {
  if (!Array.isArray(files)) {
    files = [files];
  }

  Q.all(
    files.map(function (file: any) {
      var defer = Q.defer();
      getFileWriter(
        file,
        function (writer: any) {
          defer.resolve(writer);
        },
        force
      );
      return defer.promise;
    })
  ).spread(callback);
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getFileWriters = getFileWriters;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.toBuffer = toBuffer;

function getErrorStack(err: any) {
  if (!err) {
    return '';
  }

  var stack;
  try {
    stack = err.stack;
  } catch (e) {}
  stack = stack || err.message || err;
  var result = [
    'From: ' + config.name + '@' + config.version,
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    'Node: ' + process.version,
    'Date: ' + formatDate(),
    stack
  ];
  return result.join('\r\n');
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getErrorStack = getErrorStack;

function formatDate(now: any) {
  now = now || new Date();
  return now.toLocaleString();
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.formatDate = formatDate;

var REG_EXP_RE = /^\/(.+)\/(i?u?|ui)$/;

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.isRegExp = function isRegExp(regExp: any) {
  return REG_EXP_RE.test(regExp);
};

var ORIG_REG_EXP = /^\/(.+)\/([igmu]{0,4})$/;

function isOriginalRegExp(regExp: any) {
  if (!ORIG_REG_EXP.test(regExp) || /[igmu]{2}/.test(regExp.$2)) {
    return false;
  }

  return true;
}
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.isOriginalRegExp = isOriginalRegExp;

function toOriginalRegExp(regExp: any) {
  regExp = ORIG_REG_EXP.test(regExp);
  try {
    regExp = regExp && new RegExp(RegExp.$1, RegExp.$2);
  } catch (e) {
    regExp = null;
  }
  return regExp;
}
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.toOriginalRegExp = toOriginalRegExp;

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.emitError = function (obj: any, err: any) {
  if (obj) {
    obj.once('error', noop);
    obj.emit('error', err || new Error('Unknown'));
  }
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.indexOfList = require('./buf-util').indexOf;

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.startWithList = function (buf: any, subBuf: any, start: any) {
  var len = subBuf.length;
  if (!len) {
    return false;
  }

  start = start || 0;
  for (var i = 0; i < len; i++) {
    if (buf[i + start] != subBuf[i]) {
      return false;
    }
  }

  return true;
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.endWithList = function (buf: any, subBuf: any, end: any) {
  var subLen = subBuf.length;
  if (!subLen) {
    return false;
  }
  if (!(end >= 0)) {
    end = buf.length - 1;
  }

  for (var i = 0; i < subLen; i++) {
    if (subBuf[subLen - i - 1] != buf[end - i]) {
      return false;
    }
  }

  return true;
};

function isEnable(req: any, name: any) {
  return req.enable[name] && !req.disable[name];
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.isEnable = isEnable;

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getInternalHost = function (req: any, host: any) {
  if (isEnable(req, 'useLocalHost')) {
    return 'local.wproxy.org';
  }
  if (host && isEnable(req, 'useSafePort')) {
    var index = host.indexOf(':');
    if (index !== -1) {
      host = host.substring(0, index);
    }
    host += ':8899';
  }
  return host;
};

function isAuthCapture(req: any) {
  var e = req.enable || '';
  var d = req.disable || '';
  return (
    (e.authCapture || e.authIntercept) && !d.authCapture && !d.authIntercept
  );
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.isAuthCapture = isAuthCapture;

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.toRegExp = function toRegExp(regExp: any, ignoreCase: any) {
  regExp = REG_EXP_RE.test(regExp);
  try {
    regExp = regExp && new RegExp(RegExp.$1, ignoreCase ? 'i' : RegExp.$2);
  } catch (e) {
    regExp = null;
  }
  return regExp;
};

var HTTP_PORT_RE = /:80$/;
var HTTPS_PORT_RE = /:443$/;

function removeDefaultPort(host: any, isHttps: any) {
  return host && host.replace(isHttps ? HTTPS_PORT_RE : HTTP_PORT_RE, '');
}

function isString(str: any) {
  return str && typeof str === 'string';
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.isString = isString;

function getFullUrl(req: any) {
  var headers = req.headers;
  var host = headers[config.REAL_HOST_HEADER];
  if (hasProtocol(req.url)) {
    var options = parseUrl(req.url);
    if (
      options.protocol === 'https:' ||
      (req.isWs && options.protocol === 'wss:')
    ) {
      req.isHttps = true;
    }
    req.url = options.path;
    if (options.host) {
      headers.host = options.host;
    }
  } else {
    req.url = req.url || '/';
    if (req.url[0] !== '/') {
      req.url = '/' + req.url;
    }
  }
  if (host) {
    delete headers[config.REAL_HOST_HEADER];
  }
  if (!isString(host)) {
    host = headers.host;
    if (typeof host !== 'string') {
      host = headers.host = '';
    }
  } else if (headers.host !== host) {
    if (isString(headers.host)) {
      req._fwdHost = headers.host;
    }
    headers.host = host;
  }
  host = removeDefaultPort(host, req.isHttps);
  var fullUrl = host + req.url;
  if (req.isWs) {
    return (req.isHttps ? 'wss://' : 'ws://') + fullUrl;
  }
  return (req.isHttps ? 'https://' : 'http://') + fullUrl;
}
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getFullUrl = getFullUrl;

function disableCSP(headers: any) {
  delete headers['content-security-policy'];
  delete headers['content-security-policy-report-only'];
  delete headers['x-content-security-policy'];
  delete headers['x-content-security-policy-report-only'];
  delete headers['x-webkit-csp'];
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.disableCSP = disableCSP;

var interfaces = os.networkInterfaces();
var hostname = os.hostname();
var simpleHostname = '';
var cpus = os.cpus();
var addressList: any = [];
(function updateSystyemInfo() {
  interfaces = os.networkInterfaces();
  hostname = os.hostname();
  addressList = [];
  for (var i in interfaces) {
    var list = interfaces[i];
    if (Array.isArray(list)) {
      list.forEach(function (info) {
        addressList.push(info.address.toLowerCase());
      });
    }
  }
  setTimeout(updateSystyemInfo, 30000);
})();

if (isString(hostname)) {
  simpleHostname = hostname.replace(/[^\w.-]+/g, '').substring(0, 20);
  simpleHostname = simpleHostname ? simpleHostname + '.' : '';
}

var clientId = [
  hostname,
  os.platform(),
  os.release(),
  os.arch(),
  cpus.length,
  cpus[0] && cpus[0].model,
  config.clientId
];
// @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'any[]'.
clientId = config.clientId =
  simpleHostname +
  crypto
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'createHmac' does not exist on type 'Cryp... Remove this comment to see the full error message
    .createHmac('sha256', config.CLIENT_ID_HEADER)
    .update(clientId.join('\r\n'))
    .digest('base64');
config.runtimeId =
  simpleHostname +
  crypto
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'createHmac' does not exist on type 'Cryp... Remove this comment to see the full error message
    .createHmac('sha256', config.CLIENT_ID_HEADER)
    .update(clientId + '\r\n' + Math.random() + '\r\n' + Date.now())
    .digest('base64') +
  '/' +
  config.port;
config.runtimeHeaders = { 'x-whistle-runtime-id': config.runtimeId };
config.pluginHeaders = {
  'x-whistle-runtime-id': config.runtimeId,
  'x-whistle-internal-id': INTERNAL_ID
};
config.pluginHeaders[config.PLUGIN_HOOK_NAME_HEADER] = config.PLUGIN_HOOKS.UI;

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.setClientId = function (
  headers: any,
  enable: any,
  disable: any,
  clientIp: any,
  isInternalProxy: any
) {
  if (disable && (disable.clientId || disable.clientID || disable.clientid)) {
    return;
  }
  enable = enable || '';
  if (
    enable.clientId ||
    enable.clientID ||
    enable.clientid ||
    isInternalProxy
  ) {
    var id = getClientId(headers);
    if (
      (enable.multiClient || isInternalProxy) &&
      !enable.singleClient &&
      !disable.multiClient
    ) {
      if (headers[config.CLIENT_ID_HEADER]) {
        return;
      }
      if (!isLocalAddress(clientIp)) {
        id += '/' + clientIp;
      }
    }
    headers[config.CLIENT_ID_HEADER] = id;
  }
};

function getClientId(headers: any) {
  var id = headers[config.CLIENT_ID_HEADER];
  var idKey = config.cidKey;
  if (!idKey || (id && !config.overCidKey)) {
    return id || clientId;
  }
  return headers[idKey] || id || clientId;
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getClientId = getClientId;

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getUpdateUrl = common.getUpdateUrl;

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getTunnelKey = function (conf: any) {
  var tunnelKey = conf.tunnelKey || conf.tunnelKeys;
  if (tunnelKey && typeof tunnelKey === 'string') {
    tunnelKey = tunnelKey.toLowerCase().split(/[:,|]/);
    tunnelKey = tunnelKey.map(trim).filter(noop);
    return tunnelKey.slice(0, 10);
  }
};

function getComposerClientId(headers: any) {
  var clientId = headers[config.COMPOSER_CLIENT_ID_HEADER];
  if (clientId) {
    delete headers[config.COMPOSER_CLIENT_ID_HEADER];
    return clientId;
  }
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getComposerClientId = getComposerClientId;

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.removeClientId = function (headers: any) {
  delete headers[config.CLIENT_ID_HEADER];
};

function networkInterfaces() {
  return interfaces;
}

function getHostname() {
  return hostname;
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.networkInterfaces = networkInterfaces;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.hostname = getHostname;

function getProxyTunnelPath(req: any, isHttps: any) {
  var host = req._phost && req._proxyTunnel && req.headers.host;
  if (isString(host)) {
    return host.indexOf(':') !== -1 ? host : host + ':' + (isHttps ? 443 : 80);
  }
}
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getProxyTunnelPath = getProxyTunnelPath;

function isLocalAddress(address: any) {
  if (isLocalIp(address)) {
    return true;
  }
  address = address.toLowerCase();
  if (address[0] === '[') {
    address = address.slice(1, -1);
  }
  if (address == '0:0:0:0:0:0:0:1') {
    return true;
  }
  return localIpCache.get(address) || addressList.indexOf(address) !== -1;
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.isLocalAddress = isLocalAddress;

function isLocalHost(host: any) {
  return host === 'localhost' || isLocalAddress(host);
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.isLocalHost = isLocalHost;

function parseHost(host: any) {
  if (host[0] === '[') {
    var index = host.indexOf(']');
    host = [host.substring(1, index), host.substring(index + 2)];
  } else {
    host = host.split(':');
  }
  return host;
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.parseHost = parseHost;

/**
 * 解析一些字符时，encodeURIComponent可能会抛异常，对这种字符不做任何处理
 * see: http://stackoverflow.com/questions/16868415/encodeuricomponent-throws-an-exception
 * @param ch
 * @returns
 */
function safeEncodeURIComponent(ch: any) {
  try {
    return encodeURIComponent(ch);
  } catch (e) {}

  return ch;
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.encodeNonLatin1Char = function (str: any) {
  if (!isString(str)) {
    return '';
  }
  return str.replace(G_NON_LATIN1_RE, safeEncodeURIComponent);
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.encodeURIComponent = safeEncodeURIComponent;

function getPath(url: any, noProtocol: any) {
  if (url) {
    url = url.replace(SEARCH_RE, '');
    var index = noProtocol ? -1 : url.indexOf('://');
    url = index > -1 ? url.substring(index + 3) : url;
  }

  return url;
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getPath = getPath;

function getFilename(url: any) {
  if (typeof url == 'string' && (url = getPath(url).trim())) {
    var index = url.lastIndexOf('/');
    if (index != -1) {
      url = url.substring(index + 1);
    } else {
      url = null;
    }
  } else {
    url = null;
  }

  return url || 'index.html';
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getFilename = getFilename;

function disableReqCache(headers: any) {
  delete headers['if-modified-since'];
  delete headers['if-none-match'];
  delete headers['last-modified'];
  delete headers.etag;

  headers['pragma'] = 'no-cache';
  headers['cache-control'] = 'no-cache';
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.disableReqCache = disableReqCache;

function disableResStore(headers: any) {
  headers['cache-control'] = 'no-store';
  // @ts-expect-error ts-migrate(2551) FIXME: Property 'toGMTString' does not exist on type 'Dat... Remove this comment to see the full error message
  headers['expires'] = new Date(Date.now() - 60000000).toGMTString();
  headers['pragma'] = 'no-cache';
  delete headers.tag;
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.disableResStore = disableResStore;

function parsePathReplace(urlPath: any, params: any) {
  if (!params || !/^(?:ws|http)s?:/.test(urlPath)) {
    return;
  }
  var index = urlPath.indexOf('://');
  if (index == -1) {
    return;
  }
  index = urlPath.indexOf('/', index + 3) + 1;
  if (index <= 0) {
    return;
  }

  var root = urlPath.substring(0, index);
  urlPath = urlPath.substring(index);

  Object.keys(params).forEach(function (pattern) {
    var value = params[pattern];
    value = value == null ? '' : value + '';
    if (isOriginalRegExp(pattern) && (pattern = toOriginalRegExp(pattern))) {
      urlPath = urlPath.replace(pattern, value);
    } else if (pattern) {
      urlPath = urlPath.split(pattern).join(value);
    }
  });
  root += urlPath;
  return root !== urlPath ? root : null;
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.parsePathReplace = parsePathReplace;

function wrapResponse(res: any) {
  var passThrough = new PassThrough();
  passThrough.statusCode = res.statusCode;
  passThrough.rawHeaderNames = res.rawHeaderNames;
  passThrough.headers = lowerCaseify(res.headers);
  passThrough.headers['x-server'] = config.name;
  res.body != null &&
    passThrough.push(Buffer.isBuffer(res.body) ? res.body : String(res.body));
  passThrough.push(null);
  passThrough.isCustomRes = true;
  return passThrough;
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.wrapResponse = wrapResponse;

function wrapGatewayError(body: any) {
  return wrapResponse({
    statusCode: 502,
    headers: {
      'content-type': 'text/html; charset=utf8'
    },
    body: body
      ? '<pre>\n' +
        body +
        '\n\n\n<a href="javascript:;" onclick="location.reload()"' +
        '>Reload this page</a>\n</pre>'
      : ''
  });
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.wrapGatewayError = wrapGatewayError;

function sendStatusCodeError(cltRes: any, svrRes: any) {
  delete svrRes.headers['content-length'];
  cltRes.writeHead(502, svrRes.headers);
  cltRes.src(wrapGatewayError('Invalid status code: ' + svrRes.statusCode));
}
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.sendStatusCodeError = sendStatusCodeError;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getQueryValue = function (value: any) {
  if (value && typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch (e) {}
  }
  return value || '';
};

var KV_RE = /^([^:=&]+):([^=&]*)$/;

function parseInlineJSON(text: any, isValue: any) {
  if (/\s/.test(text) || (!isValue && /\\|\//.test(text) && text[0] !== '&')) {
    return;
  }
  if (KV_RE.test(text)) {
    var data = {};
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    data[RegExp.$1] = RegExp.$2;
    return data;
  }
  return parseQuery(text, null, null, true);
}

function replaceCrLf(char: any) {
  return char === '\\r' ? '\r' : '\n';
}

function parseLinesJSON(text: any) {
  if (!isString(text) || !(text = text.trim())) {
    return null;
  }
  var first = text[0];
  var last = text[text.length - 1];
  if ((first === '[' && last === ']') || (first === '{' && last === '}')) {
    return null;
  }
  var result: any;
  text.split(/\r\n|\n|\r/g).forEach(function (line: any) {
    if (!(line = line.trim())) {
      return;
    }
    var index = line.indexOf(': ');
    if (index === -1) {
      index = line.indexOf(':');
      if (index === -1) {
        index = line.indexOf('=');
      }
    }
    var name, value: any, arrIndex;
    if (index != -1) {
      name = line.substring(0, index).trim();
      value = line.substring(index + 1).trim();
      if (value) {
        var fv = value[0];
        var lv = value[value.length - 1];
        if (fv === lv) {
          if (fv === '"' || fv === '\'' || fv === '`') {
            value = value.slice(1, -1);
          }
          if (
            value &&
            fv === '`' &&
            (value.indexOf('\\n') !== -1 || value.indexOf('\\r') !== -1)
          ) {
            value = value.replace(RAW_CRLF_RE, replaceCrLf);
          }
        } else if (value === '0') {
          value = 0;
        } else if (value.length < 16 && DIG_RE.test(value)) {
          try {
            value = parseInt(value, 10);
          } catch (e) {}
        }
      }
    } else {
      name = line.trim();
      value = '';
    }
    first = name[0];
    last = name[name.length - 1];
    if (first === last && last === '"') {
      name = name.slice(1, -1);
    } else if (first === '[' && last === ']') {
      name = name.slice(1, -1).trim();
      if (NUM_RE.test(name) || INDEX_RE.test(name)) {
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        name = RegExp.$1 || RegExp['$&'];
        result = result || [];
      } else {
        var keys = name.split(/\s*\.\s*/);
        name = keys.shift().trim();
        if (ARR_FILED_RE.test(name)) {
          var idx = RegExp.$2;
          if (RegExp.$1) {
            name = name.slice(0, -idx.length - 2);
            arrIndex = idx;
          } else {
            name = idx;
            result = result || [];
          }
        }
        if (keys.length) {
          keys.reverse().forEach(function (key: any) {
            var obj;
            if (ARR_FILED_RE.test(key)) {
              var idx2 = RegExp.$2;
              var arr: any = [];
              if (RegExp.$1) {
                obj = {};
                // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                obj[key.slice(0, -idx2.length - 2)] = arr;
                arr[idx2] = value;
                value = obj;
              } else {
                arr[idx2] = value;
                value = arr;
              }
            } else {
              obj = {};
              // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
              obj[key] = value;
              value = obj;
            }
          });
        }
      }
    }
    result = result || {};
    var list = result[name];
    if (list == null) {
      if (arrIndex) {
        var arr: any = [];
        arr[arrIndex] = value;
        result[name] = arr;
      } else {
        result[name] = value;
      }
    } else if (typeof list === 'object') {
      if (arrIndex) {
        list[arrIndex] = value;
      } else if (typeof value === 'object') {
        extend(true, list, value);
      }
    }
  });
  return result || {};
}

function parseJSON(data: any) {
  if (typeof data === 'object') {
    return data;
  }
  return parsePureJSON(data, true) || parseLinesJSON(data);
}

function parsePureJSON(data: any, isValue: any) {
  if (typeof data != 'string' || !(data = data.trim())) {
    return null;
  }

  try {
    return JSON.parse(data);
  } catch (e) {
    var result = evalJson(data);
    if (result) {
      return result;
    }
  }

  return parseInlineJSON(data, isValue);
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.parseJSON = parseJSON;

function readFileSync(file: any) {
  try {
    return fs.readFileSync(file, UTF8_OPTIONS);
  } catch (e) {}
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.readFileSync = readFileSync;

function trim(text: any) {
  return text && text.trim();
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.trim = trim;

function readInjectFiles(data: any, callback: any) {
  if (!data) {
    return callback();
  }

  fileMgr.readFilesText(
    [data.prepend, data.replace, data.append],
    function (result: any) {
      if (result[0]) {
        data.top = result[0];
      }
      if (result[1]) {
        data.body = result[1];
      }
      if (result[2]) {
        data.bottom = result[2];
      }
      callback(data);
    }
  );
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.readInjectFiles = readInjectFiles;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.lowerCaseify = lowerCaseify;

function parseHeaders(headers: any, rawNames: any) {
  if (typeof headers == 'string') {
    headers = headers.split(CRLF_RE);
  }
  var _headers = {};
  headers.forEach(function (line: any) {
    var index = line.indexOf(':');
    var value;
    if (index != -1) {
      value = line.substring(index + 1).trim();
      var rawName = line.substring(0, index).trim();
      var name = rawName.toLowerCase();
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      var list = _headers[name];
      if (rawNames) {
        rawNames[name] = rawName;
      }
      if (list) {
        if (!Array.isArray(list)) {
          // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          _headers[name] = list = [list];
        }
        list.push(value);
      } else {
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        _headers[name] = value;
      }
    }
  });

  return lowerCaseify(_headers);
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.parseHeaders = parseHeaders;

var QUERY_PARAM_RE = /^[^\/&=]+=/;

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.parseRuleJson = function(rules: any, callback: any, req: any) {
  if (!Array.isArray(rules)) {
    rules = [rules];
  }
  Q.all(
    rules.map(function (rule: any) {
      var defer = Q.defer();
      readRuleList(
        rule,
        function (data: any) {
          defer.resolve(data);
        },
        true,
        null,
        null,
        req
      );
      return defer.promise;
    })
  ).spread(callback);
};

function readRuleValue(rule: any, callback: any, checkUrl: any, needRawData: any, req: any, isJson: any) {
  if (!rule) {
    return callback();
  }
  if (rule.value) {
    return callback(removeProtocol(rule.value, true));
  }
  var filePath = getMatcherValue(rule);
  if (checkUrl && GEN_URL_RE.test(filePath)) {
    return callback(filePath);
  }
  var opts = pluginMgr.resolveKey(filePath, rule, req);
  var readFile: any;
  if (opts) {
    readFile = pluginMgr[needRawData ? 'requestBin' : 'requestText'];
    filePath = opts;
    isJson = false;
  } else {
    readFile = fileMgr[needRawData ? 'readFile' : 'readFileText'];
    filePath = decodePath(filePath);
    if (rule.root) {
      filePath = join(rule.root, filePath);
    }
  }
  if (isJson && filePath.indexOf('=') !== -1) {
    try {
      var handleStat = function(err: any, stat: any) {
        if (err || !stat || !stat.isFile()) {
          callback(filePath);
        } else {
          readFile(filePath, callback);
        }
      };
      return fs.stat(filePath, function(err: any, stat: any) {
        if (err && err.code !== 'ENOENT') {
          return fs.stat(filePath, handleStat);
        } else  {
          handleStat(err, stat);
        }
      });
    } catch (e) { }
  }
  readFile(filePath, callback);
}

function wrapTag(result: any, isBin: any, charset: any, wrap: any) {
  var list = [];
  var temp: any;
  result.forEach(function (data: any) {
    if (!data) {
      return;
    }
    if (typeof data !== 'string' || !GEN_URL_RE.test(data)) {
      temp = temp || [];
      temp.push(data);
      return;
    }
    temp && list.push(wrap(fileMgr.joinData(temp, !isBin, charset), charset));
    list.push(wrap(data.trim(), charset, true));
    temp = null;
  });
  temp && list.push(wrap(fileMgr.joinData(temp, !isBin, charset), charset));
  return list;
}
var CORS_RE = /^re[qs]Cors:\/\//;

function isDeep(result: any) {
  for (var i = 0, len = result.length; i < len; i++) {
    if (result[i] === true) {
      return true;
    }
  }
}

function readRuleList(rule: any, callback: any, isJson: any, charset: any, isHtml: any, req: any) {
  if (!rule) {
    return callback();
  }
  var len = rule.list && rule.list.length;
  var isBin = protoMgr.isBinProtocol(rule.name);
  var needRawData = isBin && !isJson;
  if (!len) {
    return readRuleValue(
      rule,
      isJson
        ? function (value: any) {
          callback(parseJSON(value));
        }
        : callback,
        false,
        needRawData,
        req,
        isJson
    );
  }
  var result: any = [];
  var isJsHtml = isHtml && isBin === 2;
  var isCssHtml = isHtml && isBin === 3;
  var execCallback = function () {
    if (--len > 0) {
      return;
    }
    if (isJson) {
      var deepMerge = isDeep(result);
      result = result.map(parseJSON).filter(noop);
      if (result.length > 1) {
        result.reverse();
        if (typeof result[0] !== 'object') {
          result[0] = {};
        }
        deepMerge && result.unshift(true);
        callback(extend.apply(null, result));
      } else {
        callback(result[0]);
      }
    } else {
      if (isJsHtml) {
        result = wrapTag(result, isBin, charset, wrapJs);
      } else if (isCssHtml) {
        result = wrapTag(result, isBin, charset, wrapCss);
      }
      if (rule.isRawList) {
        callback(result);
      } else {
        callback(fileMgr.joinData(result, !isBin, charset));
      }
    }
  };
  var isCors = CORS_RE.test(rule.matcher);
  var checkUrl = isJsHtml || isCssHtml;
  rule.list.forEach(function (r: any, i: any) {
    if (isJson) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      var value = removeProtocol(getMatcher(r), true);
      if (value) {
        var json =
          isCors && GEN_URL_RE.test(value)
            ? { origin: value.trim() }
            : parsePureJSON(value, QUERY_PARAM_RE.test(value));
        if (json) {
          result[i] = json;
          return execCallback();
        }
      }
    }
    readRuleValue(
      r,
      function (value: any) {
        result[i] = value;
        execCallback();
      },
      checkUrl,
      needRawData,
      req,
      isJson
    );
  });
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getRuleValue = function(rules: any, callback: any, noBody: any, charset: any, isHtml: any, req: any) {
  if (noBody || !rules) {
    return callback();
  }
  if (!Array.isArray(rules)) {
    rules = [rules];
  }

  Q.all(
    rules.map(function (rule: any) {
      var defer = Q.defer();
      readRuleList(
        rule,
        function (data: any) {
          defer.resolve(data);
        },
        false,
        charset,
        isHtml,
        req
      );
      return defer.promise;
    })
  ).spread(callback);
};

function decodePath(path: any) {
  path = getPath(path, true);
  try {
    return decodeURIComponent(path);
  } catch (e) {
    logger.error(e);
  }

  try {
    return qs.unescape(path);
  } catch (e) {
    logger.error(e);
  }

  return path;
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getRuleFiles = function(rule: any, req: any) {
  var files = rule.files || [getPath(getUrl(rule))];
  var root = rule.root;
  var rawFiles = rule.rawFiles || files;
  var result: any = [];
  files.map(function (file: any, i: any) {
    var opts = pluginMgr.resolveKey(rawFiles[i], rule, req);
    if (opts) {
      result.push(opts);
    } else {
      file = decodePath(file);
      file = fileMgr.convertSlash(root ? join(root, file) : file);
      if (END_WIDTH_SEP_RE.test(file)) {
        result.push(file.slice(0, -1));
        result.push(join(file, 'index.html'));
      } else {
        result.push(file);
      }
    }
  });
  return result;
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getRuleFile = function(rule: any) {
  var filePath = getPath(getUrl(rule));
  if (!filePath) {
    return filePath;
  }
  return rule.root
    ? join(rule.root, decodePath(filePath))
    : decodePath(filePath);
};

function getValue(rule: any) {
  return rule.value || rule.path;
}

function getMatcher(rule: any, raw: any) {
  rule = rule && (getValue(rule) || rule.matcher);
  if (rule && raw !== true) {
    rule = rule.trim();
  }
  return rule;
}

function getUrl(rule: any) {
  return rule && (getValue(rule) || rule.url);
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.rule = {
  getMatcher: getMatcher,
  getUrl: getUrl
};

function getMatcherValue(rule: any) {
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
  rule = getMatcher(rule);
  return rule && removeProtocol(rule, true);
}

function getUrlValue(rule: any, raw: any) {
  rule = getUrl(rule);
  if (rule && raw !== true) {
    rule = rule.trim();
  }
  return rule && removeProtocol(rule, true);
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getMatcherValue = getMatcherValue;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getUrlValue = getUrlValue;

function _getRawType(type: any) {
  return typeof type === 'string' ? type.split(';')[0].toLowerCase() : '';
}

function getRawType(data: any) {
  return _getRawType(data.headers && data.headers['content-type']);
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getRawType = getRawType;

function getContentType(contentType: any) {
  if (contentType && typeof contentType != 'string') {
    contentType = contentType['content-type'] || contentType.contentType;
  }
  contentType = _getRawType(contentType);
  if (!contentType) {
    return;
  }
  if (contentType.indexOf('javascript') != -1) {
    return 'JS';
  }

  if (contentType.indexOf('css') != -1) {
    return 'CSS';
  }

  if (contentType.indexOf('html') != -1) {
    return 'HTML';
  }

  if (contentType.indexOf('json') != -1) {
    return 'JSON';
  }

  if (contentType.indexOf('xml') != -1) {
    return 'XML';
  }

  if (contentType.indexOf('text/') != -1) {
    return 'TEXT';
  }

  if (contentType.indexOf('image/') != -1) {
    return 'IMG';
  }
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getContentType = getContentType;

function supportHtmlTransform(res: any, req: any) {
  var headers = res.headers;
  if (getContentType(headers) != 'HTML' || !hasBody(res, req)) {
    return false;
  }

  var contentEncoding = getContentEncoding(headers);
  //chrome新增了sdch压缩算法，对此类响应无法解码，deflate无法区分deflate还是deflateRaw
  return !contentEncoding || contentEncoding == 'gzip';
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.supportHtmlTransform = supportHtmlTransform;

function removeUnsupportsHeaders(headers: any, supportsDeflate: any) {
  //只保留支持的zip格式：gzip、deflate
  if (!headers || !headers['accept-encoding']) {
    return;
  }
  if (config.noGzip) {
    delete headers['accept-encoding'];
    return;
  }
  var list = headers['accept-encoding'].split(/\s*,\s*/g);
  var acceptEncoding = [];
  for (var i = 0, len = list.length; i < len; i++) {
    var ae = list[i].toLowerCase();
    if (ae && ((supportsDeflate && ae == 'deflate') || ae == 'gzip')) {
      acceptEncoding.push(ae);
    }
  }

  // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'any[]'.
  if ((acceptEncoding = acceptEncoding.join(', '))) {
    headers['accept-encoding'] = acceptEncoding;
  } else {
    delete headers['accept-encoding'];
  }
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.removeUnsupportsHeaders = removeUnsupportsHeaders;

function hasRequestBody(req: any) {
  req = typeof req == 'string' ? req : req.method;
  if (typeof req != 'string') {
    return false;
  }

  req = req.toUpperCase();
  return !(
    req === 'GET' ||
    req === 'HEAD' ||
    req === 'OPTIONS' ||
    req === 'CONNECT'
  );
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.hasRequestBody = hasRequestBody;

function getContentEncoding(headers: any) {
  var encoding = toLowerCase(
    (headers && headers['content-encoding']) || headers
  );
  return encoding === 'gzip' || encoding === 'deflate' ? encoding : null;
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getContentEncoding = getContentEncoding;

function getZipStream(headers: any) {
  switch (getContentEncoding(headers)) {
  case 'gzip':
    return zlib.createGzip();
  case 'deflate':
    return zlib.createDeflate();
  }
}

function getUnzipStream(headers: any) {
  switch (getContentEncoding(headers)) {
  case 'gzip':
    return zlib.createGunzip();
  case 'deflate':
    return zlib.createInflate();
  }
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getZipStream = getZipStream;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getUnzipStream = getUnzipStream;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.isWhistleTransformData = function (obj: any) {
  if (!obj) {
    return false;
  }
  if (obj.speed > 0 || obj.delay > 0) {
    return true;
  }
  return !!(obj.top || obj.body || obj.bottom);
};

function getPipeIconvStream(headers: any) {
  var pipeStream = new PipeStream();
  var charset = getCharset(headers['content-type']);

  if (charset) {
    pipeStream.addHead(iconv.decodeStream(charset));
    pipeStream.addTail(iconv.encodeStream(charset));
  } else {
    pipeStream.addHead(function (res: any, next: any) {
      var buffer: any, iconvDecoder: any;

      res.on('data', function (chunk: any) {
        buffer = buffer ? Buffer.concat([buffer, chunk]) : chunk;
        resolveCharset(buffer);
      });
      res.on('end', resolveCharset);

      function resolveCharset(chunk: any) {
        if (!charset) {
          if (chunk && buffer.length < 25600) {
            return;
          }
          charset = !buffer || isUtf8(buffer) ? 'utf8' : 'GB18030';
        }
        if (!iconvDecoder) {
          iconvDecoder = iconv.decodeStream(charset);
          next(iconvDecoder);
        }
        if (buffer) {
          iconvDecoder.write(buffer);
          buffer = null;
        }
        !chunk && iconvDecoder.end();
      }
    });

    pipeStream.addTail(function (src: any, next: any) {
      next(src.pipe(iconv.encodeStream(charset)));
    });
  }

  return pipeStream;
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getPipeIconvStream = getPipeIconvStream;

function toLowerCase(str: any) {
  return typeof str == 'string' ? str.trim().toLowerCase() : str;
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.toLowerCase = toLowerCase;

function toUpperCase(str: any) {
  return typeof str == 'string' ? str.trim().toUpperCase() : str;
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.toUpperCase = toUpperCase;

var CHARSET_RE = /charset=([\w-]+)/i;

function getCharset(str: any) {
  var charset;
  if (CHARSET_RE.test(str)) {
    charset = RegExp.$1;
    if (!iconv.encodingExists(charset)) {
      return;
    }
  }

  return charset;
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getCharset = getCharset;

function getClientIpFH(headers: any, name: any) {
  var val = headers[name];
  if (!isString(val)) {
    return '';
  }
  var index = val.indexOf(',');
  if (index !== -1) {
    val = val.substring(0, index);
  }
  val = removeIPV6Prefix(val.trim());
  return net.isIP(val) && !isLocalAddress(val) ? val : '';
}

function getForwardedFor(headers: any) {
  var ip = getClientIpFH(headers, config.CLIENT_IP_HEAD);
  var cipKey = config.cipKey;
  if (cipKey && (!ip || config.overCipKey)) {
    ip = getClientIpFH(headers, cipKey) || ip;
  }
  return ip;
}
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getForwardedFor = getForwardedFor;

function isLocalIp(ip: any) {
  if (!isString(ip)) {
    return true;
  }
  return ip.length < 7 || ip === LOCALHOST;
}

function getRemoteAddr(req: any) {
  try {
    var socket = req.socket || req;
    if (!socket._remoteAddr) {
      var ip = req.headers && req.headers[config.REMOTE_ADDR_HEAD];
      if (ip) {
        socket._remoteAddr = ip;
        delete req.headers[config.REMOTE_ADDR_HEAD];
      } else {
        socket._remoteAddr =
          removeIPV6Prefix(socket.remoteAddress) || LOCALHOST;
      }
    }
    return socket._remoteAddr;
  } catch (e) {}
  return LOCALHOST;
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getRemoteAddr = getRemoteAddr;

function getClientIp(req: any) {
  var ip = getForwardedFor(req.headers || {}) || getRemoteAddr(req);
  return isLocalIp(ip) ? LOCALHOST : ip;
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getClientIp = getClientIp;

function getRemotePort(req: any) {
  try {
    var socket = req.socket || req;
    if (socket._remotePort == null) {
      var port = req.headers && req.headers[config.REMOTE_PORT_HEAD];
      if (port) {
        delete req.headers[config.REMOTE_PORT_HEAD];
      } else {
        port = socket.remotePort;
      }
      socket._remotePort = port > 0 ? port : '0';
    }
    return socket._remotePort;
  } catch (e) {}
  return 0;
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getRemotePort = getRemotePort;

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getClientPort = function (req: any) {
  var headers = req.headers || {};
  var port = headers[config.CLIENT_PORT_HEAD];
  if (port > 0) {
    return port;
  }
  return getRemotePort(req);
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.removeIPV6Prefix = removeIPV6Prefix;

function isUrlEncoded(req: any) {
  return /^post$/i.test(req.method) &&
  /urlencoded/i.test(req.headers && req.headers['content-type']);
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.isUrlEncoded = isUrlEncoded;
function isJSONContent(req: any) {
  if (!hasRequestBody(req)) {
    return false;
  }
  return getContentType(req.headers) === 'JSON';
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.isJSONContent = isJSONContent;

function isProxyPort(proxyPort: any) {
  return (
    proxyPort == config.port ||
    proxyPort == config.httpsPort ||
    proxyPort == config.httpPort ||
    proxyPort == config.socksPort ||
    proxyPort == config.realPort
  );
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.isProxyPort = isProxyPort;

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.isLocalPHost = function(req: any, isHttps: any) {
  var phost = req._phost;
  var hostname = phost && phost.hostname;
  if (!hostname || !isProxyPort(phost.port || (isHttps ? 443 : 80))) {
    return false;
  }
  return isLocalHost(hostname);
};

function isMultipart(req: any) {
  return /multipart/i.test(req.headers['content-type']);
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.isMultipart = isMultipart;

function getQueryString(url: any) {
  var index = url.indexOf('?');
  return index == -1 ? '' : url.substring(index + 1);
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getQueryString = getQueryString;

function replaceQueryString(query: any, replaceQuery: any) {
  if (replaceQuery && typeof replaceQuery != 'string') {
    replaceQuery = qs.stringify(replaceQuery);
  }
  if (!query || !replaceQuery) {
    return query || replaceQuery;
  }

  var queryList: any = [];
  var params = {};
  var filterName = function (param: any) {
    var index = param.indexOf('=');
    var name, value;
    if (index == -1) {
      name = param;
      value = null;
    } else {
      name = param.substring(0, index);
      value = param.substring(index + 1);
    }

    var exists = name in params;
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    params[name] = value;
    return exists ? null : name;
  };

  query = query.split('&').map(filterName);
  replaceQuery = replaceQuery.split('&').map(filterName);
  query.concat(replaceQuery).forEach(function (name: any) {
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    var value = name ? params[name] : null;
    if (value != null) {
      queryList.push(name + '=' + value);
    }
  });

  return queryList.join('&');
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.replaceQueryString = replaceQueryString;

function replaceUrlQueryString(url: any, queryString: any) {
  if (!queryString) {
    return url;
  }
  url = url || '';
  var hashIndex = url.indexOf('#');
  var hashString = '';
  if (hashIndex != -1) {
    hashString = url.substring(hashIndex);
    url = url.substring(0, hashIndex);
  }
  queryString = replaceQueryString(getQueryString(url), queryString);

  return url.replace(/\?.*$/, '') +
  (queryString ? '?' + queryString : '') +
  hashString;
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.replaceUrlQueryString = replaceUrlQueryString;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.decodeBuffer = fileMgr.decode;

function setHeaders(data: any, obj: any) {
  data.headers = data.headers || {};
  for (var i in obj) {
    data.headers[i] = obj[i];
  }
  return data;
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.setHeaders = setHeaders;

// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'setHeader'.
function setHeader(data: any, name: any, value: any) {
  data.headers = data.headers || {};
  data.headers[name] = value;
  return data;
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.setHeader = setHeader;

function join(root: any, dir: any) {
  return root ? path.resolve(root, dir) : dir;
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.join = join;

function resolveProperties(list: any, result: any) {
  result = result || {};
  if (list) {
    list
      .map(getMatcherValue)
      .join('|')
      .split(SEP_RE)
      .forEach(function (action: any) {
        if (action) {
          result[action] = true;
        }
      });
  }
  return result;
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.resolveProperties = resolveProperties;

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.parseLineProps = function (str: any) {
  str = str && removeProtocol(str, true);
  if (!str) {
    return;
  }
  var result = {};
  str.split(SEP_RE).forEach(function (action: any) {
    if (action) {
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      result[action] = true;
    }
  });
  return result;
};

function resolveIgnore(ignore: any) {
  var keys = Object.keys(ignore);
  var exclude = {};
  var ignoreAll, disableIgnoreAll;
  ignore = {};
  keys.forEach(function (name) {
    if (name.indexOf('ignore.') === 0 || name.indexOf('ignore:') === 0) {
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      exclude[name.substring(7)] = 1;
      return;
    }
    if (name.indexOf('-') === 0 || name.indexOf('!') === 0) {
      name = name.substring(1);
      if (name === '*') {
        disableIgnoreAll = true;
      } else {
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        exclude[name] = 1;
      }
      return;
    }
    name = name.replace('ignore|', '');
    if (name === 'filter' || name === 'ignore') {
      return;
    }
    if (
      name === 'allRules' ||
      name === 'allProtocols' ||
      name === 'All' ||
      name === '*'
    ) {
      ignoreAll = true;
      return;
    }
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    ignore[aliasProtocols[name] || name] = 1;
  });
  if (ignoreAll && !disableIgnoreAll) {
    protocols.forEach(function (name: any) {
      ignore[name] = 1;
    });
    keys = protocols;
  } else {
    keys = Object.keys(ignore);
  }
  keys.forEach(function (name) {
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    if (exclude[name]) {
      delete ignore[name];
    }
  });
  return {
    ignoreAll: ignoreAll,
    exclude: exclude,
    ignore: ignore
  };
}

function resolveFilter(ignore: any, filter: any) {
  filter = filter || {};
  var result = resolveIgnore(ignore);
  ignore = result.ignore;
  Object.keys(ignore).forEach(function (name) {
    if (protocols.indexOf(name) === -1) {
      filter['ignore|' + name] = true;
    } else {
      filter[name] = true;
    }
  });
  Object.keys(result.exclude).forEach(function (name) {
    filter['ignore:' + name] = 1;
  });
  if (result.ignoreAll) {
    filter.allRules = 1;
  }
  return filter;
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.resolveFilter = resolveFilter;

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.isIgnored = function (filter: any, name: any) {
  return (
    !filter['ignore:' + name] && (filter[name] || filter['ignore|' + name])
  );
};

function exactIgnore(filter: any, rule: any) {
  if (filter['ignore|' + 'pattern=' + rule.rawPattern]) {
    return true;
  }
  if (filter['ignore|' + 'matcher=' + rule.matcher]) {
    return true;
  }
  return rule.rawMatcher && filter['ignore|' + 'matcher=' + rule.rawMatcher];
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.exactIgnore = exactIgnore;

function notSkip(props: any, name: any) {
  return props['-' + name] || props['!' + name];
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.checkSkip = function(skip: any, rule: any, curUrl: any) {
  if (skip['*'] && !notSkip(skip, '*')) {
    return true;
  }
  var proto = getProtocolName(rule.url || rule.matcher) || getProtocolName(curUrl);
  var name = rule.name;
  if ((skip[name] || skip[proto]) && !notSkip(skip, name) && !notSkip(skip, proto)) {
    return true;
  }
  return false;
};

function resolveRuleProps(rule: any, result: any) {
  result = result || {};
  if (rule) {
    rule.list.forEach(function (rule: any) {
      getMatcherValue(rule)
        .split(SEP_RE)
        .forEach(function (action: any) {
          result[action] = true;
        });
    });
  }
  return result;
}

var PLUGIN_RE = /^(?:plugin|whistle)\.[a-z\d_\-]+$/;
var enableRules = ['https', 'intercept', 'capture', 'hide'];

function ignorePlugins(rules: any, name: any, exclude: any) {
  var isPlugin = name === 'plugin';
  if (!isPlugin && !PLUGIN_RE.test(name)) {
    return;
  }
  if (rules.plugin) {
    var list = rules.plugin.list;
    for (var i = list.length - 1; i >= 0; i--) {
      var pName = getProtocolName(list[i].matcher);
      if ((isPlugin || name === pName) && !exclude[pName]) {
        list.splice(i, 1);
      }
    }
    if (!list.length) {
      delete rules.plugin;
    }
  }
  return true;
}

function getProtocolName(url: any) {
  return PROTO_NAME_RE.test(url) ? RegExp.$1 : '';
}

function ignoreForwardRule(rules: any, name: any, exclude: any) {
  var isRule = name === 'rule';
  if (!isRule && rules[name]) {
    return;
  }
  if (rules.rule) {
    var pName = getProtocolName(rules.rule.url);
    if ((isRule || name === pName) && !exclude[pName]) {
      delete rules.rule;
    }
  }
  return true;
}

function ignoreProxy(rules: any, name: any, exclude: any) {
  if (!rules.proxy) {
    return;
  }
  if (name === 'proxy') {
    delete rules.proxy;
    return true;
  }
  if (!PROXY_RE.test(name)) {
    return;
  }
  var pName = getProtocolName(rules.proxy.url);
  // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  var realName = aliasProtocols[name] || name;
  // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  var realPName = aliasProtocols[pName] || pName;
  if (realName === realPName && !exclude[pName] && !exclude[realPName]) {
    delete rules.proxy;
  }
  return true;
}

var EXACT_IGNORE_RE = /^(?:pattern|matcher)=./;

function ignoreRules(rules: any, ignore: any, isResRules: any) {
  var result = resolveIgnore(ignore);
  var ignoreAll = result.ignoreAll;
  var exclude = result.exclude;
  ignore = result.ignore;
  var keys = Object.keys(ignoreAll ? rules : ignore);
  var filter: any;
  keys.forEach(function (name) {
    if (EXACT_IGNORE_RE.test(name)) {
      filter = filter || {};
      filter['ignore|' + name] = true;
    }
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    if (name === 'filter' || name === 'ignore' || exclude[name]) {
      return;
    }
    if (!isResRules || protoMgr.resProtocols.indexOf(name) !== -1) {
      if (
        ignorePlugins(rules, name, exclude) ||
        ignoreProxy(rules, name, exclude) ||
        ignoreForwardRule(rules, name, exclude)
      ) {
        return;
      }
      delete rules[name];
    }
  });
  if (filter) {
    Object.keys(rules).forEach(function(name) {
      var rule = rules[name];
      var list = rule.list;
      var matched = exactIgnore(filter, rule);
      if (list) {
        list = list.filter(function(r: any) {
          return !exactIgnore(filter, r);
        });
        if (!list.length) {
          delete rules[name];
        } else {
          if (matched) {
            rule = extend({}, list[0]);
            rules[name] = rule;
          }
          rule.list = list;
        }
      } else if (matched) {
        delete rules[name];
      }
    });
  }
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.ignoreRules = ignoreRules;

function filterRepeatPlugin(rule: any) {
  if (rule.name !== 'plugin') {
    return;
  }
  var exists = {};
  rule.list = rule.list.filter(function (p: any) {
    var protocol = p.matcher.substring(
      p.matcher.indexOf('.'),
      p.matcher.indexOf(':')
    );
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    if (!exists[protocol]) {
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      exists[protocol] = 1;
      return true;
    }
    return false;
  });
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.filterRepeatPlugin = filterRepeatPlugin;

function mergeRule(curRule: any, newRule: any) {
  if (!curRule || !newRule || !newRule.list) {
    return newRule;
  }
  curRule.list = curRule.list.concat(newRule.list);
  filterRepeatPlugin(curRule);
  return curRule;
}

function mergeRules(req: any, add: any, isResRules: any) {
  var origin = req.rules;
  var origAdd = add;
  add = add || {};
  var merge = function (protocol: any) {
    var rule = mergeRule(origin[protocol], add[protocol]);
    if (rule) {
      origin[protocol] = rule;
    }
  };
  if (isResRules && origAdd) {
    protoMgr.resProtocols.forEach(merge);
  } else if (origAdd) {
    Object.keys(origAdd).forEach(merge);
  }

  req['delete'] = resolveRuleProps(origin['delete'], req['delete']);
  req._filters = resolveRuleProps(origin.filter, req._filters);
  req.disable = resolveRuleProps(origin.disable, req.disable);
  req.ignore = resolveRuleProps(origin.ignore, req.ignore);
  req.enable = resolveRuleProps(origin.enable, req.enable);
  enableRules.forEach(function (rule) {
    if (req.enable[rule]) {
      req._filters[rule] = true;
    }
  });
  ignoreRules(origin, extend(req.ignore, req._filters), isResRules);
  return add;
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.mergeRules = mergeRules;

function parseHeaderReplace(rule: any) {
  var list = rule && rule.list;
  if (!list) {
    return '';
  }
  var result = '';
  list.forEach(function (item: any) {
    var obj = parseJSON(getMatcherValue(item));
    var prop: any, name: any;
    obj &&
      Object.keys(obj).forEach(function (key) {
        var value = obj[key];
        if (!key.indexOf('req.')) {
          prop = 'req';
          name = null;
        } else if (!key.indexOf('res.')) {
          prop = 'res';
          name = null;
        } else if (!key.indexOf('trailer.')) {
          prop = 'trailer';
          name = null;
        } else if (!prop) {
          return;
        }
        // @ts-expect-error ts-migrate(2322) FIXME: Type 'string | {}' is not assignable to type 'stri... Remove this comment to see the full error message
        result = result || {};
        var index = key.indexOf(':');
        name = name || key.substring(prop.length + 1, index).trim();
        if (!name) {
          return;
        }
        key = key.substring(index + 1);
        var pattern = toOriginalRegExp(key);
        var opList = result[prop];
        var op = {
          regExp: pattern,
          name: name.toLowerCase(),
          key: key,
          value: value
        };
        if (opList) {
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'push' does not exist on type 'string'.
          opList.push(op);
        } else {
          // @ts-expect-error ts-migrate(2322) FIXME: Type '{ regExp: any; name: any; key: string; value... Remove this comment to see the full error message
          result[prop] = opList = [op];
        }
      });
  });
  return result;
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.parseHeaderReplace = parseHeaderReplace;

function replaceHeader(str: any, regExp: any, key: any, value: any) {
  if (str == null || str === '') {
    return str;
  }
  str = String(str);
  if (!regExp || !SUB_MATCH_RE.test(value)) {
    return str.replace(regExp || key, value);
  }
  return str.replace(regExp, function () {
    return replacePattern(value, arguments);
  });
}

function handleHeaderReplace(headers: any, opList: any) {
  opList &&
    opList.forEach(function (item: any) {
      var header = headers[item.name];
      if (header == null || header === '') {
        return;
      }
      var regExp = item.regExp;
      var key = item.key;
      var value = item.value;
      if (Array.isArray(header)) {
        headers[item.name] = header.map(function (str) {
          return replaceHeader(str, regExp, key, value);
        });
      } else {
        headers[item.name] = replaceHeader(header, regExp, key, value);
      }
    });
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.handleHeaderReplace = handleHeaderReplace;

function transformReq(req: any, res: any, port: any, host: any) {
  var options = parseUrl(getFullUrl(req));
  var headers = req.headers;
  options.headers = headers;
  options.method = req.method;
  options.agent = false;
  options.protocol = null;
  options.host = host || LOCALHOST;
  if (port > 0) {
    options.port = port;
  }
  if (req.clientIp || !net.isIP(headers[config.CLIENT_IP_HEAD])) {
    var clientIp = req.clientIp || getClientIp(req);
    if (isLocalAddress(clientIp)) {
      delete headers[config.CLIENT_IP_HEAD];
    } else {
      headers[config.CLIENT_IP_HEAD] = clientIp;
    }
  }
  options.hostname = null;
  var client = http.request(options, function (_res: any) {
    var origin =
      !_res.headers['access-control-allow-origin'] && req.headers.origin;
    if (origin) {
      _res.headers['access-control-allow-origin'] = origin;
      _res.headers['access-control-allow-credentials'] = true;
    }
    if (getStatusCode(_res.statusCode)) {
      res.writeHead(_res.statusCode, _res.headers);
      _res.pipe(res);
    } else {
      sendStatusCodeError(res, _res);
    }
  });
  var destroyed: any;
  var abort = function () {
    if (!destroyed) {
      destroyed = true;
      client.destroy();
    }
  };
  req.on('error', abort);
  res.on('error', abort);
  res.once('close', abort);
  client.on('error', function (err: any) {
    abort();
    res.emit('error', err);
  });
  req.pipe(client);
  return client;
}
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.transformReq = transformReq;

function trimStr(str: any) {
  if (typeof str !== 'string') {
    return '';
  }
  return str.trim();
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.trimStr = trimStr;

function hasHeaderRules(headers: any) {
  return (
    headers['x-whistle-rule-key'] ||
    headers['x-whistle-rule-value'] ||
    headers['x-whistle-rule-host']
  );
}

function checkIfAddInterceptPolicy(proxyHeaders: any, headers: any) {
  if (hasHeaderRules(headers)) {
    proxyHeaders['x-whistle-policy'] = 'intercept';
    return true;
  }
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.checkIfAddInterceptPolicy = checkIfAddInterceptPolicy;

function getCgiUrl(url: any) {
  if (!isString(url) || !(url = url.trim())) {
    return;
  }
  return url[0] === '/' ? url.substring(1) : url;
}
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getCgiUrl = getCgiUrl;

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getCustomTab = function (tab: any, pluginName: any) {
  if (!tab || !isString(tab.name)) {
    return;
  }
  var name = tab.name.trim();
  var page = getPage(tab.page || tab.action);
  if (!name || !page || page.indexOf('#') !== -1) {
    return;
  }
  return {
    action: 'plugin.' + pluginName + '/' + page,
    name: name.substring(0, 32)
  };
};

function getString(str: any) {
  if (!isString(str)) {
    return;
  }
  return str.trim();
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getString = getString;

function getPage(page: any) {
  page = getCgiUrl(page);
  return !page || page.length > 128 || !/\.html?$/i.test(page) ? null : page;
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getPluginMenu = function (menus: any, pluginName: any) {
  if (!Array.isArray(menus)) {
    return;
  }
  var len = menus.length;
  var count = 3;
  var map = {};
  var result, menu, name, page;
  for (var i = 0; i < len; i++) {
    if (
      (menu = menus[i]) &&
      (name = getString(menu.name)) &&
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      !map[name] &&
      (page = getPage(menu.page || menu.action)) &&
      page.indexOf('#') === -1
    ) {
      result = result || [];
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      map[name] = 1;
      result.push({
        // @ts-expect-error ts-migrate(2322) FIXME: Type 'any' is not assignable to type 'never'.
        name: name.substring(0, 20),
        // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
        action: 'plugin.' + pluginName + '/' + page,
        // @ts-expect-error ts-migrate(2322) FIXME: Type 'boolean | undefined' is not assignable to ty... Remove this comment to see the full error message
        required: menu.required ? true : undefined
      });
      if (--count === 0) {
        return result;
      }
    }
  }
  return result;
};

var MAX_HINT_LEN = 512;
var MAX_VAR_LEN = 100;

function getHintList(conf: any, isVar: any) {
  var hintList = conf.hintList;
  if (!Array.isArray(hintList) || !hintList.length) {
    return;
  }
  var result: any;
  var maxLen = isVar ? MAX_VAR_LEN : MAX_HINT_LEN;
  hintList.forEach(function (hint) {
    if (typeof hint === 'string') {
      if (hint.length <= maxLen) {
        result = result || [];
        result.push(hint);
      }
    } else if (hint) {
      var text = hint.text || hint.value;
      text = typeof text === 'string' ? text.trim() : '';
      if (!text) {
        return;
      }
      var help = hint.help;
      var isKey = hint.isKey ? 1 : undefined;
      var displayText = hint.display || hint.displayText || hint.label;
      if (typeof help !== 'string') {
        help = '';
      }
      if (typeof displayText !== 'string') {
        displayText = '';
      }
      result = result || [];
      if (!isKey && !help && !displayText) {
        result.push(text);
      } else {
        result.push({
          isKey: isKey,
          text: text,
          help: help.trim(),
          displayText: displayText
        });
      }
    }
  });
  return result;
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getHintList = getHintList;

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getPluginVarsConf = function (conf: any) {
  var pluginVars = conf.pluginVars;
  if (!pluginVars) {
    return;
  }
  var varHintList = getHintList(pluginVars, true);
  var varHintUrl = varHintList ? undefined : getCgiUrl(pluginVars.hintUrl);
  if (varHintList || varHintUrl) {
    return {
      hintUrl: varHintUrl,
      hintList: varHintList
    };
  }
  return true;
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getStaticDir = function (conf: any) {
  var staticDir = conf.staticDir;
  if (
    !staticDir ||
    typeof staticDir !== 'string' ||
    !/^[\w./-]+$/.test(staticDir) ||
    staticDir.length > 100
  ) {
    return;
  }
  return staticDir.replace(/^\/+/, '');
};

function toString(str: any) {
  if (str != null) {
    if (typeof str === 'string') {
      return str;
    }
    try {
      return JSON.stringify(str);
    } catch (e) {}
  }
  return '';
}
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.toString = toString;

var index = 0;

function padReqId(num: any) {
  if (num > 99) {
    return num;
  }
  if (num > 9) {
    return '0' + num;
  }
  return '00' + num;
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getReqId = function () {
  if (index > 999) {
    index = 0;
  }
  return Date.now() + '-' + padReqId(index++) + workerIndex;
};

function onSocketEnd(socket: any, callback: any) {
  var execCallback = function (err: any) {
    socket._hasError = true;
    if (callback) {
      callback(err);
      callback = null;
    }
  };
  if (socket.aborted || socket.destroyed || socket._hasError) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
    return execCallback();
  }
  socket.on('error', execCallback);
  socket.once('close', execCallback);
  socket.once('end', execCallback);
  socket.once('timeout', execCallback);
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.onSocketEnd = onSocketEnd;

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.onResEnd = common.onResEnd;

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getEmptyRes = function getRes() {
  var res = new PassThrough();
  res._transform = noop;
  res.on('data', noop);
  res.destroy = noop;
  return res;
};

var REQ_HEADER_RE = /^req\.?H(?:eaders?)?\.(.+)$/i;
var RES_HEADER_RE = /^res\.?H(?:eaders?)?\.(.+)$/i;
var TRAILER_RE = /trailer\.(.+)$/;
var HEADER_RE = /^headers\.(.+)$/;

function parseDeleteProperties(req: any) {
  var deleteRule = req['delete'];
  var reqHeaders = {};
  var resHeaders = {};
  var trailers = {};
  if (deleteRule) {
    Object.keys(deleteRule).forEach(function (prop) {
      if (REQ_HEADER_RE.test(prop)) {
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        reqHeaders[RegExp.$1.toLowerCase()] = 1;
      } else if (RES_HEADER_RE.test(prop)) {
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        resHeaders[RegExp.$1.toLowerCase()] = 1;
      } else if (HEADER_RE.test(prop)) {
        prop = RegExp.$1.toLowerCase();
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        reqHeaders[prop] = 1;
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        resHeaders[prop] = 1;
      } else if (TRAILER_RE.test(prop)) {
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        trailers[RegExp.$1.toLowerCase()] = 1;
      }
    });
  }
  return {
    reqHeaders: reqHeaders,
    resHeaders: resHeaders,
    trailers: trailers
  };
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.deleteReqHeaders = function (req: any) {
  var delReqHeaders = parseDeleteProperties(req).reqHeaders;
  var headers = req.headers;
  Object.keys(delReqHeaders).forEach(function (name) {
    delete headers[name];
  });
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.parseDeleteProperties = parseDeleteProperties;

var URL_RE = /^https?:\/\/./;
function parseOrigin(origin: any) {
  if (!isString(origin)) {
    return;
  }
  var index = origin.indexOf('//');
  if (index !== -1) {
    index = origin.indexOf('/', index + 2);
    if (index != -1) {
      origin = origin.substring(0, index);
    }
  }
  return origin;
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.setReqCors = function (data: any, cors: any) {
  if (!cors) {
    return;
  }
  cors = lowerCaseify(cors);
  var origin;
  if (cors.origin === '*') {
    origin = cors.origin;
  } else if (URL_RE.test(cors.origin)) {
    origin = parseOrigin(cors.origin);
  }
  if (origin !== undefined) {
    setHeader(data, 'origin', origin);
  } else if (cors['*'] === '') {
    setHeader(data, 'origin', '*');
  }
  if (cors.method !== undefined) {
    setHeader(data, 'access-control-request-method', cors.method);
  }
  if (cors.headers !== undefined) {
    setHeader(data, 'access-control-request-headers', cors.headers);
  }
};

function isEnableCors(cors: any) {
  return (
    cors.enable === '' ||
    cors['use-credentials'] === '' ||
    cors['credentials'] === ''
  );
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.setResCors = function (data: any, cors: any, req: any) {
  if (!cors) {
    return;
  }
  cors = lowerCaseify(cors);
  var cusOrigin;
  if (cors.origin === '*') {
    cusOrigin = cors.origin;
  } else if (URL_RE.test(cors.origin)) {
    cusOrigin = parseOrigin(cors.origin);
  }
  var isEnable = isEnableCors(cors);
  var isOptions = req.method === 'OPTIONS';
  var isStar = cors['*'] === '';
  if (cusOrigin || isEnable) {
    var origin = cusOrigin || req.headers.origin;
    if (origin) {
      setHeaders(data, {
        'access-control-allow-credentials': true,
        'access-control-allow-origin': origin
      });
    }
  } else if (isStar) {
    setHeader(data, 'access-control-allow-origin', '*');
  }

  if (cors.methods !== undefined) {
    setHeader(data, 'access-control-allow-methods', cors.methods);
  }
  var autoComp = isOptions && (isStar || isEnable);
  if (cors.headers !== undefined) {
    var operate = isOptions ? 'allow' : 'expose';
    setHeader(data, 'access-control-' + operate + '-headers', cors.headers);
  } else if (autoComp) {
    var headers = req.headers['access-control-request-headers'];
    if (headers) {
      setHeader(data, 'access-control-allow-headers', headers);
    }
  }

  if (cors.credentials !== undefined) {
    setHeader(data, 'access-control-allow-credentials', cors.credentials);
  } else if (autoComp) {
    var method = req.headers['access-control-request-method'];
    if (method) {
      setHeader(data, 'access-control-allow-method', method);
    }
  }

  if (cors.maxage !== undefined) {
    setHeader(data, 'access-control-max-age', cors.maxage);
  }
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.disableReqProps = function (req: any) {
  var disable = req.disable;
  var headers = req.headers;

  if (disable.ua) {
    delete headers['user-agent'];
  }

  if (disable.gzip) {
    delete headers['accept-encoding'];
  }

  if (
    disable.cookie ||
    disable.cookies ||
    disable.reqCookie ||
    disable.reqCookies
  ) {
    delete headers.cookie;
  }

  if (disable.referer || disable.referrer) {
    delete headers.referer;
  }

  if (disable.ajax) {
    delete headers['x-requested-with'];
  }

  if (disable.cache) {
    disableReqCache(headers);
  }
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.disableResProps = function (req: any, headers: any) {
  var disable = req.disable;
  if (
    disable.cookie ||
    disable.cookies ||
    disable.resCookie ||
    disable.resCookies
  ) {
    delete headers['set-cookie'];
  }
  if (disable.cache) {
    headers['cache-control'] = 'no-cache';
    // @ts-expect-error ts-migrate(2551) FIXME: Property 'toGMTString' does not exist on type 'Dat... Remove this comment to see the full error message
    headers.expires = new Date(Date.now() - 60000000).toGMTString();
    headers.pragma = 'no-cache';
  }
  disable.csp && disableCSP(headers);
};

var G_INVALID_NAME_CHAR_RE = /[^\x00-\xFF]|[\r\n;=%]/gu;
var INVALID_NAME_CHAR_RE = /[\r\n;=]/;
function escapeName(name: any) {
  if (
    !name ||
    (!NON_LATIN1_RE.test(name) && !INVALID_NAME_CHAR_RE.test(name))
  ) {
    return name;
  }
  return name.replace(G_INVALID_NAME_CHAR_RE, safeEncodeURIComponent);
}

var G_INVALID_VALUE_CHAR_RE = /[^\x00-\xFF]|[\r\n;%]/gu;
var INVALID_VALUE_CHAR_RE = /[\r\n;]/;
function escapeValue(value: any) {
  if (!isString(value)) {
    return (value = value == null ? '' : String(value));
  }
  if (!NON_LATIN1_RE.test(value) && !INVALID_VALUE_CHAR_RE.test(value)) {
    return value;
  }
  return value.replace(G_INVALID_VALUE_CHAR_RE, safeEncodeURIComponent);
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.setReqCookies = function (data: any, cookies: any, curCookies: any) {
  var list = cookies && Object.keys(cookies);
  if (!list || !list.length) {
    return;
  }
  var result = {};
  if (isString(curCookies)) {
    curCookies.split(/;\s*/g).forEach(function (cookie: any) {
      var index = cookie.indexOf('=');
      if (index == -1) {
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        result[cookie] = null;
      } else {
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        result[cookie.substring(0, index)] = cookie.substring(index + 1);
      }
    });
  }

  list.forEach(function (name: any) {
    var value = cookies[name];
    value = value && typeof value == 'object' ? value.value : value;
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    result[escapeName(name)] = value ? escapeValue(value) : value;
  });

  cookies = Object.keys(result)
    .map(function (name) {
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      var value = result[name];
      return name + (value == null ? '' : '=' + value);
    })
    .join('; ');
  setHeader(data, 'cookie', cookies);
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.setResCookies = function (data: any, cookies: any) {
  var list = cookies && Object.keys(cookies);
  if (!list || !list.length) {
    return;
  }
  var curCookies = data.headers && data.headers['set-cookie'];
  if (!Array.isArray(curCookies)) {
    curCookies = curCookies ? [curCookies + ''] : [];
  }

  var result = {};
  curCookies.forEach(function (cookie: any) {
    var index = cookie.indexOf('=');
    if (index == -1) {
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      result[cookie] = null;
    } else {
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      result[cookie.substring(0, index)] = cookie.substring(index + 1);
    }
  });

  list.forEach(function (name: any) {
    var cookie = cookies[name];
    name = escapeName(name);
    if (!cookie || typeof cookie != 'object') {
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      result[name] = cookie ? escapeValue(cookie) : cookie;
    } else {
      var attrs = [];
      var value = cookie.value;
      attrs.push(escapeValue(value));
      var maxAge =
        cookie.maxAge ||
        cookie.maxage ||
        cookie['Max-Age'] ||
        cookie['max-age'];
      maxAge = parseInt(cookie.maxAge, 10);
      if (!Number.isNaN(maxAge)) {
        attrs.push(
          // @ts-expect-error ts-migrate(2551) FIXME: Property 'toGMTString' does not exist on type 'Dat... Remove this comment to see the full error message
          'Expires=' + new Date(Date.now() + maxAge * 1000).toGMTString()
        );
        attrs.push('Max-Age=' + maxAge);
      }

      cookie.secure && attrs.push('Secure');
      cookie.path && attrs.push('Path=' + cookie.path);
      cookie.domain && attrs.push('Domain=' + cookie.domain);
      (cookie.httpOnly || cookie.httponly) && attrs.push('HttpOnly');
      var sameSite = cookie.sameSite || cookie.samesite || cookie.SameSite;
      sameSite && attrs.push('SameSite=' + sameSite);
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      result[name] = attrs.join('; ');
    }
  });

  cookies = Object.keys(result).map(function (name) {
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    var value = result[name];
    return name + (value == null ? '' : '=' + value);
  });
  setHeader(data, 'set-cookie', cookies);
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.escapeRegExp = function (str: any) {
  if (!str) {
    return '';
  }
  return str.replace(/[|\\{}()[\]^$+?.]/g, '\\$&');
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.checkTlsError = function (err: any) {
  if (!err) {
    return false;
  }
  if (err.code === 'EPROTO') {
    return true;
  }
  var stack = err.stack || err.message;
  if (!isString(stack)) {
    return false;
  }
  if (
    stack.indexOf('TLSSocket.onHangUp') !== -1 ||
    stack.indexOf('statusCode=502') !== -1
  ) {
    return true;
  }
  return stack.toLowerCase().indexOf('openssl') !== -1;
};
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.checkAuto2Http = function (req: any, ip: any, proxyUrl: any) {
  return (
    !req.disable.auto2http &&
    (req.enable.auto2http ||
      req.rules.host ||
      (proxyUrl ? req._phost : isLocalAddress(ip)))
  );
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.setProxyHost = function (req: any, options: any, reserve: any) {
  var phost = req._phost || options;
  var opts = reserve ? options : extend({}, options);
  opts.host = phost.hostname;
  if (phost.port > 0) {
    opts.port = phost.port;
  }
  opts.headers = opts.headers || {};
  config.setHeader(opts.headers, 'host', opts.host + ':' + opts.port);
  return opts;
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getHostIp = function (ip: any, port: any) {
  if (!port) {
    return ip;
  }
  if (net.isIP(ip) === 6) {
    ip = '[' + ip + ']';
  }
  return ip + ':' + port;
};

function getMethod(method: any) {
  if (typeof method !== 'string') {
    return 'GET';
  }
  return method.trim().toUpperCase() || 'GET';
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getMethod = getMethod;

var COMMENT_RE = /^\s*#/;
var SCRIPT_RE = /\b(?:rules|values)\b/;
function isRulesContent(ctn: any) {
  return COMMENT_RE.test(ctn) || !SCRIPT_RE.test(ctn);
}
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.isRulesContent = isRulesContent;

var RESPONSE_FOR_NAME = /^name=(.+)$/;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.setResponseFor = function (rules: any, headers: any, req: any, serverIp: any) {
  var responseFor = getMatcherValue(rules.responseFor);
  if (!responseFor) {
    if (req.isPluginReq && !isLocalAddress(serverIp)) {
      responseFor = trimStr(headers['x-whistle-response-for']);
      responseFor = responseFor
        ? responseFor.split(',').map(trim).filter(noop)
        : [];
      if (responseFor.indexOf(serverIp) === -1) {
        responseFor.push(serverIp);
      }
      headers['x-whistle-response-for'] = responseFor.join(', ');
    }
    return;
  }
  var reqHeaders = req.headers;
  if (RESPONSE_FOR_NAME.test(responseFor)) {
    var result = RegExp.$1.toLowerCase().split(',');
    var reqResult: any = [];
    result = result
      .map(function (name) {
        if (name.indexOf('req.') === 0) {
          name = reqHeaders[name.substring(4)];
          name && reqResult.push(name);
          return;
        }
        return headers[name];
      })
      .filter(noop);
    result.push(serverIp || '127.0.0.1');
    responseFor = result.concat(reqResult).join(', ');
  }
  headers['x-whistle-response-for'] = responseFor;
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getNoPluginServerMsg = function (rule: any) {
  var msg = 'No implement plugin.server';
  if (rule) {
    msg +=
      '\n       try to set the following rules:\n       <strong>' +
      rule.pattern +
      ' whistle.' +
      rule.matcher +
      '</strong>';
  }
  return msg;
};
var CONFIG_VAR_RE = /\${(port|version)}/gi;
var PLUGIN_RULES_URL_RE = /^whistle\.([a-z\d_-]+)(?:$|\/)/i;
var PLUGIN_KEY_RE =/^\$(?:whistle\.)?([a-z\d_-]+)[/:]([\S\s]+)$/;

function setConfigVarFn(_: any, name: any) {
  return config[name.toLowerCase()];
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getRemoteRules = function (apo: any, rulesUrl: any) {
  var headers = config.runtimeHeaders;
  var pluginName;
  if (PLUGIN_RULES_URL_RE.test(rulesUrl)) {
    pluginName = RegExp.$1;
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    rulesUrl = pluginName + '/' + rulesUrl.substring(RegExp['$&'].length);
    headers = config.pluginHeaders;
  } else if (PLUGIN_KEY_RE.test(rulesUrl)) {
    pluginName = RegExp.$1;
    rulesUrl = pluginName + '/api/key/value?key=' + safeEncodeURIComponent(RegExp.$2);
    headers = config.pluginHeaders;
  }
  if (apo) {
    rulesUrl = rulesUrl.replace(CONFIG_VAR_RE, setConfigVarFn);
  }
  return httpMgr.add(rulesUrl, headers, pluginName);
};

function isCustomParser(req: any) {
  var enable = req.enable;
  return enable && (enable.customParser || enable.customFrames);
}
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.isCustomParser = isCustomParser;

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getParserStatus = function (req: any) {
  if (!isCustomParser(req)) {
    return;
  }
  var enable = req.enable;
  var customParser = ['custom'];
  if (enable.pauseSend) {
    customParser.push('pauseSend');
  } else if (enable.ignoreSend) {
    customParser.push('ignoreSend');
  }
  if (enable.pauseReceive) {
    customParser.push('pauseReceive');
  } else if (enable.ignoreReceive) {
    customParser.push('ignoreReceive');
  }
  return customParser.join();
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.isInspect = function (enable: any) {
  return (
    enable.inspect ||
    enable.pauseReceive ||
    enable.pauseSend ||
    enable.ignoreReceive ||
    enable.ignoreSend
  );
};

var BYTES_RANGE_RE = /^\s*bytes=/i;

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.parseRange = function (req: any, size: any) {
  var range = size && req.headers.range;
  if (!range || !BYTES_RANGE_RE.test(range)) {
    return;
  }
  range = range.substring(range.indexOf('=') + 1).trim();
  if (!range) {
    return;
  }
  var start = size;
  var end = -1;
  range = range.split(',').forEach(function (item: any) {
    item = item.split('-');
    var s = parseInt(item[0], 10);
    var e = parseInt(item[1], 10);
    if (isNaN(s)) {
      if (isNaN(e)) {
        return;
      }
      s = size - e;
    } else if (isNaN(e)) {
      e = size - 1;
    }
    start = Math.min(s, start);
    end = Math.max(end, e);
  });
  if (start < 0 || end < 0 || start > end || end >= size) {
    return;
  }
  return {
    start: start,
    end: end
  };
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.parseClientInfo = function (req: any) {
  var clientInfo = req.headers[config.CLIENT_INFO_HEAD] || '';
  if (req.headers[config.REQ_FROM_HEADER] === 'W2COMPOSER') {
    req.fromComposer = true;
    delete req.headers[config.REQ_FROM_HEADER];
  }
  var socket = req.socket || '';
  if (socket.fromTunnel) {
    req.fromTunnel = true;
  }
  if (clientInfo) {
    delete req.headers[config.CLIENT_INFO_HEAD];
    clientInfo = String(clientInfo).split(',');
    if (!net.isIP(clientInfo[0]) || !(clientInfo[1] > 0)) {
      return '';
    }
    req.fromTunnel = true;
    socket.fromTunnel = true;
  }
  return clientInfo;
};

function getCipher(rules: any) {
  var cipher = rules && getMatcherValue(rules.cipher);
  if (!cipher) {
    return TLSV2_CIPHERS;
  }
  cipher = cipher.toUpperCase();
  return CIPHER_OPTIONS.indexOf(cipher) === -1 ? TLSV2_CIPHERS : cipher;
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getCipher = getCipher;

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.connect = function (options: any, callback: any) {
  var socket: any, timer: any, done: any, retry: any;
  var execCallback = function (err: any) {
    clearTimeout(timer);
    timer = null;
    if (!done) {
      done = true;
      err ? callback(err) : callback(null, socket);
    }
  };
  var handleConnect = function () {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
    execCallback();
  };
  var handleError = function (err: any) {
    if (done) {
      return;
    }
    socket.removeAllListeners();
    socket.on('error', noop);
    socket.destroy(err);
    clearTimeout(timer);
    if (retry) {
      return execCallback(err);
    }
    retry = true;
    timer = setTimeout(handleTimeout, 12000);
    try {
      if (options.ALPNProtocols && err && isCiphersError(err)) {
        options.ciphers = getCipher(options._rules);
      }
      socket = sockMgr.connect(options, handleConnect);
    } catch (e) {
      return execCallback(e);
    }
    socket.on('error', handleError);
    socket.on('close', function (err: any) {
      !done && execCallback(err || new Error('closed'));
    });
  };
  var handleTimeout = function () {
    handleError(new Error('Timeout'));
  };
  var sockMgr = options.ALPNProtocols ? tls : net;
  timer = setTimeout(handleTimeout, 6000);
  try {
    socket = sockMgr.connect(options, handleConnect);
  } catch (e) {
    return execCallback(e);
  }
  socket.on('error', handleError);
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.checkPluginReqOnce = function (req: any, raw: any) {
  var isPluginReq = req.headers[config.PROXY_ID_HEADER];
  if (raw ? isPluginReq : isPluginReq == 1) {
    delete req.headers[config.PROXY_ID_HEADER];
  }
  return isPluginReq;
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.showPluginReq = function(req: any) {
  return !req.isPluginReq || config.showPluginReq;
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.checkPort = function (port: any, host: any, cb: any) {
  if (typeof host !== 'string') {
    cb = host;
    host = '127.0.0.1';
  }
  if (!port) {
    return cb();
  }
  var server = http.createServer();
  server.listen(port, host, function () {
    server.close(cb);
  });
};

var boundIpDeferMap = {};
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getBoundIp = function (host: any, cb: any) {
  if (typeof host === 'function') {
    cb = host;
    host = null;
  }
  host = host || config.defaultHost;
  if (!host || net.isIP(host)) {
    return cb(host);
  }
  // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  var boundIpDefer = boundIpDeferMap[host];
  if (boundIpDefer) {
    return boundIpDefer.done(cb);
  }
  var defer = Q.defer();
  boundIpDefer = defer.promise;
  // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  boundIpDeferMap[host] = boundIpDefer;
  boundIpDefer.done(cb);
  dns.lookup(host, function (err: any, ip: any) {
    if (err) {
      throw err;
    }
    defer.resolve(ip);
  });
};

function getPluginConfig(conf: any, name: any) {
  var result;
  if (conf != null) {
    try {
      result = JSON.stringify(conf);
    } catch (e) {}
  }
  return (
    '<script>window.' +
    (name || 'whistleMenuConfig') +
    ' = ' +
    (result || '{}') +
    ';</script>'
  );
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getPluginMenuConfig = function (conf: any) {
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
  return getPluginConfig(conf.menuConfig);
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getPluginInspectorConfig = function (conf: any) {
  return getPluginConfig(conf.inspectorConfig, 'whistleInspectorConfig');
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.isEnableH2 = function (req: any) {
  var enable = req.enable || '';
  var disable = req.disable || '';
  return enable.h2 && !disable.h2;
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.isDisableH2 = function (req: any, strict: any) {
  var enable = req.enable || '';
  var disable = req.disable || '';
  return strict ? disable.http2 && !enable.http2 : disable.h2 && !enable.h2;
};

function isIllegalcHeader(name: any, value: any) {
  switch (name) {
  case h2Consts.HTTP2_HEADER_CONNECTION:
  case h2Consts.HTTP2_HEADER_UPGRADE:
  case h2Consts.HTTP2_HEADER_HOST:
  case h2Consts.HTTP2_HEADER_HTTP2_SETTINGS:
  case h2Consts.HTTP2_HEADER_KEEP_ALIVE:
  case h2Consts.HTTP2_HEADER_PROXY_CONNECTION:
  case h2Consts.HTTP2_HEADER_TRANSFER_ENCODING:
    return true;
  case h2Consts.HTTP2_HEADER_TE:
    return value !== 'trailers';
  default:
    return false;
  }
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.formatH2Headers = function (headers: any) {
  var newHeaders = {};
  Object.keys(headers).forEach(function (name) {
    var value = headers[name];
    if (!isIllegalcHeader(name, value)) {
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newHeaders[name] = value;
    }
  });
  return newHeaders;
};

function getProp(obj: any, key: any, def: any) {
  key = key.split('.');
  for (var i = 0; i < key.length; i++) {
    obj = obj ? obj[key[i]] : undefined;
  }
  return obj == null ? def : obj;
}

var PLUGIN_VAR_RE =
  /\{\{(?:whistlePluginName|whistlePluginPackage\.([^}\s]+))\}\}/g;

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.renderPluginRules = function (rules: any, pkg: any, simpleName: any) {
  return rules &&
  rules.replace(PLUGIN_VAR_RE, function (_: any, key: any) {
    return key ? getProp(pkg, key, '') : simpleName;
  });
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.setClientCert = function (options: any, key: any, cert: any, isPfx: any, cacheKey: any) {
  if (!cert) {
    return;
  }
  options.cacheKey = cacheKey;
  if (isPfx) {
    options.pfx = cert;
    if (key) {
      options.passphrase = key;
    }
  } else {
    options.key = key;
    options.cert = cert;
  }
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getStatusCodeFromRule = function (rules: any) {
  var rule = rules.rule;
  var isSpec = rule && rule.isSpec;
  if (!isSpec) {
    return;
  }
  rule = getMatcherValue(rule);
  if (!rule) {
    return;
  }
  var result = { statusCode: rule, headers: {} };
  if (isSpec === 2) {
    result.statusCode = 302;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'location' does not exist on type '{}'.
    result.headers.location = rule;
  } else {
    handleStatusCode(rule, result.headers);
  }
  return result;
};

var GZIP_RE = /\bgzip\b/i;

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.canGzip = function (req: any) {
  return GZIP_RE.test(req.headers['accept-encoding']);
};

function removeBody(req: any, data: any, isRes: any) {
  var rule = req['delete'] || '';
  if (rule.body || rule[isRes ? 'res.body' : 'req.body']) {
    delete data.top;
    delete data.bottom;
    data.body = EMPTY_BUFFER;
  }
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.removeReqBody = function (req: any, data: any) {
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
  removeBody(req, data);
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.removeResBody = function (req: any, data: any) {
  removeBody(req, data, true);
};

function readOneChunk(stream: any, callback: any, timeout: any) {
  if (!stream) {
    return callback();
  }
  var timer: any;
  var handler = function (chunk: any) {
    timer && clearTimeout(timer);
    stream.pause();
    stream.removeListener('data', handler);
    stream.removeListener('end', handler);
    callback(chunk);
  };
  if (timeout > 0) {
    timer = setTimeout(handler, timeout);
  }
  stream.on('data', handler);
  stream.on('end', handler);
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.readOneChunk = readOneChunk;

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getAuthByRules = function (rules: any) {
  if (!rules.auth) {
    return;
  }
  var auth = getMatcherValue(rules.auth);
  if (/[\\\/]/.test(auth)) {
    return;
  }
  var index = auth.indexOf(':');
  return {
    username: index == -1 ? auth : auth.substring(0, index),
    password: index == -1 ? null : auth.substring(index + 1)
  };
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getAuthBasic = function (auth: any) {
  if (!auth) {
    return;
  }
  var basic;
  if (auth.username == null) {
    if (auth.password == null) {
      return;
    }
    basic = [''];
  } else {
    basic = [auth.username];
  }
  if (auth.password != null) {
    basic[1] = auth.password;
  }
  return basic && 'Basic ' + toBuffer(basic.join(':')).toString('base64');
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.delay = function (time: any, callback: any) {
  if (time > 0) {
    setTimeout(callback, time);
  } else {
    callback();
  }
};

var F_HOST_RE = /\bhost\b/i;
var F_PROTO_RE = /\bproto\b/i;
var F_IP_RE = /\b(?:clientIp|ip|for)\b/i;

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.handleForwardedProps = function (req: any) {
  var headers = req.headers;
  var props = headers['x-whistle-forwarded-props'];
  var enableFwdHost = config.enableFwdHost;
  var enableFwdProto = config.enableFwdProto;
  var enableFwdFor = config.keepXFF;
  if (props != null) {
    enableFwdHost = enableFwdHost || F_HOST_RE.test(props);
    enableFwdProto = enableFwdProto || F_PROTO_RE.test(props);
    enableFwdFor = enableFwdFor || F_IP_RE.test(props);
    if (config.master && enableFwdFor) {
      headers['x-whistle-forwarded-props'] = 'ip';
    } else {
      delete headers['x-whistle-forwarded-props'];
    }
  }
  req.enableXFF = enableFwdFor;
  if (enableFwdHost) {
    var host = headers[config.FWD_HOST_HEADER];
    if (host) {
      delete headers[config.FWD_HOST_HEADER];
      headers[config.REAL_HOST_HEADER] =
        headers[config.REAL_HOST_HEADER] || host;
    }
  }
  if (enableFwdProto) {
    var proto = headers[config.HTTPS_PROTO_HEADER];
    if (proto) {
      delete headers[config.HTTPS_PROTO_HEADER];
      req.isHttps = proto === 'https';
    }
  }
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.filterWeakRule = function (req: any) {
  var rule = req.rules && req.rules.rule;
  if (!rule) {
    return;
  }
  var proxy = req.rules.proxy;
  if ((!proxy || proxy.lineProps.proxyHostOnly) && !req.rules.host) {
    return;
  }
  if (rule.lineProps.weakRule || isEnable(req, 'weakRule')) {
    delete req.rules.rule;
  }
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.setPluginMgr = function(p: any) {
  pluginMgr = p;
};


function setTunnelHeaders(headers: any, remoteData: any) {
  var tunnelFirst = remoteData.tunnelFirst;
  if (remoteData.clientId) {
    headers[config.CLIENT_ID_HEADER] = remoteData.clientId;
  }
  if (
      remoteData.proxyAuth &&
      (tunnelFirst || !headers['proxy-authorization'])
    ) {
    headers['proxy-authorization'] = remoteData.proxyAuth;
  }
  if (remoteData.tunnelData) {
    headers[config.TUNNEL_DATA_HEADER] = remoteData.tunnelData;
  }
  if (remoteData.sniPlugin) {
    headers[config.SNI_PLUGIN_HEADER] = remoteData.sniPlugin;
  }
  var tunnelHeaders = remoteData.headers;
  if (tunnelHeaders) {
    Object.keys(tunnelHeaders).forEach(function (key) {
      if (tunnelFirst || !headers[key]) {
        headers[key] = tunnelHeaders[key];
      }
    });
  }
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.setTunnelHeaders = setTunnelHeaders;

var tunnelDataKey = config.TUNNEL_DATA_HEADER;
var tmplDataKey = config.TEMP_TUNNEL_DATA_HEADER;

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.addTunnelData = function(socket: any, headers: any) {
  var data = socket[tunnelDataKey];
  if (!data) {
    data = headers[tmplDataKey];
    if (data) {
      delete headers[tmplDataKey];
      try {
        data = decodeURIComponent(data);
        data = JSON.parse(data);
        socket[tunnelDataKey] = data;
      } catch(e) {
        return;
      }
    }
  }
  data && setTunnelHeaders(headers, data);
};

function _isInternalProxy(rule: any) {
  return rule && rule.lineProps.internalProxy;
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.isInternalProxy = function(req: any) {
  if (isEnable(req, 'internalProxy')) {
    return true;
  }
  var rules = req.rules || '';
  return _isInternalProxy(rules.proxy) || _isInternalProxy(rules.host);
};

var IP_RE = /^(\d{1,3}(?:\.\d{1,3}){3}|localhost|\[[^\]]+\])(?::\d+)$/;
function checkProxyHost(host: any, filter: any) {
  var result;
  if (filter.hostPattern) {
    result = filter.hostPattern.test(host);
  } else if (filter.host === '<local>') {
    if (IP_RE.test(host)) {
      host = RegExp.$1;
    }
    result = host === 'localhost' || isLocalAddress(host);
  } else if (filter.host) {
    if (filter.host.slice(-1) === ':') {
      result = !host.indexOf(filter.host);
    } else {
      result = host === filter.host;
    }
  }
  return filter.not ? !result : result;
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.checkProxyHost = function(proxy: any, host: any) {
  var filters = proxy && proxy.hostFilter;
  if (filters) {
    if (!host) {
      return false;
    }
    var hasIncludeFilter;
    var include, exclude;
    for (var i = 0, len = filters.length; i < len; i++) {
      var filter = filters[i];
      hasIncludeFilter = hasIncludeFilter || filter.isInclude;
      if ((filter.isInclude ? !include : !exclude) && checkProxyHost(host, filter)) {
        if (filter.isInclude) {
          include = true;
        } else {
          exclude = true;
        }
      }
    }
    return hasIncludeFilter ? include && !exclude : !exclude;
  }
  return true;
};
