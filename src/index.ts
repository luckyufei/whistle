// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var express = require('express');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var http = require('http');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var https = require('https');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var socks = require('sockx');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var extend = require('extend');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var EventEmitter = require('events');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var util = require('./util');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var logger = require('./util/logger');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var rules = require('./rules');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var setupHttps = require('./https').setup;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var httpsUtil = require('./https/ca');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var rulesUtil = require('./rules/util');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var initDataServer = require('./util/data-server');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var initLogServer = require('./util/log-server');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var pluginMgr = require('./plugins');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var config = require('./config');
// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'loadService'.
var loadService = require('./service');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var initSocketMgr = require('./socket-mgr');
// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'tunnelProxy'.
var tunnelProxy = require('./tunnel');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var upgradeProxy = require('./upgrade');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var proc = require('./util/process');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var perf = require('./util/perf');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var loadCert = require('./https/load-cert');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var common = require('./util/common');

function handleClientError(err: any, socket: any) {
  if (!socket.writable) {
    return socket.destroy(err);
  }
  var errCode = err && err.code;
  var statusCode = errCode === 'HPE_HEADER_OVERFLOW' ? 431 : 400;
  var stack = util.getErrorStack(
    'clientError: Bad request' + (errCode ? ' (' + errCode + ')' : '')
  );
  socket.end('HTTP/1.1 ' + statusCode + ' Bad Request\r\n\r\n' + stack);
}

// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'proxy'.
function proxy(callback: any, _server: any) {
  var app = express();
  var server = _server || http.createServer();
  var proxyEvents = new EventEmitter();
  var middlewares = ['./init', '../biz']
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    .concat(require('./inspectors'))
    .concat(config.middlewares)
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    .concat(require('./handlers'));
  server.timeout = config.timeout;
  proxyEvents.config = config;
  proxyEvents.server = server;
  app.disable('x-powered-by');
  app.logger = logger;
  middlewares.forEach(function (mw) {
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    mw && app.use((typeof mw == 'string' ? require(mw) : mw).bind(proxyEvents));
  });
  server.on('clientError', handleClientError);
  pluginMgr.setProxy(proxyEvents);
  perf.setProxy(proxyEvents);
  initSocketMgr(proxyEvents);
  setupHttps(server, proxyEvents);
  exportInterfaces(proxyEvents);
  tunnelProxy(server, proxyEvents);
  upgradeProxy(server);
  initDataServer(proxyEvents);
  initLogServer(proxyEvents);
  rulesUtil.setup(proxyEvents);
  var properties = rulesUtil.properties;
  if (config.disableAllRules) {
    properties.set('disabledAllRules', true);
  } else if (config.disableAllRules === false) {
    properties.set('disabledAllRules', false);
  }
  if (config.disableAllPlugins) {
    properties.set('disabledAllPlugins', true);
  } else if (config.disableAllPlugins === false) {
    properties.set('disabledAllPlugins', false);
  }
  if (config.allowMultipleChoice) {
    properties.set('allowMultipleChoice', true);
  } else if (config.allowMultipleChoice === false) {
    properties.set('allowMultipleChoice', false);
  }
  rulesUtil.addValues(config.values, config.replaceExistValue);
  rulesUtil.addRules(config.rules, config.replaceExistRule);
  config.debug && rules.disableDnsCache();
  var count = _server ? 1 : 2;
  var execCallback = function () {
    if (--count === 0) {
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      process.whistleStarted = true;
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      process.emit('whistleStarted');
      typeof callback === 'function' && callback.call(server, proxyEvents);
    }
  };
  !_server && util.getBoundIp(config.host, function (host: any) {
    util.checkPort(!config.INADDR_ANY && !host && config.port, function () {
      config.host = host;
      server.listen(config.port, host, execCallback);
    });
  });
  var createNormalServer = function (port: any, httpModule: any, opts: any) {
    if (!port) {
      return;
    }
    ++count;
    var optionServer = httpModule.createServer(opts);
    var isHttps = !!opts;
    proxyEvents[isHttps ? 'httpsServer' : 'httpServer'] = optionServer;
    optionServer.on('request', function (req: any, res: any) {
      req.isHttps = isHttps;
      app.handle(req, res);
    });
    optionServer.isHttps = isHttps;
    tunnelProxy(optionServer, proxyEvents, isHttps ? 1 : 2);
    upgradeProxy(optionServer);
    optionServer.on('clientError', handleClientError);
    util.getBoundIp(
      config[isHttps ? 'httpsHost' : 'httpHost'],
      function (host: any) {
        util.checkPort(!config.INADDR_ANY && !host && port, function () {
          optionServer.listen(port, host, execCallback);
        });
      }
    );
  };
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
  createNormalServer(config.httpPort, http);
  createNormalServer(
    config.httpsPort,
    https,
    extend(
      {
        SNICallback: function (servername: any, callback: any) {
          var curUrl = 'https://' + servername;
          loadCert(
            {
              isHttpsServer: true,
              fullUrl: curUrl,
              curUrl: curUrl,
              useSNI: true,
              headers: {},
              servername: servername,
              serverName: servername,
              commonName: httpsUtil.getDomain(servername)
            },
            function () {
              httpsUtil.SNICallback(servername, callback);
            }
          );
        }
      },
      httpsUtil.createCertificate('*.wproxy.org')
    )
  );
  if (config.socksPort) {
    ++count;
    var boundHost: any;
    var socksServer = socks.createServer(function (info: any, accept: any, deny: any) {
      var dstPort = info.dstPort;
      var dstAddr = info.dstAddr;
      var connPath = dstAddr + ':' + dstPort;
      var headers = { host: connPath };
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      headers['x-whistle-server'] = 'socks';
      if (
        config.socksMode ||
        (dstPort != 80 &&
          dstPort != 443 &&
          (dstPort != config.port ||
            (!util.isLocalAddress(dstAddr) && !config.isLocalUIUrl(dstAddr))))
      ) {
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        headers['x-whistle-policy'] = 'tunnel';
      }
      var client = http.request({
        method: 'CONNECT',
        agent: false,
        path: connPath,
        host: boundHost,
        port: config.port,
        headers: headers
      });
      var destroy = function () {
        if (client) {
          client.abort();
          client = null;
          deny();
        }
      };
      client.on('error', destroy);
      client.on('connect', function (res: any, socket: any) {
        socket.on('error', destroy);
        if (res.statusCode != 200) {
          return destroy();
        }
        var reqSock = accept(true);
        if (reqSock) {
          reqSock.pipe(socket).pipe(reqSock);
        } else {
          destroy();
        }
      });
      client.end();
    });
    proxyEvents.socksServer = socksServer;
    util.getBoundIp(config.socksHost, function (host: any) {
      boundHost = host || '127.0.0.1';
      util.checkPort(
        !config.INADDR_ANY && !host && config.socksPort,
        function () {
          socksServer.listen(config.socksPort, host, execCallback);
        }
      );
      socksServer.useAuth(socks.auth.None());
    });
  }
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  require('../biz/init')(proxyEvents, function () {
    server.on('request', app);
    execCallback();
  });
  return proxyEvents;
}

function exportInterfaces(obj: any) {
  obj.getWhistlePath = common.getWhistlePath;
  obj.rules = rules;
  obj.util = util;
  obj.rulesUtil = rulesUtil;
  obj.rulesMgr = rules;
  obj.httpsUtil = httpsUtil;
  obj.pluginMgr = pluginMgr;
  obj.logger = logger;
  obj.loadService = loadService;
  obj.setAuth = config.setAuth;
  obj.setUIHost = config.setUIHost;
  obj.setPluginUIHost = config.setPluginUIHost;
  obj.socketMgr = initSocketMgr;
  obj.getRuntimeInfo = function () {
    return proc;
  };
  obj.getShadowRules = function () {
    return config.shadowRules;
  };
  obj.setShadowRules = function (shadowRules: any) {
    if (typeof shadowRules === 'string') {
      config.shadowRules = shadowRules;
      rulesUtil.parseRules();
    }
  };
  return obj;
}

function handleGlobalException(err: any) {
  var code = err && err.code;
  if (
    code === 'EPIPE' ||
    code === 'ERR_HTTP2_ERROR' ||
    code === 'ENETUNREACH' ||
    code === 'ERR_HTTP_TRAILER_INVALID' ||
    code === 'ERR_INTERNAL_ASSERTION' ||
    (err && /finishwrite/i.test(err.message))
  ) {
    return;
  }
  if (
    !err ||
    (code !== 'ERR_IPC_CHANNEL_CLOSED' && code !== 'ERR_IPC_DISCONNECTED')
  ) {
    var stack = util.getErrorStack(err);
    common.writeLogSync('\r\n' + stack + '\r\n');
    /*eslint no-console: "off"*/
    console.error(stack);
    if (
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      typeof process.handleUncauthtWhistleErrorMessage === 'function' &&
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      process.handleUncauthtWhistleErrorMessage(stack, err) === false
    ) {
      return;
    }
  }
  setTimeout(function () {
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    process.exit(1);
  }, 360);
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
process.on('unhandledRejection', handleGlobalException);
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
process.on('uncaughtException', handleGlobalException);

rulesUtil.parseRules();

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = exportInterfaces(proxy);
