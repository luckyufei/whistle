// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var EventEmitter = require('events').EventEmitter;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var zlib = require('../util/zlib');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var util = require('../util');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var socketMgr = require('../socket-mgr');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var config = require('../config');

var MAX_BODY_SIZE = 360 * 1024;
var MAX_SIZE = (config.strict ? 256 : 768) * 1024;
var MAX_REQ_BODY_SIZE = (config.strict ? 256 : 1536) * 1024;
var MAX_RES_BODY_SIZE = (config.strict ? 256 : 1536) * 1024;
var BIG_DATA_SIZE = 2560 * 1024;
var LOCALHOST = '127.0.0.1';

function getZipType(options: any) {
  return options.headers && options.headers['content-encoding'];
}

function unzipBody(options: any, body: any, callback: any) {
  return zlib.unzip(getZipType(options), body, callback);
}

function getChunkLen(chunk: any) {
  return (chunk && chunk.length) || 0;
}

function checkType(res: any) {
  if (!config.strict) {
    return true;
  }
  var type = res.headers['content-type'];
  if (!type) {
    return true;
  }
  type = util.getContentType(type);
  return type && type !== 'CSS' && type !== 'IMG';
}

function checkBodySize(data: any, useBigData: any) {
  if (
    config.strict &&
    data.body &&
    data.body.length > (useBigData ? BIG_DATA_SIZE : MAX_BODY_SIZE)
  ) {
    data.body = '';
  }
}

function isUnzipJs(r: any) {
  r = r.headers;
  return !r['content-encoding'] && util.getContentType(r) === 'JS';
}

function getEventName(proxy: any) {
  if (util.listenerCount(proxy, '_request')) {
    return '_request';
  } else if (util.listenerCount(proxy, 'httpRequest')) {
    return 'httpRequest';
  }
}

function emitDataEvents(req: any, res: any, proxy: any) {
  var now = Date.now();
  var eventName = getEventName(proxy);
  eventName && proxy.emit(eventName, req.fullUrl);
  if (
    !util.showPluginReq(req) ||
    !config.captureData ||
    (req._filters.hide && !req.disable.hide)
  ) {
    return;
  }
  var _res = {};
  var reqEmitter = new EventEmitter();
  var reqData = {
    method: util.toUpperCase(req.method) || 'GET',
    httpVersion: req.httpVersion || '1.1',
    ip: req.clientIp,
    port: req.clientPort,
    isWhistleHttps: req.isWhistleHttps,
    rawHeaderNames: req.rawHeaderNames,
    headers: req.headers
  };
  var resData = {};
  var reqBody = false;
  var resBody = false;
  var cleared: any;
  var data = {
    useH2: req.isH2,
    isPR: req.isPluginReq ? 1 : undefined,
    _clientId: req._clientId,
    startTime: now,
    id: req.reqId,
    sniPlugin: req.sniPlugin,
    url: req.fullUrl,
    req: reqData,
    res: resData,
    rules: req.rules,
    fwdHost: req._fwdHost,
    pipe: req._pipeRule,
    rulesHeaders: req.rulesHeaders,
    abort: function (clear: any) {
      if (clear === true) {
        // @ts-expect-error ts-migrate(2322) FIXME: Type 'boolean' is not assignable to type '{ useH2:... Remove this comment to see the full error message
        data = reqData = resData = reqBody = resBody = false;
        cleared = true;
      } else {
        var err = new Error('Aborted');
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'code' does not exist on type 'Error'.
        err.code = 'ERR_WHISTLE_ABORTED';
        req.emit('error', err);
      }
    }
  };
  proxy.emit('request', reqEmitter, data);

  var requestTime: any;
  var endTime: any;
  var isStream: any;
  var updateEvent: any;
  var useReqStream: any;
  var useFrames: any;
  var enable = req.enable;
  var disable = req.disable;
  var useBigData =
    (enable.bigData || enable.largeData) &&
    !disable.bigData &&
    !disable.largeData;
  var setEndTime = function () {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'requestTime' does not exist on type '{ u... Remove this comment to see the full error message
    if (data.requestTime || !requestTime) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'endTime' does not exist on type '{ useH2... Remove this comment to see the full error message
      data.endTime = endTime || Date.now();
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'requestTime' does not exist on type '{ u... Remove this comment to see the full error message
      data.requestTime = data.requestTime || data.endTime;
    } else {
      endTime = endTime || Date.now();
    }
  };
  var updateVersion = function () {
    if (req.useH2 != null) {
      data.useH2 = req.useH2;
    }
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'httpsTime' does not exist on type '{ use... Remove this comment to see the full error message
    data.httpsTime = req.httpsTime;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'useHttp' does not exist on type '{ useH2... Remove this comment to see the full error message
    data.useHttp = req.useHttp;
    if (data.useH2 && !req.useHttp) {
      reqData.httpVersion = '2.0';
    } else {
      reqData.httpVersion = '1.1';
    }
  };
  var setUnzipSize = function (body: any, obj: any) {
    var len = body ? body.length : -1;
    if (len >= 0 && len !== obj.size) {
      obj.unzipSize = len;
    }
  };
  req.setServerPort = function (serverPort: any) {
    req.serverPort = serverPort;
    setReqStatus(LOCALHOST);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'port' does not exist on type '{}'.
    resData.port = serverPort;
  };
  req.setClientId = function (clientId: any) {
    // @ts-expect-error ts-migrate(2551) FIXME: Property 'clientId' does not exist on type '{ useH... Remove this comment to see the full error message
    data.clientId = clientId;
  };
  res.setCurTrailers = function (trailers: any, rawTrailerNames: any) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'trailers' does not exist on type '{}'.
    resData.trailers = trailers;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'rawTrailerNames' does not exist on type ... Remove this comment to see the full error message
    resData.rawTrailerNames = rawTrailerNames;
  };
  var reqDone: any, resDone: any;

  var handleReqBody = function (stream: any, info: any) {
    if (reqDone) {
      return;
    }
    reqDone = true;
    info =
      info || (req._needGunzip ? { method: req.method, headers: '' } : req);
    if (!cleared && util.hasRequestBody(info)) {
      // @ts-expect-error ts-migrate(2322) FIXME: Type 'null' is not assignable to type 'boolean'.
      reqBody = null;
    }
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'size' does not exist on type '{ method: ... Remove this comment to see the full error message
    reqData.size = 0;
    var write = stream.write;
    var end = stream.end;
    var MAX_REQ_BODY = useBigData
      ? BIG_DATA_SIZE
      : info.headers && info.headers['content-encoding']
      ? MAX_SIZE
      : MAX_REQ_BODY_SIZE;
    stream.write = function (chunk: any) {
      if (chunk) {
        if (reqBody || reqBody === null) {
          if (useFrames) {
            // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'boolean'.
            reqBody = '';
          } else {
            reqBody = reqBody ? Buffer.concat([reqBody, chunk]) : chunk;
            if (useReqStream) {
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'body' does not exist on type '{ method: ... Remove this comment to see the full error message
              reqData.body = reqBody;
            }
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'length' does not exist on type 'boolean'... Remove this comment to see the full error message
            if (reqBody.length > MAX_REQ_BODY) {
              reqBody = false;
            }
          }
        }
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'size' does not exist on type '{ method: ... Remove this comment to see the full error message
        reqData.size += chunk.length;
      }
      updateEvent && proxy.emit(updateEvent, req.fullUrl, false);
      return write.apply(this, arguments);
    };
    stream.end = function (chunk: any) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'size' does not exist on type '{ method: ... Remove this comment to see the full error message
      reqData.size += getChunkLen(chunk);
      requestTime = Date.now();
      if (useFrames) {
        // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'boolean'.
        reqBody = '';
      }
      unzipBody(info, reqBody, function (err: any, body: any) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'requestTime' does not exist on type '{ u... Remove this comment to see the full error message
        data.requestTime = requestTime;
        if (endTime) {
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'endTime' does not exist on type '{ useH2... Remove this comment to see the full error message
          data.endTime = endTime;
        }
        reqBody = err ? util.getErrorStack(err) : body;
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'body' does not exist on type '{ method: ... Remove this comment to see the full error message
        reqData.body = reqBody;
        setUnzipSize(body, reqData);
        checkBodySize(reqData, useBigData);
      });
      updateEvent && proxy.emit(updateEvent, req.fullUrl, false, true);
      return end.apply(this, arguments);
    };
  };
  var handleResBody = function (stream: any, info: any) {
    if (resDone) {
      return;
    }
    resDone = true;
    info =
      info ||
      (res._needGunzip ? { statusCode: res.statusCode, headers: '' } : res);
    var useStream = isStream && !getZipType(info);
    var MAX_RES_BODY = useBigData
      ? BIG_DATA_SIZE
      : isUnzipJs(info)
      ? MAX_RES_BODY_SIZE
      : MAX_SIZE;
    if (!cleared && util.hasBody(info, req) && checkType(info)) {
      if (info.headers['content-length'] > MAX_RES_BODY) {
        resBody = false;
      } else {
        // @ts-expect-error ts-migrate(2322) FIXME: Type 'null' is not assignable to type 'boolean'.
        resBody = null;
      }
    }
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'size' does not exist on type '{}'.
    resData.size = 0;
    var write = stream.write;
    var end = stream.end;
    stream.write = function (chunk: any) {
      if (chunk) {
        if (resBody || resBody === null) {
          if (useFrames) {
            // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'boolean'.
            resBody = '';
          } else {
            resBody = resBody ? Buffer.concat([resBody, chunk]) : chunk;
            if (useStream) {
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'body' does not exist on type '{}'.
              resData.body = resBody;
            }
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'length' does not exist on type 'boolean'... Remove this comment to see the full error message
            if (resBody.length > MAX_RES_BODY) {
              resBody = false;
            }
          }
        }
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'size' does not exist on type '{}'.
        resData.size += chunk.length;
      }
      updateEvent && proxy.emit(updateEvent, req.fullUrl, true);
      return write.apply(this, arguments);
    };
    stream.end = function (chunk: any) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'size' does not exist on type '{}'.
      resData.size += getChunkLen(chunk);
      endTime = Date.now();
      // @ts-expect-error ts-migrate(2790) FIXME: The operand of a 'delete' operator must be optiona... Remove this comment to see the full error message
      delete data.abort;
      if (useFrames) {
        // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'boolean'.
        resBody = '';
      }
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'hasGzipError' does not exist on type '{}... Remove this comment to see the full error message
      resData.hasGzipError = unzipBody(info, resBody, function (err: any, body: any) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'resError' does not exist on type '{ useH... Remove this comment to see the full error message
        if (!data.resError) {
          resBody = err ? util.getErrorStack(err) : body;
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'body' does not exist on type '{}'.
          resData.body = resBody;
        }
        setUnzipSize(body, resData);
        checkBodySize(resData, useBigData);
        setEndTime();
        reqEmitter.emit('end', data);
      });
      updateEvent && proxy.emit(updateEvent, req.fullUrl, true, true);
      return end.apply(this, arguments);
    };
  };

  var hasReqPipe = req._pipePluginPorts.reqWritePort;
  var hasResPipe = req._pipePluginPorts.resWritePort;

  if (hasReqPipe) {
    req.on('bodyStreamReady', handleReqBody);
  }

  if (hasResPipe) {
    res.on('bodyStreamReady', handleResBody);
  }

  req.once('dest', function (_req: any) {
    _req.once('finish', function () {
      if (!requestTime) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'requestTime' does not exist on type '{ u... Remove this comment to see the full error message
        data.requestTime = Date.now();
      }
    });
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
    setReqStatus();
    reqEmitter.emit('send', data);
    !hasReqPipe && handleReqBody(_req, req);
  });
  res.once('src', function (r: any) {
    _res = r;
    data.pipe = req._pipeRule;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'rawHeaderNames' does not exist on type '... Remove this comment to see the full error message
    resData.rawHeaderNames = res.rawHeaderNames;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'endTime' does not exist on type '{ useH2... Remove this comment to see the full error message
    if (!data.endTime) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
      setResStatus();
      reqEmitter.emit('response', data);
    }
    !hasResPipe && handleResBody(res, _res);
  });
  req.once('error', handleError);
  res.once('error', handleError);
  res.once('close', handleError);

  function handleError(err: any) {
    req._hasError = true;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'endTime' does not exist on type '{ useH2... Remove this comment to see the full error message
    if (endTime || data.endTime || (data.responseTime && !err)) {
      return;
    }
    !endTime && setEndTime();
    // @ts-expect-error ts-migrate(2790) FIXME: The operand of a 'delete' operator must be optiona... Remove this comment to see the full error message
    delete data.abort;
    if (err && err.message !== 'Aborted') {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'resError' does not exist on type '{ useH... Remove this comment to see the full error message
      data.resError = true;
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'body' does not exist on type '{}'.
      resData.body = util.getErrorStack(err);
      util.emitError(reqEmitter, data);
      setResStatus(502);
    } else {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'reqError' does not exist on type '{ useH... Remove this comment to see the full error message
      data.reqError = true;
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'body' does not exist on type '{ method: ... Remove this comment to see the full error message
      if (!reqData.body) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'body' does not exist on type '{ method: ... Remove this comment to see the full error message
        reqData.body = 'aborted';
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'body' does not exist on type '{}'.
      } else if (!resData.body) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'body' does not exist on type '{}'.
        resData.body = 'aborted';
      }
      reqEmitter.emit('abort', data);
      setResStatus('aborted');
    }
  }

  function setReqStatus(defaultHost: any) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'dnsTime' does not exist on type '{ useH2... Remove this comment to see the full error message
    data.dnsTime = (req.dnsTime || 0) + now;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'realUrl' does not exist on type '{ useH2... Remove this comment to see the full error message
    data.realUrl = data.url === req.realUrl ? undefined : req.realUrl;
    updateVersion();
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'ip' does not exist on type '{}'.
    resData.ip = req.hostIp || defaultHost;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'phost' does not exist on type '{}'.
    resData.phost = req._phost && req._phost.host;
  }

  req.initCustomParser = function () {
    if (req.customParser) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'useFrames' does not exist on type '{ use... Remove this comment to see the full error message
      data.useFrames = false;
      socketMgr.setPending(req);
      req.disableCustomParser = function () {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'useFrames' does not exist on type '{ use... Remove this comment to see the full error message
        data.useFrames = null;
        req.customParser = null;
        req.enableCustomParser = null;
        req.disableCustomParser = null;
        socketMgr.removePending(req);
        delete req.headers['x-whistle-frame-parser'];
      };
      req.enableCustomParser = function (svrRes: any) {
        useFrames = true;
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'body' does not exist on type '{ method: ... Remove this comment to see the full error message
        reqData.body = '';
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'body' does not exist on type '{}'.
        resData.body = '';
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'base64' does not exist on type '{ method... Remove this comment to see the full error message
        reqData.base64 = '';
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'base64' does not exist on type '{}'.
        resData.base64 = '';
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'useFrames' does not exist on type '{ use... Remove this comment to see the full error message
        data.useFrames = true;
        socketMgr.setContext(
          req,
          svrRes,
          eventName,
          { data: [] },
          { data: [] }
        );
        socketMgr.removePending(req);
        delete req.headers['x-whistle-frame-parser'];
      };
    }
  };

  function setResStatus(defaultCode: any) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'responseTime' does not exist on type '{ ... Remove this comment to see the full error message
    if (data.responseTime) {
      return;
    }
    setReqStatus(LOCALHOST);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'statusCode' does not exist on type '{}'.
    resData.statusCode = _res.statusCode || defaultCode || 502;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'statusMessage' does not exist on type '{... Remove this comment to see the full error message
    resData.statusMessage = _res.statusMessage;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'responseTime' does not exist on type '{ ... Remove this comment to see the full error message
    data.responseTime = Date.now();
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'requestTime' does not exist on type '{ u... Remove this comment to see the full error message
    if (!requestTime && !data.requestTime) {
      isStream = true;
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'isStream' does not exist on type '{ useH... Remove this comment to see the full error message
      data.isStream = true;
      updateEvent = eventName;
      useReqStream = !getZipType(req);
    }
    if (useReqStream && reqBody) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'body' does not exist on type '{ method: ... Remove this comment to see the full error message
      reqData.body = reqBody;
    }
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'headers' does not exist on type '{}'.
    resData.headers = _res.headers;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function (req: any, res: any, next: any) {
  emitDataEvents(req, res, this);
  util.delay(util.getMatcherValue(req.rules.reqDelay), function () {
    if (!req.disable.abort && (req._filters.abort || req.enable.abort)) {
      return res.destroy();
    }
    next();
  });
};
