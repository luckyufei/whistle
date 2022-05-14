// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var net = require('net');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var http = require('http');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var extend = require('extend');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var LRU = require('lru-cache');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var { parse: parseUrl } = require('url');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var getServer = require('hagent').create(function () {
  return net.createServer({ pauseOnConnect: true });
}, 51500);
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var formatHeaders = require('hparser').formatHeaders;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var common = require('../util/common');

var socketProto = net.Socket.prototype;
var originConnect = socketProto.connect;
var SPEC_HOST_RE =
  /.whistle-policy(?:-(internal|capture|tunnel|connect)(?:-([A-Za-z\d]+))?)?(?:\.proto-([\w%.-]+))?$/;
var lru = new LRU({ max: 5120, maxAge: 30000 });
var PROXY_ID_HEADER: any;
var proxyIp: any;
var proxyPort: any;

function toNumber(x: any) {
  x = Number(x);
  return x >= 0 ? x : false;
}

function isPipeName(s: any) {
  return typeof s === 'string' && toNumber(s) === false;
}

function normalizeArgs(args: any) {
  if (args.length === 0) {
    return [{}, null];
  }

  var arg0 = args[0];
  if (Array.isArray(arg0)) {
    return arg0;
  }
  var options = {};
  if (typeof arg0 === 'object' && arg0 !== null) {
    // (options[...][, cb])
    options = arg0;
  } else if (isPipeName(arg0)) {
    // (path[...][, cb])
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'path' does not exist on type '{}'.
    options.path = arg0;
  } else {
    // ([port][, host][...][, cb])
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'port' does not exist on type '{}'.
    options.port = arg0;
    if (args.length > 1 && typeof args[1] === 'string') {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'host' does not exist on type '{}'.
      options.host = args[1];
    }
  }

  var cb = args[args.length - 1];
  if (typeof cb !== 'function') {
    return [options, null];
  }
  return [options, cb];
}

function createSocket(opts: any, cb: any) {
  var done: any;
  var client: any;
  var headers = common.lowerCaseify(opts.headers);
  var handleCb = function (err: any, socket: any, res: any) {
    if (!done) {
      done = true;
      cb && cb(err, socket, res);
    }
    if (err && client) {
      client.destroy();
      client = null;
    }
  };
  if (opts.isHttp) {
    headers['x-whistle-policy'] = 'capture';
  } else if (opts.isConnect) {
    headers['x-whistle-policy'] = 'connect';
  } else if (!headers['x-whistle-policy']) {
    headers['x-whistle-policy'] = 'tunnel';
  }
  if (opts.reqId && typeof opts.reqId === 'string') {
    headers['x-whistle-plugin-request-id'] = opts.reqId;
  }
  if (opts.isInternal) {
    headers[PROXY_ID_HEADER] = '1';
  }
  if (opts.proto) {
    headers['x-whistle-transport-protocol'] = opts.proto;
  }
  opts.path = opts.path || opts.host + ':' + (opts.port || 80);
  headers.host = opts.path;
  var clientIp = common.removeIPV6Prefix(opts.clientIp);
  var clientPort = opts.clientPort;
  if (clientIp && net.isIP(clientIp)) {
    headers['x-forwarded-for'] = clientIp;
  }
  if (clientPort > 0 && clientPort < 65536) {
    headers['x-whistle-client-port'] = clientPort;
  }
  headers['x-whistle-request-tunnel-ack'] = '1';
  client = http.request({
    host: proxyIp,
    port: proxyPort,
    method: 'CONNECT',
    agent: false,
    path: opts.path,
    headers: headers
  });
  client.once('connect', function (res: any, socket: any) {
    socket.on('error', handleCb);
    if (res.statusCode !== 200) {
      var err = new Error(
        'Tunneling socket could not be established, statusCode=' +
          res.statusCode
      );
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'statusCode' does not exist on type 'Erro... Remove this comment to see the full error message
      err.statusCode = res.statusCode;
      socket.destroy();
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 1.
      return handleCb(err);
    }
    if (res.headers['x-whistle-allow-tunnel-ack']) {
      socket.write('1');
    }
    handleCb(null, socket, res);
  });
  client.on('error', handleCb);
  client.end();
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function (options: any, cb: any) {
  PROXY_ID_HEADER = options.PROXY_ID_HEADER;
  proxyIp = options.proxyIp;
  proxyPort = options.proxyPort;
  var wrapWsReader = options.wrapWsReader;
  var wrapWsWriter = options.wrapWsWriter;

  getServer(function (server: any, port: any) {
    var tempServerOpts = {
      host: '127.0.0.1',
      port: port
    };
    server.on('connection', function (socket: any) {
      var destroyed: any;
      var sock: any;
      var destroy = function () {
        if (!destroyed) {
          destroyed = true;
          socket.destroy();
          sock && sock.destroy();
        }
      };
      var handleProxy = function (connOpts: any) {
        createSocket(connOpts, function (err: any, sock: any) {
          if (err) {
            return destroy();
          }
          sock.on('error', destroy);
          socket.pipe(sock).pipe(socket);
          socket.resume();
        });
      };
      var key = `${socket.remotePort}:${port}`;
      var opts = lru.peek(key);
      if (opts) {
        lru.del(key);
        handleProxy(opts);
      } else {
        lru.set(key, handleProxy);
      }
    });
    var handleTempCache = function (socket: any, opts: any) {
      socket.once('connect', function () {
        var key = `${socket.localPort}:${port}`;
        var handler = lru.get(key);
        if (typeof handler === 'function') {
          lru.del(key);
          handler(opts);
        } else {
          lru.set(key, opts);
        }
      });
      return socket;
    };
    var connect = function (opts: any, cb: any) {
      var socket = net.connect(tempServerOpts, cb);
      handleTempCache(socket, opts);
      socket.on('error', common.noop);
      return socket;
    };
    var request = function (opts: any, cb: any) {
      if (typeof opts === 'string') {
        opts = { url: opts };
      } else {
        opts = extend({}, opts);
      }
      opts.url = common.setProtocol(opts.url);
      var uri = parseUrl(opts.url);
      var client;
      if (common.isConnect(uri)) {
        client = connect(
          {
            host: uri.hostname,
            port: uri.port,
            headers: opts.proxyHeaders
          },
          cb
        );
        client.isConnect = true;
        client.isTunnel = true;
        return client;
      }
      var protocol = uri.protocol;
      var isHttp = protocol === 'https:' || protocol === 'http:';
      var isWs = common.isWebSocket(uri, opts.headers);
      if (!isHttp && !isWs) {
        return cb && cb(new Error('Bad URL'));
      }

      var rawNames = {};
      var headers = common.lowerCaseify(opts.headers, rawNames);
      var isHttps = protocol === 'https:' || protocol === 'wss:';
      if (isWs) {
        headers.connection = 'Upgrade';
        headers.upgrade = 'websocket';
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'connection' does not exist on type '{}'.
        rawNames.connection = 'Connection';
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'upgrade' does not exist on type '{}'.
        rawNames.upgrade = 'Upgrade';
      }
      if (!opts.reserveHost && uri.host) {
        headers.host = uri.host;
      }
      client = http.request(
        {
          path: opts.url || '/',
          method: opts.method,
          agent: null,
          createConnection: function () {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
            return connect({
              host: uri.hostname || 'localhost',
              port: uri.port || (isHttps ? 443 : 80),
              headers: opts.proxyHeaders,
              isHttp: true,
              isInternal: opts.isInternal,
              clientIp: opts.clientIp,
              clientPort: opts.clientPort
            });
          },
          headers: formatHeaders(headers, rawNames)
        },
        cb
      );
      if (isWs) {
        client.once('upgrade', function (res: any, socket: any) {
          socket.headers = res.headers;
          if (!opts.needRawData) {
            wrapWsReader(socket, opts.maxPayload);
            wrapWsWriter(socket);
            opts.stopPing && socket.stopPing();
          }
        });
      }
      client.isHttps = isHttps;
      client.isHttp = isHttp;
      client.isWebSocket = isWs;
      client.on('error', common.noop);
      return client;
    };
    socketProto.connect = function () {
      var args = normalizeArgs(arguments);
      var opts = args[0];
      var cb = args[1];
      if (!opts || !SPEC_HOST_RE.test(opts.host)) {
        return originConnect.apply(this, arguments);
      }
      var policy = RegExp.$1;
      var reqId = RegExp.$2;
      var proto = RegExp.$3;
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      var host = opts.host.slice(0, -RegExp['$&'].length);
      originConnect.call(this, tempServerOpts, cb);
      handleTempCache(this, {
        host: host || 'localhost',
        port: opts.port,
        reqId: reqId,
        proto: proto,
        headers: opts.proxyHeaders,
        isInternal: policy === 'internal',
        isTunnel: !policy || policy === 'tunnel',
        isConnect: policy === 'connect',
        clientIp: opts.clientIp,
        clientPort: opts.clientPort
      });
      return this;
    };
    cb({
      connect: connect,
      request: request
    });
  });
};
