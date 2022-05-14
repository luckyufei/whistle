// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var http = require('http');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var https = require('https');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var fs = require('fs');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var extend = require('extend');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var fileMgr = require('./file-mgr');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var logger = require('./logger');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var parseUrl = require('./parse-url');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var zlib = require('./zlib');

var cache = {};
var listeners: any = [];
var newUrls: any;
var TIMEOUT = 16000;
var MAX_RULES_LEN = 1024 * 72;
var MAX_FILE_LEN = 1024 * 256;
var MAX_INTERVAL = 1000 * 30;
var MIN_INTERVAL = 1000 * 10;
var EXCEED = 'EXCEED';
var OPTIONS = { encoding: 'utf8' };
var queue: any = [];
var queueTimer: any;
var FILE_RE = /^(?:[a-z]:[\\/]|[~～]?\/)/i;
var GZIP_RE = /gzip/i;
// @ts-expect-error ts-migrate(2403) FIXME: Subsequent variable declarations must have the sam... Remove this comment to see the full error message
var pendingList = process.whistleStarted ? null : [];
var pluginMgr;

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
process.once('whistleStarted', function () {
  if (pendingList) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'forEach' does not exist on type '{}'.
    pendingList.forEach(function (item: any) {
      add(item[0], item[1], item[2]);
    });
    // @ts-expect-error ts-migrate(2322) FIXME: Type 'null' is not assignable to type '{}'.
    pendingList = null;
  }
});

function getInterval(time: any, isLocal: any) {
  var len = Object.keys(cache).length || 1;
  var interval = isLocal
    ? 5000
    : Math.max(MIN_INTERVAL, Math.ceil(MAX_INTERVAL / len));
  var minTime = interval - (time > 0 ? time : 0);
  return Math.max(minTime, 1000);
}

function triggerChange(data: any, body: any) {
  if (data) {
    body = (body && body.trim()) || '';
    if (data.body === body) {
      return;
    }
    data.body = body;
  }
  if (newUrls) {
    return;
  }
  newUrls = {};
  // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'l' implicitly has an 'any' type.
  listeners.forEach(function (l) {
    l();
  });
  Object.keys(newUrls).forEach(function (url) {
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    newUrls[url] = cache[url];
  });
  cache = newUrls;
  newUrls = null;
}

function parseOptions(options: any) {
  if (typeof options === 'string') {
    options = parseUrl(options);
  } else {
    var fullUrl = options.url || options.uri;
    if (fullUrl && typeof fullUrl === 'string') {
      options = extend(options, parseUrl(fullUrl));
    }
  }
  var maxLength = options.maxLength;
  if (!(maxLength > 0)) {
    options.maxLength = 0;
  }
  options.agent = false;
  if (options.rejectUnauthorized !== true) {
    options.rejectUnauthorized = false;
  }
  if (options.headers && options.headers.trailer) {
    delete options.headers.trailer;
  }
  return options;
}

function toString(obj: any) {
  if (obj == null) {
    return;
  }
  if (typeof obj === 'object') {
    return JSON.stringify(obj);
  }
  if (Buffer.isBuffer(obj)) {
    return obj;
  }
  return obj + '';
}

var NOT_PLUGIN_ERR = new Error('Error: not found');
var NOT_UI_SERVER_ERR = new Error('Error: not implemented uiServer');
// @ts-expect-error ts-migrate(2339) FIXME: Property 'code' does not exist on type 'Error'.
NOT_PLUGIN_ERR.code = 404;
// @ts-expect-error ts-migrate(2339) FIXME: Property 'code' does not exist on type 'Error'.
NOT_UI_SERVER_ERR.code = 501;

function loadPlugin(options: any, callback: any) {
  var name = options.pluginName;
  if (!name) {
    return callback();
  }
  pluginMgr.loadPluginByName(name, function (err: any, ports: any) {
    if (err || !ports || !ports.uiPort) {
      return callback(err || (ports ? NOT_UI_SERVER_ERR : NOT_PLUGIN_ERR));
    }
    options.url =
      'http://127.0.0.1:' + ports.uiPort + options.url.substring(name.length);
    callback();
  });
}

// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'request'.
function request(options: any, callback: any) {
  loadPlugin(options, function (err: any) {
    if (err) {
      return callback(err, '', '');
    }
    options = parseOptions(options);
    var isHttps = options.protocol === 'https:';
    var httpModule = isHttps ? https : http;
    var done: any, timer: any, res: any;
    var body = '';
    var callbackHandler = function (err: any) {
      clearTimeout(timer);
      err && client && client.abort();
      if (!done) {
        done = true;
        var handleCallback = function(e: any, data: any) {
          data = e ? '' : (options.needRawData ? data : data + '');
          callback(e, data, res || '');
        };
        if (res && body && GZIP_RE.test(res.headers['content-encoding'])) {
          zlib.gunzip(body, handleCallback);
        } else {
          handleCallback(err, body);
        }
      }
    };
    var addTimeout = function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        callbackHandler(new Error('Timeout'));
      }, TIMEOUT);
    };
    addTimeout();
    var maxLength = options.maxLength;
    try {
      var client = httpModule.request(options, function (r: any) {
        res = r;
        res.on('error', callbackHandler);
        res.on('data', function (data: any) {
          body = body ? Buffer.concat([body, data]) : data;
          addTimeout();
          if (maxLength && body.length > maxLength) {
            var err;
            if (!options.ignoreExceedError) {
              err = new Error('The response body exceeded length limit');
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'code' does not exist on type 'Error'.
              err.code = EXCEED;
            }
            callbackHandler(err);
          }
        });
        res.on('end', callbackHandler);
      });
      client.on('error', callbackHandler);
      client.end(toString(options.body));
      return client;
    } catch (e) {
      callbackHandler(e);
    }
  });
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.request = request;

function readFile(url: any, callback: any) {
  var data: any;
  var now = Date.now();
  var execCallback = function () {
    callback(url, Date.now() - now);
  };
  var filePath = fileMgr.convertSlash(url);
  fs.stat(filePath, function (err: any, stat: any) {
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    data = cache[url];
    if (!data) {
      return execCallback();
    }
    if (err) {
      if (err.code === 'ENOENT') {
        err = null;
      } else {
        logger.error(url, err.message);
      }
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      triggerChange(data);
      data.mtime = null;
      return execCallback();
    }
    if (!stat.isFile()) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      triggerChange(data);
      data.mtime = null;
      return execCallback();
    }
    var time = stat.mtime.getTime();
    if (time === data.mtime) {
      return execCallback();
    }

    var stream = fs.createReadStream(filePath, OPTIONS);
    var done: any;
    var body = '';
    var listener = function (err: any) {
      if (done) {
        return;
      }
      execCallback();
      if (err && err.code !== 'ENOENT') {
        return;
      }
      done = true;
      data.mtime = time;
      stream.close();
      triggerChange(data, body);
    };
    stream.on('data', function (text: any) {
      if (done) {
        return;
      }
      body += text;
      if (body.length > MAX_FILE_LEN) {
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
        listener();
      }
    });
    stream.on('error', listener);
    stream.on('end', listener);
  });
}

function addQueue(url: any, consumeTime: any) {
  // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  if (cache[url] && queue.indexOf(url) === -1) {
    queue.push(url);
  }
  var data;
  while (!queueTimer && !data) {
    url = queue.shift();
    if (!url) {
      return;
    }
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    data = cache[url];
    if (data) {
      queueTimer = setTimeout(function () {
        queueTimer = null;
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
        updateBody(url, addQueue);
      }, getInterval(consumeTime, data.isLocalUrl || data.isLocalPath));
      return;
    }
  }
}

function updateBody(url: any, callback: any, init: any) {
  // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  var data = cache[url];
  if (!data) {
    return callback && callback();
  }
  if (data.isLocalPath) {
    return readFile(url, addQueue);
  }
  var now = Date.now();
  var options = {
    url: url,
    pluginName: data.pluginName,
    maxLength: MAX_RULES_LEN,
    ignoreExceedError: true
  };
  if (data.headers) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'headers' does not exist on type '{ url: ... Remove this comment to see the full error message
    options.headers = data.headers;
  }
  request(options, function (err: any, body: any, res: any) {
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    data = cache[url];
    callback && callback(url, Date.now() - now);
    if (!data) {
      return;
    }
    var code = res.statusCode;
    var notFound = err
      ? err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED'
      : code != 200 && code != 204;
    err && logger.error('[Load Rules]', url, err.message || err);
    if (notFound) {
      data._retry = data._retry || 0;
      if (data._retry > 2) {
        !err && logger.warn('[Load Rules]', url, 'status', code);
        data._retry = -6;
        err = body = '';
        notFound = false;
      }
      ++data._retry;
    } else {
      data._retry = 0;
    }
    if (notFound || err) {
      if (init) {
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 1.
        updateBody(url);
        return;
      }
    }
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    addQueue(url);
    if (notFound || err) {
      return;
    }
    triggerChange(data, body);
  });
  return true;
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.addChangeListener = function (l: any) {
  listeners.push(l);
};

function add(url: any, headers: any, pluginName: any) {
  // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  var data = cache[url];
  if (!data) {
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    cache[url] = data = {
      body: '',
      pluginName: pluginName,
      isLocalUrl: pluginName || url.indexOf('http://127.0.0.1:') === 0,
      isLocalPath: FILE_RE.test(url),
      headers: headers
    };
    updateBody(url, null, true);
  }
  if (newUrls) {
    newUrls[url] = 1;
  }
  return data.body;
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.add = function (url: any, headers: any, pluginName: any) {
  if (pendingList && headers && headers['x-whistle-internal-id']) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'push' does not exist on type '{}'.
    pendingList.push([url, headers, pluginName]);
    return '';
  }
  return add(url, headers, pluginName);
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.forceUpdate = function (root: any) {
  Object.keys(cache).forEach(function (url) {
    if (url.indexOf(root) === 0) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 1.
      updateBody(url);
    }
  });
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.clean = function () {
  if (!newUrls && Object.keys(cache).length) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 0.
    triggerChange();
  }
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.setPluginMgr = function (mgr: any) {
  pluginMgr = mgr;
};
