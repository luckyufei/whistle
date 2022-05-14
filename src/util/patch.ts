// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var EventEmitter = require('events').EventEmitter;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var PassThrough = require('stream').PassThrough;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var Socket = require('net').Socket;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var http = require('http');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var https = require('https');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var hparser = require('hparser');

var httpRequest = http.request;
var httpsRequest = https.request;
var res = http.OutgoingMessage.prototype;
var noop = function () {};
var INVALID_PATH_RE = /[^\u0021-\u00ff]/;
var INVALID_PATH_RE_G = /[^\u0021-\u00ff]/g;
var HOST_RE = /^host$/i;

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
process.emitWarning = noop;
//see: https://github.com/joyent/node/issues/9272
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'setHeader'.
var setHeader = res.setHeader;
res.setHeader = function (field: any, val: any) {
  try {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
    return setHeader.call(this, field, val);
  } catch (e) {}
};

// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'listenerCount'.
function listenerCount(emitter: any, eventName: any) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(eventName);
  }
  return EventEmitter.listenerCount(emitter, eventName);
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.listenerCount = listenerCount;

var proto = Socket.prototype;
var destroy = proto.destroy;
var on = proto.on;
// 避免第三方模块没处理好异常导致程序crash
proto.destroy = function (err: any) {
  if (this.destroyed) {
    return;
  }
  if (err && !listenerCount(this, 'error')) {
    this.on('error', noop);
  }
  return destroy.call(this, err);
};
// 避免一些奇奇怪怪的异常，导致整个进程 crash
// 如：Error: This socket has been ended by the other party
var wrapOn = function(this: any) {
  var evt = arguments[0];
  if (this.on === wrapOn) {
    this.on = on;
  }
  if (evt !== 'error' && !listenerCount(this, 'error')) {
    on.call(this, 'error', noop);
  }
  return on.apply(this, arguments);
};
proto.on = wrapOn;

function filterInvalidPath(options: any) {
  if (!options) {
    return options;
  }
  if (typeof options === 'string') {
    if (INVALID_PATH_RE.test(options)) {
      return options.replace(INVALID_PATH_RE_G, '');
    }
  } else if (options.path && INVALID_PATH_RE.test(options.path)) {
    options.path = String(options.path).replace(INVALID_PATH_RE_G, '');
  }
  return options;
}

function hackRequest(requestFn: any, self: any, args: any, isApply: any) {
  var client: any;
  try {
    client = requestFn[isApply ? 'apply' : 'call'](self, args);
    var end = client.end;
    client.end = function () {
      try {
        end.apply(this, arguments);
      } catch (e1) {
        client.emit('error', e1);
      }
    };
  } catch (e2) {
    client = new PassThrough();
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    process.nextTick(function () {
      client.emit('error', e2);
    });
  }
  return client.on('error', noop);
}

https.request = function () {
  return hackRequest(httpsRequest, this, arguments, true);
};

http.request = function (options: any) {
  var tunnelPath =
    options && options.method === 'CONNECT' && options.proxyTunnelPath;
  options = filterInvalidPath(options);
  if (!tunnelPath) {
    return hackRequest(httpRequest, this, arguments, true);
  }
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
  var client = hackRequest(httpRequest, this, options);
  var on = client.on;
  client.on = function (type: any, listener: any) {
    if (type !== 'connect') {
      return on.apply(this, arguments);
    }
    on.call(this, type, function(this: any, res: any, socket: any, head: any) {
      socket.on('error', noop);
      if (res.statusCode !== 200) {
        return listener.apply(this, arguments);
      }
      var headers = {};
      var isHost;
      if (options.headers) {
        isHost = options.headers.Host;
        Object.keys(options.headers).forEach(function(key) {
          if (!HOST_RE.test(key)) {
            // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            headers[key] = options.headers[key];
          }
        });
      }
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      headers[isHost ? 'Host' : 'host'] = tunnelPath;
      if (options.enableIntercept) {
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        headers['x-whistle-policy'] = 'intercept';
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        delete headers['X-Whistle-Policy'];
      }
      headers = hparser.getRawHeaders(headers);
      var rawData = [
        'CONNECT ' + tunnelPath + ' HTTP/1.1',
        headers,
        '\r\n'
      ].join('\r\n');
      if (res.statusCode === 200 && res.headers['x-whistle-allow-tunnel-ack']) {
        rawData = '1' + rawData;
      }
      socket.write(rawData);
      hparser.parse(
        socket,
        function(this: any, err: any, _res: any) {
          if (err) {
            return client.emit('error', err);
          }
          res.statusCode = parseInt(_res.statusCode, 10);
          res.headers = _res.headers;
          !options.keepStreamResume && socket.pause();
          listener.call(this, res, socket, head);
        },
        true
      );
    });
    return this;
  };
  return client;
};
