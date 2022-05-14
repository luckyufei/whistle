// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var net = require('net');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var tls = require('tls');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var http = require('http');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var url = require('url');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var socks = require('sockx');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var crypto = require('crypto');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var EventEmitter = require('events').EventEmitter;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var Buffer = require('safe-buffer').Buffer;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var LRU = require('lru-cache');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var checkSNI = require('sni');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var util = require('../util');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var extend = require('extend');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var config = require('../config');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var rules = require('../rules');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var pluginMgr = require('../plugins');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var socketMgr = require('../socket-mgr');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var hparser = require('hparser');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var properties = require('../rules/util').properties;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var ca = require('./ca');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var loadCert = require('./load-cert');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var h2Consts = config.enableH2 ? require('http2').constants : {};

var STATUS_CODES = http.STATUS_CODES || {};
var getRawHeaders = hparser.getRawHeaders;
var getRawHeaderNames = hparser.getRawHeaderNames;
var formatHeaders = hparser.formatHeaders;
var parseReq = hparser.parse;
// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'getDomain'.
var getDomain = ca.getDomain;
var serverAgent = ca.serverAgent;
var getSNIServer = ca.getSNIServer;
var getHttp2Server = ca.getHttp2Server;
var LOCALHOST = '127.0.0.1';
var tunnelTmplData = new LRU({ max: 3000, maxAge: 30000 });
var TIMEOUT = 6000;
var CONN_TIMEOUT = 60000;
var X_RE = /^x/;
// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'proxy'.
var proxy, server: any;

// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'handleWebsocket'.
function handleWebsocket(socket: any, clientIp: any, clientPort: any) {
  var wss = socket.isHttps;
  clientIp = util.removeIPV6Prefix(
    clientIp || socket._remoteAddr || socket.remoteAddress
  );
  socket.clientIp = clientIp;
  socket.method = 'GET';
  socket.reqId = util.getReqId();
  socket.clientPort = clientPort || socket._remotePort || socket.remotePort;
  rules.initHeaderRules(socket);
  pluginMgr.resolvePipePlugin(socket, function () {
    socket.rules = rules.initRules(socket);
    rules.resolveRulesFile(socket, function () {
      resolveWebsocket(socket, wss);
    });
  });
}

function resolveWebsocket(socket: any, wss: any) {
  var headers = socket.headers;
  var reqEmitter = new EventEmitter();
  var fullUrl = socket.fullUrl;
  var _rules = socket.rules;
  var clientIp = socket.clientIp;
  var filter = socket._filters;
  var now = Date.now();
  var reqData = {
    ip: clientIp,
    port: socket.clientPort,
    method: 'GET',
    httpVersion: socket.httpVersion || '1.1',
    headers: headers,
    rawHeaderNames: socket.rawHeaderNames
  };
  var resData = {};
  var data = {
    _clientId: socket._clientId,
    id: socket.reqId,
    url: fullUrl,
    startTime: now,
    sniPlugin: socket.sniPlugin,
    fwdHost: socket._fwdHost,
    rules: _rules,
    req: reqData,
    res: resData,
    pipe: socket._pipeRule,
    rulesHeaders: socket.rulesHeaders
  };

  var reqSocket: any,
    options: any,
    isXProxy: any,
    isInternalProxy: any;
  var origProto: any, done: any, proxyUrl: any, clientKey: any, clientCert: any, isPfx: any, curStatus: any;
  var timeout = setTimeout(function () {
    destroy(new Error('Timeout'));
  }, CONN_TIMEOUT);
  var handleResponse = function () {
    var svrRes = util.getStatusCodeFromRule(_rules);
    if (!svrRes) {
      return;
    }
    var statusCode = svrRes.statusCode;
    var status = util.getStatusCode(statusCode);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'headers' does not exist on type '{}'.
    var resHeaders = resData.headers = svrRes.headers;
    var body = '';
    var statusMsg;
    util.deleteReqHeaders(socket);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'body' does not exist on type '{}'.
    resData.body = body;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'ip' does not exist on type '{}'.
    resData.ip = resData.ip || LOCALHOST;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'requestTime' does not exist on type '{ _... Remove this comment to see the full error message
    data.requestTime = data.dnsTime = Date.now();
    getResRules(socket, resData, function () {
      status = curStatus || status;
      var isSuccess = status == 101;
      if (isSuccess) {
        statusMsg = 'HTTP/1.1 101 Switching Protocols';
        var protocol = (headers['sec-websocket-protocol'] || '').split(/, */);
        var key =
          headers['sec-websocket-key'] + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'createHash' does not exist on type 'Cryp... Remove this comment to see the full error message
        key = crypto.createHash('sha1').update(key, 'binary').digest('base64');
        resHeaders['Sec-WebSocket-Accept'] = key;
        resHeaders.Upgrade = 'websocket';
        resHeaders.Connection = 'Upgrade';
        if (protocol[0]) {
          resHeaders['Sec-WebSocket-Protocol'] = protocol[0];
        }
        reqSocket = util.getEmptyRes();
        reqSocket.headers = resHeaders;
        socketMgr.handleUpgrade(socket, reqSocket);
      } else {
        if (!status) {
          status = 502;
          body = 'Invalid status code: ' + statusCode;
          resHeaders['Content-Type'] = 'text/html; charset=utf8';
          resHeaders['Content-Length'] = Buffer.byteLength(body) + '';
        }
        resHeaders.Connection = 'close';
        statusMsg = 'HTTP/1.1 ' + status;
      }
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'statusCode' does not exist on type '{}'.
      resData.statusCode = status;
      var curHeaders = resHeaders;
      if (socket.fromComposer) {
        curHeaders = extend({}, resHeaders);
        curHeaders['x-whistle-req-id'] = socket.reqId;
      }
      var rawData =
        statusMsg + '\r\n' + getRawHeaders(curHeaders) + '\r\n\r\n' + body;
      var end = function () {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'responseTime' does not exist on type '{ ... Remove this comment to see the full error message
        data.responseTime = data.endTime = Date.now();
        if (isSuccess) {
          socket.write(rawData);
        } else {
          socket.end(rawData);
        }
        execCallback(null, socket);
      };
      var reqDelay = util.getMatcherValue(_rules.reqDelay) || 0;
      var resDelay = util.getMatcherValue(_rules.resDelay) || 0;
      var delay = reqDelay + resDelay;
      if (delay > 0) {
        clearTimeout(timeout);
        setTimeout(end, delay);
      } else {
        end();
      }
    });

    return true;
  };

  var plugin = pluginMgr.resolveWhistlePlugins(socket);
  abortIfUnavailable(socket);
  pluginMgr.getRules(socket, function (rulesMgr: any) {
    if (rulesMgr) {
      socket.pluginRules = rulesMgr;
      socket.curUrl = fullUrl;
      util.mergeRules(socket, rulesMgr.resolveReqRules(socket));
      util.filterWeakRule(socket);
      if (util.isIgnored(filter, 'rule')) {
        plugin = null;
      } else {
        plugin = pluginMgr.getPluginByRuleUrl(util.rule.getUrl(_rules.rule));
      }
    } else {
      util.filterWeakRule(socket);
    }

    var ruleUrlValue = plugin ? null : util.rule.getUrl(_rules.rule);
    if (
      ruleUrlValue &&
      fullUrl !== ruleUrlValue &&
      /^(ws|http)s?:\/\//.test(ruleUrlValue)
    ) {
      if (RegExp.$1 === 'http') {
        ruleUrlValue = ruleUrlValue.replace('http', 'ws');
      }
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'realUrl' does not exist on type '{ _clie... Remove this comment to see the full error message
      data.realUrl = fullUrl = util.encodeNonLatin1Char(ruleUrlValue);
    }
    if (_rules.referer) {
      var referer = util.getMatcherValue(_rules.referer);
      headers.referer = referer;
    }
    if (_rules.ua) {
      var ua = util.getMatcherValue(_rules.ua);
      headers['user-agent'] = ua;
    }
    if (util.showPluginReq(socket) && !socket.isInternalUrl) {
      if (socket.isLogRequests !== false) {
        ++util.proc.wsRequests;
        ++util.proc.totalWsRequests;
        socket.isLogRequests = true;
      }
      if (config.captureData && (!filter.hide || socket.disable.hide)) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'abort' does not exist on type '{ _client... Remove this comment to see the full error message
        data.abort = destroy;
        if (socket.isPluginReq) {
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'isPR' does not exist on type '{ _clientI... Remove this comment to see the full error message
          data.isPR = 1;
        }
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'emit' does not exist on type '(callback:... Remove this comment to see the full error message
        proxy.emit('request', reqEmitter, data);
      }
    }
    setupSocket(function () {
      if (!socket.disable.abort && (socket.enable.abort || filter.abort)) {
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
        return destroy();
      }
      if (handleResponse()) {
        return;
      }

      pluginMgr.loadPlugin(
        socket.isPluginReq ? null : plugin,
        function (err: any, ports: any) {
          if (plugin) {
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'dnsTime' does not exist on type '{ _clie... Remove this comment to see the full error message
            data.dnsTime = Date.now();
          }
          if (err) {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
            return execCallback(err);
          }
          var port = ports && ports.upgrade && ports.port;
          if (port) {
            options.isPlugin = true;
            options.port = port;
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'realUrl' does not exist on type '{ _clie... Remove this comment to see the full error message
            data.realUrl = util.changePort(fullUrl, options.port);
            socket.customParser = util.getParserStatus(socket);
            pluginMgr.addRuleHeaders(socket, _rules);
            socketMgr.setPending(socket);
            options.protocol = 'ws:';
            socket.headers[config.PLUGIN_HOOK_NAME_HEADER] =
              config.PLUGIN_HOOKS.HTTP;
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 0.
            connectServer();
            return;
          }
          plugin = null;
          rules.getClientCert(socket, function (_key: any, _cert: any, _isPfx: any) {
            clientKey = _key;
            clientCert = _cert;
            isPfx = _isPfx;
            rules.getProxy(fullUrl, socket, function (err: any, hostIp: any, hostPort: any) {
              var proxyRule = _rules.proxy;
              var connectProxy: any;
              var send = function () {
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'requestTime' does not exist on type '{ _... Remove this comment to see the full error message
                data.requestTime = Date.now();
                if (connectProxy) {
                  connectProxy();
                } else {
                  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
                  connectServer(hostIp, hostPort);
                }
              };
              var connect = function () {
                var reqDelay = util.getMatcherValue(_rules.reqDelay);
                if (reqDelay > 0) {
                  clearTimeout(timeout);
                  setTimeout(function () {
                    timeout = setTimeout(function () {
                      destroy(new Error('Timeout'));
                    }, CONN_TIMEOUT);
                    send();
                  }, reqDelay);
                } else {
                  send();
                }
              };
              proxyUrl = proxyRule ? util.rule.getMatcher(proxyRule) : null;
              if (proxyUrl) {
                isXProxy = X_RE.test(proxyUrl);
                var isSocks = proxyRule.isSocks;
                isInternalProxy = proxyRule.isInternal || util.isInternalProxy(socket);
                var isHttpsProxy = proxyRule.isHttps;
                if (!isInternalProxy && !wss && proxyRule.isHttp2https) {
                  wss = true;
                } else {
                  wss = options.protocol === 'wss:';
                }
                proxyUrl = 'http:' + util.removeProtocol(proxyUrl);
                getServerIp(
                  proxyUrl,
                  function (ip: any) {
                    var proxyOptions = url.parse(proxyUrl);
                    proxyOptions.auth = proxyOptions.auth || socket._pacAuth;
                    hostPort = proxyOptions.port;
                    hostIp = ip;
                    var proxyPort = (proxyOptions.port =
                      parseInt(hostPort, 10) ||
                      (isSocks ? 1080 : isHttpsProxy ? 443 : 80));
                    var isProxyPort = util.isProxyPort(proxyPort);
                    if (isProxyPort && util.isLocalAddress(ip)) {
                      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
                      return execCallback(
                        new Error('Self loop (' + ip + ':' + proxyPort + ')')
                      );
                    }

                    options.proxyHost = ip;
                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'port' does not exist on type '{}'.
                    resData.port = options.proxyPort = proxyPort;
                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'port' does not exist on type '{}'.
                    socket.serverPort = resData.port;
                    options.host = options.hostname;
                    if (!options.port) {
                      options.port = wss ? 443 : 80;
                    }
                    var proxyOpts: any, ciphers: any;
                    var handleProxy = function (proxySocket: any) {
                      if (wss) {
                        var opts = {
                          rejectUnauthorized: config.rejectUnauthorized,
                          socket: proxySocket,
                          ciphers: ciphers
                        };
                        if (!socket.disable.servername) {
                          // @ts-expect-error ts-migrate(2339) FIXME: Property 'servername' does not exist on type '{ re... Remove this comment to see the full error message
                          opts.servername = options.hostname;
                        }
                        util.setClientCert(opts, clientKey, clientCert, isPfx);
                        var handleProxyError = function (err: any) {
                          if (
                            connectProxy &&
                            !ciphers &&
                            util.isCiphersError(err)
                          ) {
                            ciphers = util.getCipher(_rules);
                            connectProxy();
                          } else if (
                            connectProxy &&
                            util.checkTlsError(err) &&
                            util.checkAuto2Http(socket, ip, proxyUrl)
                          ) {
                            wss = false;
                            // @ts-expect-error ts-migrate(2339) FIXME: Property 'httpsTime' does not exist on type '{ _cl... Remove this comment to see the full error message
                            data.httpsTime = data.httpsTime || Date.now();
                            // @ts-expect-error ts-migrate(2339) FIXME: Property 'useHttp' does not exist on type '{ _clie... Remove this comment to see the full error message
                            data.useHttp = true;
                            if (proxyOpts && options.port == 443) {
                              proxyOpts.port = options.port = 80;
                              proxyOpts.headers.host =
                                proxyOpts.host + ':' + proxyOpts.port;
                            }
                            connectProxy();
                          } else {
                            // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
                            execCallback(err);
                          }
                        };
                        try {
                          proxySocket = tls.connect(opts);
                          proxySocket.on('error', handleProxyError);
                          reqSocket = proxySocket;
                          proxySocket.on('secureConnect', function () {
                            abortIfUnavailable(reqSocket);
                            pipeData();
                          });
                        } catch (e) {
                          handleProxyError(e);
                        }
                        return;
                      }
                      reqSocket = proxySocket;
                      abortIfUnavailable(reqSocket);
                      pipeData();
                    };
                    // 对应 internal-proxy 要用直接请求，方便用来穿透 nginx
                    if (isInternalProxy && !socket._phost) {
                      if (wss) {
                        headers[config.HTTPS_FIELD] = 1;
                        options.protocol = null;
                        origProto = 'wss:';
                        wss = false;
                      }
                    } else {
                      if (isSocks) {
                        options.localDNS = false;
                        options.auths = config.getAuths(proxyOptions);
                      } else {
                        var proxyHeaders = (options.headers = {});
                        pluginMgr.getTunnelKeys().forEach(function (k: any) {
                          var val = headers[k];
                          if (val) {
                            // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                            proxyHeaders[k] = val;
                          }
                        });
                        var auth = headers['proxy-authorization'];
                        if (auth) {
                          // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                          proxyHeaders['proxy-authorization'] = auth;
                        }
                        if (socket.disable.proxyUA) {
                          // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                          delete proxyHeaders['user-agent'];
                        } else if (headers['user-agent']) {
                          // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                          proxyHeaders['user-agent'] = headers['user-agent'];
                        }
                        if (wss && isInternalProxy) {
                          headers[config.HTTPS_FIELD] = 1;
                          options.protocol = null;
                          origProto = 'wss:';
                          wss = false;
                        }
                        if (!util.isLocalAddress(clientIp)) {
                          // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                          proxyHeaders[config.CLIENT_IP_HEAD] = clientIp;
                        }
                        if (isProxyPort) {
                          // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                          proxyHeaders[config.WEBUI_HEAD] = 1;
                        }
                        if (util.isLocalPHost(socket, wss)) {
                          headers[config.WEBUI_HEAD] = 1;
                        }
                        var clientId = headers[config.CLIENT_ID_HEADER];
                        if (clientId) {
                          // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                          proxyHeaders[config.CLIENT_ID_HEADER] = clientId;
                        }
                        util.checkIfAddInterceptPolicy(proxyHeaders, headers);
                        util.setClientId(
                          proxyHeaders,
                          socket.enable,
                          socket.disable,
                          clientIp,
                          isInternalProxy
                        );
                        options.proxyAuth = proxyOptions.auth;
                      }
                      var netMgr = isSocks ? socks : config;
                      proxyOpts = util.setProxyHost(socket, options);
                      if (isHttpsProxy) {
                        proxyOpts.proxyServername = proxyOptions.hostname;
                      }
                      connectProxy = function () {
                        if (destroyed) {
                          return;
                        }
                        if (socket._phost) {
                          // @ts-expect-error ts-migrate(2339) FIXME: Property 'phost' does not exist on type '{}'.
                          resData.phost = socket._phost.host;
                        }
                        proxyOpts.enableIntercept = true;
                        proxyOpts.proxyTunnelPath = util.getProxyTunnelPath(
                          socket,
                          wss
                        );
                        try {
                          var s = netMgr.connect(proxyOpts, handleProxy);
                          s.on(
                            'error',
                            isXProxy
                              ? function () {
                                if (isXProxy) {
                                  isXProxy = false;
                                  // @ts-expect-error ts-migrate(2339) FIXME: Property 'phost' does not exist on type '{}'.
                                  resData.phost = undefined;
                                  if (isInternalProxy) {
                                    options.protocol = origProto;
                                  }
                                  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 0.
                                  connectServer();
                                }
                              }
                              : execCallback
                          );
                        } catch (e) {
                          // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
                          execCallback(e);
                        }
                      };
                    }
                    connect();
                  },
                  null,
                  null,
                  proxyRule
                );
              } else {
                connect();
              }
            });
          });
        }
      );
    });
  });

  var retryConnect: any, auto2http: any;
  var retryXHost = 0;
  function connectServer(hostIp: any, hostPort: any, ciphers: any) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 5 arguments, but got 4.
    getServerIp(
      fullUrl,
      function (ip: any, port: any) {
        var isWss = options.protocol === 'wss:';
        var _port = port;
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'port' does not exist on type '{}'.
        resData.port = port = port || options.port || (isWss ? 443 : 80);
        socket.serverPort = port;
        if (destroyed) {
          return;
        }
        if (util.isProxyPort(port) && util.isLocalAddress(ip)) {
          // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
          return execCallback(new Error('Self loop (' + ip + ':' + port + ')'));
        }
        // checkHandUpError, retry
        try {
          var opts = {
            rejectUnauthorized: config.rejectUnauthorized,
            host: ip,
            port: port
          };
          if (!socket.disable.servername) {
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'servername' does not exist on type '{ re... Remove this comment to see the full error message
            opts.servername =
              util.parseHost(headers.host)[0] || options.hostname;
          }
          isWss && util.setClientCert(opts, clientKey, clientCert, isPfx);
          if (ciphers) {
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'ciphers' does not exist on type '{ rejec... Remove this comment to see the full error message
            opts.ciphers = ciphers;
          }
          reqSocket = (isWss ? tls : net).connect(opts, pipeData);
        } catch (e) {
          // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
          return execCallback(e);
        }
        if (retryConnect) {
          abortIfUnavailable(reqSocket);
        } else {
          retryConnect = function (e: any) {
            if (
              retryXHost < 2 &&
              ((_rules.host && X_RE.test(_rules.host.matcher)) ||
                (isInternalProxy && isXProxy))
            ) {
              ++retryXHost;
              retryConnect = false;
              if (retryXHost > 1) {
                socket.curUrl = fullUrl;
                rules.lookupHost(socket, function (err: any, _ip: any) {
                  // @ts-expect-error ts-migrate(2339) FIXME: Property 'ip' does not exist on type '{}'.
                  socket.hostIp = resData.ip = _ip || LOCALHOST;
                  if (err) {
                    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
                    return execCallback(err);
                  }
                  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 1.
                  connectServer(_ip);
                });
                return;
              }
            } else if (isWss && util.checkAuto2Http(socket, ip, proxyUrl)) {
              if (auto2http || util.checkTlsError(e)) {
                options.protocol = null;
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'httpsTime' does not exist on type '{ _cl... Remove this comment to see the full error message
                data.httpsTime = data.httpsTime || Date.now();
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'useHttp' does not exist on type '{ _clie... Remove this comment to see the full error message
                data.useHttp = true;
              } else {
                retryConnect = false;
                auto2http = true;
              }
            }
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
            connectServer(ip, _port);
          };
          var retried: any;
          // 不要用once，防止多次触发error导致crash
          reqSocket.on('error', function(this: any, err: any) {
            if (retried) {
              return;
            }
            retried = true;
            this.destroy && this.destroy();
            if (destroyed || !retryConnect) {
              return;
            }
            if (!ciphers && isWss && util.isCiphersError(err)) {
              connectServer(hostIp, hostPort, util.getCipher(_rules));
            } else {
              retryConnect();
            }
          });
        }
      },
      hostIp,
      hostPort
    );
  }

  function pipeData() {
    var enable = socket.enable;
    var disable = socket.disable;
    if (retryConnect) {
      reqSocket.removeListener('error', retryConnect);
      abortIfUnavailable(reqSocket);
      retryConnect = null;
    }
    clearTimeout(timeout);
    if (proxyUrl) {
      util.setClientId(headers, enable, disable, clientIp, isInternalProxy);
    } else {
      var clientId = headers[config.CLIENT_ID_HEADER];
      if (clientId) {
        if (!options.isPlugin && !util.isEnable(socket, 'keepClientId')) {
          socket._origClientId = clientId;
          util.removeClientId(headers);
        }
        // @ts-expect-error ts-migrate(2551) FIXME: Property 'clientId' does not exist on type '{ _cli... Remove this comment to see the full error message
        data.clientId = clientId;
      }
    }
    if (disable.clientIp || disable.clientIP) {
      delete headers[config.CLIENT_IP_HEAD];
    } else {
      var forwardedFor = util.getMatcherValue(_rules.forwardedFor);
      if (net.isIP(forwardedFor)) {
        headers[config.CLIENT_IP_HEAD] = forwardedFor;
      } else if (net.isIP(socket._customXFF)) {
        headers[config.CLIENT_IP_HEAD] = socket._customXFF;
      } else if (
        (!isInternalProxy &&
          !plugin &&
          !socket.enableXFF &&
          !enable.clientIp &&
          !enable.clientIP) ||
        util.isLocalAddress(clientIp)
      ) {
        delete headers[config.CLIENT_IP_HEAD];
      } else {
        headers[config.CLIENT_IP_HEAD] = clientIp;
      }
    }
    util.deleteReqHeaders(socket);
    reqSocket.write(socket.getBuffer(headers, options.path));
    reqSocket.resume();
    delete headers['x-whistle-frame-parser'];
    delete headers[config.HTTPS_FIELD];
    _pipeData();
  }

  function setupSocket(cb: any) {
    var authObj = util.getAuthByRules(_rules);
    var list = [
      _rules.reqHeaders,
      _rules.reqCors,
      _rules.reqCookies,
      _rules.params,
      _rules.urlReplace,
      _rules.urlParams,
      authObj ? null : _rules.auth
    ];
    util.parseRuleJson(
      list,
      function (
        reqHeaders: any,
        reqCors: any,
        reqCookies: any,
        params: any,
        urlReplace: any,
        urlParams: any,
        auth: any
      ) {
        if (params && urlParams) {
          extend(params, urlParams);
        } else {
          params = params || urlParams;
        }
        var newUrl = params
          ? util.replaceUrlQueryString(fullUrl, params)
          : fullUrl;
        newUrl = util.parsePathReplace(newUrl, urlReplace) || newUrl;
        if (newUrl !== fullUrl) {
          fullUrl = newUrl;
          options = util.parseUrl(fullUrl);
          socket._realUrl = newUrl;
        } else {
          options = util.parseUrl(fullUrl);
        }
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'realUrl' does not exist on type '{ _clie... Remove this comment to see the full error message
        data.realUrl = fullUrl;
        var host = (headers.host = options.host);
        socket._origin = headers.origin;
        if (reqHeaders) {
          reqHeaders = util.lowerCaseify(reqHeaders, socket.rawHeaderNames);
          socket._customXFF = reqHeaders[config.CLIENT_IP_HEAD];
          delete reqHeaders[config.CLIENT_IP_HEAD];
          extend(headers, reqHeaders);
          headers.host = headers.host || host;
        }
        auth = util.getAuthBasic(auth || authObj);
        if (auth) {
          headers['authorization'] = auth;
        }
        var reqRuleData = { headers: headers };
        util.setReqCors(reqRuleData, reqCors);
        util.setReqCookies(reqRuleData, reqCookies, headers.cookie);
        if (_rules.referer) {
          headers.referer = util.getMatcherValue(_rules.referer);
        }

        util.disableReqProps(socket);
        pluginMgr.postStats(socket);
        cb();
      },
      socket
    );
  }

  function getResRules(socket: any, res: any, callback: any) {
    socket.statusCode = res.statusCode || '';
    var curResHeaders = (socket.resHeaders = res.headers);
    pluginMgr.getResRules(socket, res, function () {
      util.parseRuleJson(
        [_rules.resHeaders, _rules.resCors, _rules.resCookies],
        function (resHeaders: any, cors: any, cookies: any) {
          if (resHeaders) {
            resHeaders = util.lowerCaseify(resHeaders, res.rawHeaderNames);
            extend(res.headers, resHeaders);
          }
          var origin = curResHeaders['access-control-allow-origin'];
          if (socket._origin && origin && origin !== '*') {
            curResHeaders['access-control-allow-origin'] = socket._origin;
          }
          var resRuleData = { headers: curResHeaders };
          util.setResCors(resRuleData, cors, socket);
          util.setResCookies(resRuleData, cookies);
          util.setResponseFor(_rules, curResHeaders, socket, socket.hostIp);
          var delResHeaders = util.parseDeleteProperties(socket).resHeaders;
          Object.keys(delResHeaders).forEach(function (name) {
            delete curResHeaders[name];
          });
          util.disableResProps(socket, curResHeaders);
          curStatus = util.getMatcherValue(_rules.replaceStatus);
          callback();
        },
        socket
      );
    });
  }

  function _pipeData() {
    parseReq(
      reqSocket,
      function (err: any, res: any) {
        if (err) {
          // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
          return execCallback(err);
        }
        reqSocket.pause();
        socket.statusCode = res.statusCode || '';
        socket.resHeaders = res.headers;
        var curResHeaders = (reqSocket.headers = res.headers);
        getResRules(socket, res, function () {
          util.delay(util.getMatcherValue(_rules.resDelay), function () {
            reqSocket.reqId = data.id;
            var code = curStatus || res.statusCode;
            socket.statusCode = res.statusCode = code;
            var curHeaders = curResHeaders;
            if (socket.fromComposer) {
              curHeaders = extend({}, curResHeaders);
              curHeaders['x-whistle-req-id'] = reqSocket.reqId;
            }
            if (code == 101) {
              socket.write(res.getHeaders(curHeaders, curStatus));
              if (res.bodyBuffer.length) {
                reqSocket.unshift(res.bodyBuffer);
              }
              socketMgr.handleUpgrade(socket, reqSocket);
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'body' does not exist on type '{}'.
              resData.body = '';
            } else {
              socket.write(res.getBuffer(curHeaders, curStatus));
              reqSocket.resume();
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'body' does not exist on type '{}'.
              resData.body = res.body;
            }
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'headers' does not exist on type '{}'.
            resData.headers = curResHeaders;
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'rawHeaderNames' does not exist on type '... Remove this comment to see the full error message
            resData.rawHeaderNames = res.rawHeaderNames;
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'statusCode' does not exist on type '{}'.
            resData.statusCode = code;
            reqEmitter.emit('response', data);
            execCallback(null, reqSocket);
          });
        });
      },
      true
    );
  }

  function getServerIp(url: any, callback: any, hostIp: any, hostPort: any, proxyRule: any) {
    if (plugin) {
      return callback(LOCALHOST);
    }
    var hostHandler = function (err: any, ip: any, port: any, hostRule: any) {
      if (err) {
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
        return execCallback(err);
      }
      if (hostRule) {
        (proxyRule || _rules).host = hostRule;
      }
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'ip' does not exist on type '{}'.
      socket.hostIp = resData.ip = util.getHostIp(ip, port);
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'requestTime' does not exist on type '{ _... Remove this comment to see the full error message
      data.requestTime = data.dnsTime = Date.now();
      reqEmitter.emit('send', data);
      callback(ip, port);
    };
    if (hostIp) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
      hostHandler(null, hostIp, hostPort);
    } else {
      socket.curUrl = url;
      rules.resolveHost(
        socket,
        hostHandler,
        socket.pluginRules,
        socket.rulesFileMgr,
        socket.headerRulesMgr
      );
    }
  }

  function abortIfUnavailable(socket: any) {
    return util.onSocketEnd(socket, destroy);
  }
  var destroyed: any, reqDestroyed: any, resDestroyed: any;
  function destroy(err: any) {
    if (!reqDestroyed) {
      reqDestroyed = true;
      socket.destroy();
    }
    if (reqSocket && !resDestroyed) {
      resDestroyed = true;
      reqSocket.destroy();
    }
    if (destroyed) {
      return;
    }
    destroyed = true;
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    execCallback(err);
  }

  function execCallback(err: any, _socket: any) {
    if (done) {
      return;
    }
    done = true;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'dnsTime' does not exist on type '{ _clie... Remove this comment to see the full error message
    data.dnsTime = data.dnsTime || Date.now();
    clearTimeout(timeout);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'responseTime' does not exist on type '{ ... Remove this comment to see the full error message
    data.responseTime = data.endTime = Date.now();
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'ip' does not exist on type '{}'.
    socket.hostIp = resData.ip = resData.ip || LOCALHOST;
    if (!err && !_socket) {
      err = new Error('Aborted');
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'reqError' does not exist on type '{ _cli... Remove this comment to see the full error message
      data.reqError = true;
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'statusCode' does not exist on type '{}'.
      resData.statusCode = 'aborted';
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'body' does not exist on type '{ ip: any;... Remove this comment to see the full error message
      reqData.body = util.getErrorStack(err);
      reqEmitter.emit('abort', data);
    } else if (err) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'resError' does not exist on type '{ _cli... Remove this comment to see the full error message
      data.resError = true;
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'statusCode' does not exist on type '{}'.
      resData.statusCode = resData.statusCode || 502;
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'body' does not exist on type '{}'.
      resData.body = util.getErrorStack(err);
      util.emitError(reqEmitter, data);
      destroy(err);
    } else {
      reqEmitter.emit('end', data);
    }
    if (err) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'headers' does not exist on type '{}'.
      resData.headers = { 'x-server': 'whistle' };
    }
    pluginMgr.postStats(socket, _socket || resData);
  }
}

function getTunnelData(socket: any, clientIp: any, clientPort: any, isHttpH2: any) {
  var enable = socket.enable || '';
  var disable = socket.disable || '';
  var headers = socket.headers;
  var tunnelData = headers[config.TUNNEL_DATA_HEADER];
  var tdKey = config.tdKey;
  if (tdKey && (!tunnelData || config.overTdKey)) {
    tunnelData = headers[tdKey] || tunnelData;
  }
  var tunnelHeaders: any;
  var tunnelKeys = pluginMgr.getTunnelKeys();
  tunnelKeys.forEach(function (k: any) {
    var val = headers[k];
    if (val) {
      tunnelHeaders = tunnelHeaders || {};
      tunnelHeaders[k] = val;
    }
  });
  return {
    clientIp: clientIp,
    clientPort: clientPort,
    remoteAddr: socket._remoteAddr,
    remotePort: socket._remotePort,
    clientId: headers[config.CLIENT_ID_HEADER],
    proxyAuth: disable.tunnelAuthHeader
                  ? undefined
                  : headers['proxy-authorization'],
    tunnelData: tunnelData,
    headers: tunnelHeaders,
    tunnelFirst:
                  enable.tunnelHeadersFirst && !disable.tunnelHeadersFirst,
    isHttpH2: isHttpH2,
    sniPlugin: socket.sniPlugin
  };
}

function addReqInfo(req: any) {
  var socket = req.socket;
  var remoteData =
    socket._remoteDataInfo ||
    tunnelTmplData.get(socket.remotePort + ':' + socket.localPort);
  var headers = req.headers;
  if (remoteData) {
    req.isHttpH2 = remoteData.isHttpH2;
    socket._remoteDataInfo = remoteData;
    headers[config.CLIENT_INFO_HEAD] =
      (remoteData.clientIp || LOCALHOST) +
      ',' + remoteData.clientPort +
      ',' + remoteData.remoteAddr +
      ',' + remoteData.remotePort;
    util.setTunnelHeaders(headers, remoteData);
  }
  if (!req.isHttpH2) {
    headers[config.HTTPS_FIELD] = 1;
  }
}

function getStatusMessage(obj: any) {
  return obj.statusMessage || STATUS_CODES[obj.code] || 'Unknown';
}

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
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

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
function formatRawHeaders(obj: any, isH2: any) {
  var headers = obj.headers;
  if (isH2) {
    var newHeaders = {};
    Object.keys(headers).forEach(function (name) {
      var value = headers[name];
      if (!isIllegalcHeader(name, value)) {
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        newHeaders[name] = value;
      }
    });
    return newHeaders;
  }
  var rawNames =
    Array.isArray(obj.rawHeaders) && getRawHeaderNames(obj.rawHeaders);
  return formatHeaders(headers, rawNames);
}

function addStreamEvents(stream: any, handleAbort: any) {
  if (stream) {
    stream.on('error', handleAbort);
    stream.on('aborted', handleAbort);
    stream.on('close', handleAbort);
  }
}

function toHttp1(req: any, res: any) {
  var isH2 = req.httpVersion == 2;
  var client: any;
  var handleAbort = function () {
    if (client) {
      client.abort();
      res.destroy();
      client = null;
    }
  };
  addReqInfo(req);
  addStreamEvents(req.stream, handleAbort);
  req.on('error', handleAbort);
  res.on('error', handleAbort);
  res.once('close', handleAbort);
  var host = req.headers[':authority'];
  var headers = req.headers;
  if (host) {
    req.headers.host = host;
    var newHeaders = { host: host };
    Object.keys(headers).forEach(function (name) {
      if (name[0] !== ':') {
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        newHeaders[name] = headers[name];
      }
    });
    headers = newHeaders;
  } else {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    headers = formatRawHeaders(req);
  }
  var options = util.parseUrl(util.getFullUrl(req));
  options.protocol = null;
  options.hostname = null;
  options.agent = false;
  options.host = config.host || LOCALHOST;
  options.port = config.port;
  options.headers = headers;
  if (isH2) {
    headers[config.ALPN_PROTOCOL_HEADER] = req.isHttpH2 ? 'httpH2' : 'h2';
  }
  options.method = req.method;
  client = http.request(options);
  client.on('error', handleAbort);
  client.on('response', function (svrRes: any) {
    svrRes.on('error', handleAbort);
    svrRes.once('end', function () {
      var trailers = svrRes.trailers;
      if (!util.isEmptyObject(trailers)) {
        var rawHeaderNames = svrRes.rawTrailers
          ? getRawHeaderNames(svrRes.rawTrailers)
          : null;
        try {
          res.addTrailers(formatHeaders(trailers, rawHeaderNames));
        } catch (e) {}
      }
    });
    try {
      var code = svrRes.statusCode;
      res.writeHead(
        code,
        getStatusMessage(svrRes),
        formatRawHeaders(svrRes, isH2)
      );
      var write = res.write;
      var handleError = function (e: any) {
        e && handleAbort();
      };
      res.write = function (chunk: any) {
        return write.call(res, chunk, handleError);
      };
      svrRes.pipe(res);
      res.flushHeaders && res.flushHeaders();
    } catch (e) {
      handleAbort();
    }
  });
  req.pipe(client);
}

var handlers = {
  request: function (req: any, res: any) {
    addReqInfo(req);
    server.emit('request', req, res);
  },
  upgrade: function (req: any, socket: any) {
    addReqInfo(req);
    server.emit('upgrade', req, socket);
  }
};
var h2Handlers = config.enableH2
  ? {
    request: toHttp1,
    upgrade: handlers.upgrade
  }
  : handlers;

var HTTP_RE = /^(\w+)\s+(\S+)\s+HTTP\/1.\d$/im;
var HTTP2_RE = /^PRI\s\*\s+HTTP\/2.0$/im;
var CONNECT_RE = /^CONNECT$/i;

function addClientInfo(socket: any, chunk: any, statusLine: any, clientIp: any, clientPort: any) {
  var len = Buffer.byteLength(statusLine);
  chunk = chunk.slice(len);
  statusLine +=
    '\r\n' +
    config.CLIENT_INFO_HEAD +
    ': ' +
    clientIp +
    ',' +
    clientPort +
    ',' +
    socket._remoteAddr +
    ',' +
    socket._remotePort;
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
  var tunnelData = getTunnelData(socket, clientIp, clientPort);
  if (tunnelData) {
    statusLine += '\r\n' + config.TEMP_TUNNEL_DATA_HEADER + ': ' + encodeURIComponent(JSON.stringify(tunnelData));
  }
  return Buffer.concat([Buffer.from(statusLine), chunk]);
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function (socket: any, next: any, isWebPort: any) {
  var reqSocket: any, reqDestroyed: any, resDestroyed: any;
  var headersStr;
  var enable = socket.enable || '';
  var disable = socket.disable || '';
  var destroy = function (err: any) {
    if (reqSocket) {
      if (!resDestroyed) {
        resDestroyed = true;
        reqSocket.destroy(err);
      }
    } else if (!reqDestroyed) {
      reqDestroyed = true;
      socket.destroy(err);
    }
  };

  util.onSocketEnd(socket, destroy);

  function abortIfUnavailable(s: any) {
    return s.on('error', destroy);
  }
  var clientIp = socket.clientIp;
  var clientPort = socket.clientPort;
  util.readOneChunk(
    socket,
    function (chunk: any) {
      headersStr = chunk && chunk.toString();
      var isHttp = chunk && HTTP_RE.test(headersStr);
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      var statusLine = isHttp && RegExp['$&'];
      if (isHttp && CONNECT_RE.test(RegExp.$1)) {
        chunk = addClientInfo(socket, chunk, statusLine, clientIp, clientPort);
        util.connect(
          {
            port: config.port,
            host: LOCALHOST
          },
          function (err: any, s: any) {
            reqSocket = s;
            if (err || socket._hasError) {
              return destroy(err);
            }
            reqSocket.write(chunk);
            reqSocket.pipe(socket).pipe(reqSocket);
            abortIfUnavailable(reqSocket);
            socket.resume();
          }
        );
        return;
      }
      if (!chunk) {
        //没有数据
        return isWebPort ? socket.destroy() : next(chunk);
      }
      if (isHttp) {
        socket.resume();
        server.emit('connection', socket);
        socket.emit(
          'data',
          addClientInfo(socket, chunk, statusLine, clientIp, clientPort)
        );
      } else {
        var isHttpH2 = HTTP2_RE.test(headersStr);
        if (!isHttpH2 && chunk[0] != 22) {
          return next(chunk);
        }
        var receiveData: any, authTimer: any;
        var useSNI: any, domain: any, serverKey: any;
        var checkTimeout = function () {
          authTimer = setTimeout(function () {
            if (reqSocket) {
              receiveData && reqSocket.removeListener('data', receiveData);
              reqSocket.destroy();
            }
            next(chunk);
          }, TIMEOUT);
        };
        var handleConnect = function (port: any) {
          var promise =
            !isHttpH2 && !useSNI && serverAgent.existsServer(serverKey);
          var httpsServer = promise && promise.cert && promise.server;
          if (httpsServer && httpsServer.setSecureContext) {
            var cert = serverAgent.createCertificate(domain);
            if (
              cert.key !== promise.cert.key ||
              cert.cert !== promise.cert.cert
            ) {
              try {
                cert._ctx = cert._ctx || ca.createSecureContext(cert);
                httpsServer.setSecureContext(cert._ctx);
                promise.cert = cert;
              } catch (e) {}
            }
          }
          util.connect(
            {
              port: port,
              host: LOCALHOST,
              localAddress: LOCALHOST
            },
            function (err: any, s: any) {
              reqSocket = s;
              if (err || socket._hasError) {
                return destroy(err);
              }
              tunnelTmplData.set(
                reqSocket.localPort + ':' + reqSocket.remotePort,
                getTunnelData(socket, clientIp, clientPort, isHttpH2)
              );
              receiveData = function (data: any) {
                clearTimeout(authTimer);
                authTimer = null;
                socket.write(data);
                reqSocket.pipe(socket).pipe(reqSocket);
                socket.resume();
              };
              reqSocket.once('data', receiveData);
              reqSocket.write(chunk);
              abortIfUnavailable(reqSocket);
            }
          );
        };
        var useNoSNIServer = function () {
          checkTimeout();
          serverKey = requestCert ? ':' + domain : domain;
          serverAgent.createServer(serverKey, handlers, handleConnect);
        };

        var handleRequest = function () {
          if (useSNI) {
            checkTimeout();
            var disableH2 = !properties.isEnableHttp2();
            if (disable.http2) {
              disableH2 = true;
            } else if (enable.http2) {
              disableH2 = false;
            }
            getSNIServer(h2Handlers, handleConnect, disableH2, requestCert);
          } else if (isHttpH2) {
            checkTimeout();
            getHttp2Server(h2Handlers, handleConnect);
          } else {
            useNoSNIServer();
          }
        };
        if (isHttpH2) {
          return handleRequest();
        }
        useSNI = checkSNI(chunk);
        var servername = useSNI || socket.tunnelHostname;
        if (
          !servername ||
          (useSNI ? disable.captureSNI : disable.captureNoSNI) ||
          (socket.useProxifier && !ca.existsCustomCert(servername))
        ) {
          return next(chunk);
        }
        var requestCert =
          (enable.clientCert || enable.requestCert) &&
          !disable.clientCert &&
          !disable.requestCert;
        domain = getDomain(servername);
        socket.curUrl = socket.fullUrl = 'https://' + servername;
        socket.useSNI = useSNI;
        socket.serverName = socket.servername = servername;
        socket.commonName = domain;
        loadCert(socket, function (cert: any) {
          if (socket._hasError) {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
            return destroy();
          }
          if (cert === false) {
            return next(chunk);
          }
          if (cert) {
            domain = servername;
          }
          handleRequest();
        });
      }
    },
    isWebPort ? 0 : TIMEOUT
  );
};
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports.setup = function (s: any, p: any) {
  server = s;
  // @ts-expect-error ts-migrate(2539) FIXME: Cannot assign to 'proxy' because it is not a varia... Remove this comment to see the full error message
  proxy = p;
};
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports.handleWebsocket = handleWebsocket;
