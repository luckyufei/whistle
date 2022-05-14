// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var PipeStream = require('pipestream');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var util = require('./util');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var socketMgr = require('./socket-mgr');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var config = require('./config');

var HTTPS_RE = /^https:/i;

function addErrorEvents(req: any, res: any) {
  ++util.proc.allHttpRequests;
  ++util.proc.totalAllHttpRequests;
  var finished: any;
  var countdown = function () {
    if (req.isLogRequests) {
      --util.proc.httpRequests;
      req._hasClosed = true;
      req.emit('_closed');
    }
    req.isLogRequests = false;
    if (!finished) {
      finished = true;
      --util.proc.allHttpRequests;
    }
  };
  var clientReq: any;
  var done: any;
  req
    .on('dest', function (_req: any) {
      clientReq = _req;
      if (!req.noReqBody) {
        clientReq.on('error', abort);
      }
    })
    .on('error', abort);
  res
    .on('src', function (_res: any) {
      if (clientReq && req.noReqBody) {
        clientReq.on('error', abort);
      }
      _res.on('error', abort);
    })
    .on('error', abort)
    .once('close', abort)
    .once('finish', countdown);

  function abort(err: any) {
    if (clientReq === false) {
      return;
    }
    countdown();
    req._hasError = true;
    clientReq = req._clientReq || clientReq;
    if (clientReq) {
      if (clientReq.destroy) {
        clientReq.destroy();
      } else if (clientReq.abort) {
        clientReq.abort();
      }
      clientReq = false;
    }
    if (done) {
      return;
    }
    done = true;
    if (req.customParser) {
      socketMgr.removeContext(req);
      socketMgr.removePending(req);
    }

    if (
      req._hasRespond ||
      res._headerSent ||
      !res.writable ||
      (err && err.code === 'ERR_WHISTLE_ABORTED')
    ) {
      if (!finished) {
        res.emit('error', new Error('Aborted'));
      }
      return res.destroy();
    }
    err = util.getErrorStack(err || 'Closed');
    res.response(util.wrapGatewayError(err));
  }
}

function addTransforms(req: any, res: any) {
  var reqIconvPipeStream: any, resIconvPipeStream: any, svrRes: any, initedResTransform: any;

  req.addTextTransform = function (transform: any) {
    if (!reqIconvPipeStream) {
      reqIconvPipeStream = util.getPipeIconvStream(req.headers);
      initReqZipTransform().add(reqIconvPipeStream);
    }
    reqIconvPipeStream.add(transform);
    return req;
  };

  req.addZipTransform = function (transform: any, head: any, tail: any) {
    initReqZipTransform()[head ? 'addHead' : tail ? 'addTail' : 'add'](
      transform
    );
    return req;
  };

  function initReqZipTransform() {
    if (!req._needGunzip) {
      delete req.headers['content-length'];
      req._needGunzip = true;
    }
    return req;
  }

  function initResZipTransform() {
    if (!initedResTransform) {
      initedResTransform = true;
      res._needGunzip = true;
      removeContentLength();
      res.add(function (src: any, next: any) {
        if (resIconvPipeStream) {
          var pipeIconvStream = util.getPipeIconvStream(res.headers);
          pipeIconvStream.add(resIconvPipeStream);
          next(src.pipe(pipeIconvStream));
        } else {
          next(src);
        }
      });
    }
  }

  res.addZipTransform = function (transform: any, head: any, tail: any) {
    initResZipTransform();
    res[head ? 'addHead' : tail ? 'addTail' : 'add'](transform);
    return res;
  };
  res.addTextTransform = function (transform: any, head: any, tail: any) {
    if (!resIconvPipeStream) {
      resIconvPipeStream = new PipeStream();
      initResZipTransform();
    }
    resIconvPipeStream[head ? 'addHead' : tail ? 'addTail' : 'add'](transform);
    return res;
  };

  res.on('src', function (_res: any) {
    svrRes = _res;
    removeContentLength();
  });

  function removeContentLength() {
    if (svrRes && res._needGunzip) {
      delete svrRes.headers['content-length'];
    }
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function (req: any, res: any, next: any) {
  PipeStream.wrapSrc(req);
  PipeStream.wrapDest(res);
  addTransforms(req, res);
  addErrorEvents(req, res);
  req.isPluginReq = util.checkPluginReqOnce(req);
  var headers = req.headers;
  var socket = req.socket || {};
  var clientInfo = util.parseClientInfo(req);
  var clientIp = clientInfo[0] || util.getForwardedFor(headers);
  req._remoteAddr = clientInfo[2] || util.getRemoteAddr(req);
  req._remotePort = clientInfo[3] || util.getRemotePort(req);
  if (clientIp && util.isLocalAddress(clientIp)) {
    delete headers[config.CLIENT_IP_HEAD];
    clientIp = null;
  }
  if (!socket[config.CLIENT_IP_HEAD]) {
    socket[config.CLIENT_IP_HEAD] = clientIp || util.getClientIp(req);
  }
  req.clientIp = clientIp = clientIp || socket[config.CLIENT_IP_HEAD];
  req.method = util.getMethod(req.method);
  req._clientId = util.getComposerClientId(headers);
  var clientPort = clientInfo[1] || headers[config.CLIENT_PORT_HEAD];
  delete headers[config.CLIENT_PORT_HEAD];
  if (!(clientPort > 0)) {
    clientPort = null;
  }
  if (!socket[config.CLIENT_PORT_HEAD]) {
    socket[config.CLIENT_PORT_HEAD] = clientPort || socket.remotePort;
  }
  req.clientPort = clientPort = clientPort || socket[config.CLIENT_PORT_HEAD];
  util.handleForwardedProps(req);
  var isHttps =
    req.socket.isHttps || req.isHttps || headers[config.HTTPS_FIELD];
  if (isHttps) {
    req.isHttps = true;
    delete headers[config.HTTPS_FIELD];
    delete headers[config.HTTPS_PROTO_HEADER];
  }
  if (headers['proxy-connection']) {
    headers.connection = headers['proxy-connection'];
  }
  var sniPlugin = headers[config.SNI_PLUGIN_HEADER];
  if (sniPlugin) {
    req.sniPlugin = sniPlugin;
    delete headers[config.SNI_PLUGIN_HEADER];
  }
  delete headers['proxy-connection'];
  if (!req.isHttps && HTTPS_RE.test(req.url)) {
    req.isHttps = true;
  }
  util.addTunnelData(socket, headers);
  var alpn = headers[config.ALPN_PROTOCOL_HEADER];
  if (alpn) {
    if (alpn === 'httpH2') {
      req.isH2 = !req.isHttps;
    } else if (alpn === 'httpsH2') {
      req.isH2 = req.isHttps;
    } else if (req.isHttps || req.isPluginReq) {
      req.isH2 = true;
    }
    req.rawHeaders = [];
    delete headers[config.ALPN_PROTOCOL_HEADER];
  }
  res.response = function (_res: any) {
    if (req._hasRespond) {
      return;
    }
    req._hasRespond = true;
    if (_res.realUrl) {
      req.realUrl = res.realUrl = _res.realUrl;
    }
    res.headers = req.resHeaders = _res.headers;
    res.statusCode =
      req.statusCode =
      _res.statusCode =
        util.getStatusCode(_res.statusCode);
    util.drain(req, function () {
      if (util.getStatusCode(_res.statusCode)) {
        res.src(_res);
        res.writeHead(_res.statusCode, _res.headers);
      } else {
        util.sendStatusCodeError(res, _res);
      }
    });
  };

  next();
};
