// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var PassThrough = require('stream').PassThrough;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var pluginMgr = require('./plugins');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var wsParser = require('ws-parser');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var util = require('./util');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var config = require('./config');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var Buffer = require('safe-buffer').Buffer;

var pendingReqList: any = [];
var INTERVAL = 22 * 1000;
// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'proxy'.
var proxy;
var index = 0;
var MAX_PAYLOAD = 1024 * 1024;
var conns = {};
var PING = Buffer.from('iQA=', 'base64');
var PONG = Buffer.from('ioAn6ubf', 'base64');
var PAUSE_STATUS = 1;
var IGNORE_STATUS = 2;
var MAX_COMPOSE_FRAME_COUNT = 5;

// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'getFrameId'.
function getFrameId() {
  ++index;
  if (index > 999) {
    index = 0;
  }
  if (index > 99) {
    return Date.now() + '-' + index;
  }
  if (index > 9) {
    return Date.now() + '-0' + index;
  }
  return Date.now() + '-00' + index;
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports = module.exports = function (p: any) {
  // @ts-expect-error ts-migrate(2539) FIXME: Cannot assign to 'proxy' because it is not a varia... Remove this comment to see the full error message
  proxy = p;
};

function handleSocketEnd(req: any, res: any, callback: any) {
  util.onSocketEnd(req, callback);
  util.onSocketEnd(res, callback);
}

function handleClose(req: any, res: any, justTunnel: any) {
  handleSocketEnd(req, res, function (err: any) {
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    var ctx = conns[req.reqId];
    ctx && ctx.clearup();
    var closed = req._hasClosed;
    req._hasClosed = true;
    // 确保两个连接都关掉才行
    if (closed) {
      req.emit('_closed');
    }
    if (req.customParser) {
      !closed && removePending(req.reqId);
      return;
    }
    if (closed && !justTunnel) {
      req._emittedClosed = true;
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'emit' does not exist on type '(callback:... Remove this comment to see the full error message
      proxy.emit('frame', {
        reqId: req.reqId,
        frameId: getFrameId(),
        closed: true,
        code: req._errorCode || res._errorCode,
        err: err && err.message
      });
    }
  });
}

function getStatus(ctx: any, status: any, name: any) {
  status = parseInt(status, 10);
  name = name || 'receiveStatus';
  var oldStatus = ctx[name] || 0;
  status = ctx[name] = status > 0 || status < 3 ? status : 0;
  return status !== oldStatus ? status : -1;
}

function setConnStatus(ctx: any, status: any, statusObj: any, name: any) {
  statusObj.pause = statusObj.ignore = undefined;
  status = getStatus(ctx, status, name);
  if (status === 1) {
    statusObj.pause = true;
    return;
  }
  if (status === 2) {
    statusObj.ignore = true;
    statusObj.chunk = null;
    statusObj.ignoring = !!statusObj.callback;
  }
  statusObj.emitData && statusObj.emitData();
  if (statusObj.callback) {
    statusObj.addToReceiver && statusObj.addToReceiver();
    statusObj.callback(null, statusObj.chunk);
    statusObj.addToReceiver = null;
    statusObj.callback = null;
    statusObj.chunk = null;
  }
}

function initStatus(ctx: any, enable: any) {
  if (enable.pauseSend) {
    ctx.setSendStatus(PAUSE_STATUS);
  } else if (enable.ignoreSend) {
    ctx.setSendStatus(IGNORE_STATUS);
  }
  if (enable.pauseReceive) {
    ctx.setReceiveStatus(PAUSE_STATUS);
  } else if (enable.ignoreReceive) {
    ctx.setReceiveStatus(IGNORE_STATUS);
  }
}

function removePending(reqId: any) {
  var index = pendingReqList.indexOf(reqId);
  if (index !== -1) {
    pendingReqList.splice(index, 1);
  }
}

function pipeStream(src: any, target: any, useSrc: any) {
  if (!src || !target) {
    return src || target;
  }
  src.pipe(target);
  return useSrc ? src : target;
}

function isHide(req: any) {
  return !config.captureData || (req._filters.hide && !req.disable.hide);
}

function emitDataToProxy(req: any, chunk: any, fromClient: any, ignore: any) {
  if (isHide(req) || req._emittedClosed) {
    return;
  }
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'emit' does not exist on type '(callback:... Remove this comment to see the full error message
  proxy.emit('frame', {
    reqId: req.reqId,
    frameId: getFrameId(),
    isClient: fromClient,
    length: chunk.length,
    ignore: ignore,
    bin: chunk
  });
}

function handleConnSend(ctx: any, reqTrans: any, sendStatus: any) {
  var req = ctx.req;
  var res = ctx.res;
  var hasEvent = ctx.hasEvent;
  var writer = res.pipeWriter || res;
  var url = ctx.url;
  ctx.sendToServer = function (data: any) {
    data = data.data;
    writer.write(data);
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
    emitDataToProxy(req, data, true);
  };
  sendStatus.emitData = function () {
    if (sendStatus.chunk) {
      emitDataToProxy(req, sendStatus.chunk, true, sendStatus.ignore);
      sendStatus.chunk = null;
    }
  };
  reqTrans._transform = function (chunk: any, _: any, cb: any) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'emit' does not exist on type '(callback:... Remove this comment to see the full error message
    hasEvent && proxy.emit('tunnelRequest', url);
    if (sendStatus.pause) {
      sendStatus.chunk = chunk;
      sendStatus.callback = cb;
      return;
    }
    emitDataToProxy(req, chunk, true, sendStatus.ignore);
    if (sendStatus.ignore) {
      chunk = null;
    }
    cb(null, chunk);
  };
}

function handleConnReceive(ctx: any, resTrans: any, receiveStatus: any) {
  var req = ctx.req;
  var hasEvent = ctx.hasEvent;
  var url = ctx.url;
  var writer = req.pipeWriter || req;
  ctx.sendToClient = function (data: any) {
    data = data.data;
    writer.write(data);
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 2.
    emitDataToProxy(req, data);
  };
  receiveStatus.emitData = function () {
    if (receiveStatus.chunk) {
      emitDataToProxy(
        req,
        receiveStatus.chunk,
        undefined,
        receiveStatus.ignore
      );
      receiveStatus.chunk = null;
    }
  };

  resTrans._transform = function (chunk: any, _: any, cb: any) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'emit' does not exist on type '(callback:... Remove this comment to see the full error message
    hasEvent && proxy.emit('tunnelRequest', url);
    if (receiveStatus.pause) {
      receiveStatus.chunk = chunk;
      receiveStatus.callback = cb;
      return;
    }
    emitDataToProxy(req, chunk, undefined, receiveStatus.ignore);
    if (receiveStatus.ignore) {
      chunk = null;
    }
    cb(null, chunk);
  };
}

function clearupStatus(conns: any, reqId: any, sendStatus: any, receiveStatus: any) {
  delete conns[reqId];
  sendStatus.callback = null;
  receiveStatus.callback = null;
  sendStatus.addToReceiver = null;
  receiveStatus.addToReceiver = null;
  clearInterval(sendStatus.timer);
  clearInterval(receiveStatus.timer);
}

function getBinary(data: any, len: any) {
  return len > MAX_PAYLOAD ? data.slice(0, MAX_PAYLOAD) : data;
}

function drainData(status: any, socket: any, receiver: any, toServer: any) {
  if (!status.sender) {
    try {
      status.sender = wsParser.getSender(socket.pipeWriter || socket, toServer);
    } catch (e) {}
  }
  status.sender &&
    status.data.forEach(function (item: any) {
      status.sender.send(item.data, item);
      receiver.onData(item.data, item);
    });
  status.data = [];
  receiver.ping();
}

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
function handleFrame(receiver: any, socket: any, status: any, chunk: any, cb: any, toServer: any) {
  if (!receiver.existsCacheData) {
    status.ignoring = status.ignore;
    if (status.pause) {
      status.callback = cb;
      status.chunk = chunk;
      status.addToReceiver = function () {
        receiver.add(chunk);
      };
      drainData(status, socket, receiver, toServer);
      return;
    }
    if (status.ignore) {
      drainData(status, socket, receiver, toServer);
    }
  }
  var toRead = receiver.add(chunk);
  if (status.ignoring) {
    if (!status.ignore && toRead >= 0) {
      status.ignoring = false;
      socket.write(chunk.slice(toRead));
    }
    chunk = null;
  } else if (
    toRead >= 0 &&
    (status.pause || status.ignore || status.data.length)
  ) {
    if (toRead) {
      var readAll = toRead === chunk.length;
      status.chunk = readAll ? null : chunk.slice(toRead);
      socket.write(readAll ? chunk : chunk.slice(0, toRead));
    } else {
      status.chunk = chunk;
    }
    if (status.pause) {
      status.callback = cb;
      drainData(status, socket, receiver, toServer);
      return;
    }
    if (status.ignore) {
      status.ignoring = true;
      chunk = null;
      drainData(status, socket, receiver, toServer);
    }
  }
  if (chunk && status.timer) {
    clearInterval(status.timer);
    status.timer = null;
  }
  cb(null, chunk);
}

function clearTimer(status: any) {
  if (!status.ignore && !status.pause) {
    clearInterval(status.timer);
    status.timer = null;
  }
}

function handleWsSend(ctx: any, reqTrans: any, sendStatus: any, isTunnel: any) {
  var req = ctx.req;
  var res = ctx.res;
  var url = ctx.url;
  var hideWs = isHide(req);
  var reqReceiver: any;
  if (!hideWs) {
    try {
      reqReceiver = wsParser.getReceiver(res);
    } catch (e) {
      hideWs = true;
    }
  }
  var eventName = isTunnel ? 'tunnelRequest' : 'wsRequest';
  var hasEvent = ctx.hasEvent;
  if (hideWs) {
    if (hasEvent) {
      reqTrans._transform = function (chunk: any, _: any, cb: any) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'emit' does not exist on type '(callback:... Remove this comment to see the full error message
        proxy.emit(eventName, url);
        cb(null, chunk);
      };
    }
    return;
  }
  var reqId = req.reqId;
  util.onSocketEnd(res, function(err: any) {
    reqReceiver.flush(function() {
      reqReceiver.cleanup();
    });
  });
  ctx.sendToServer = function (data: any) {
    if (sendStatus.data.length > MAX_COMPOSE_FRAME_COUNT) {
      return false;
    }
    sendStatus.data.push(data);
    if (
      sendStatus.ignoring ||
      sendStatus.callback ||
      !reqReceiver.existsCacheData
    ) {
      drainData(sendStatus, res, reqReceiver, true);
    }
  };
  reqReceiver.ping = function () {
    if (isTunnel || sendStatus.timer || req.disable.pong) {
      return;
    }
    res.write(PONG);
    sendStatus.timer = setInterval(function () {
      res.write(PONG);
      clearTimer(sendStatus);
    }, INTERVAL);
  };
  reqReceiver.onclose = function (code: any) {
    ctx.req._errorCode = code;
  };
  reqReceiver.onData = function (data: any, opts: any) {
    var opcode = opts.opcode;
    if (!opcode) {
      opcode = opts.binary ? 2 : 1;
    }
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'emit' does not exist on type '(callback:... Remove this comment to see the full error message
    proxy.emit('frame', {
      reqId: reqId,
      frameId: getFrameId(),
      isClient: true,
      mask: isTunnel ? undefined : opts.mask,
      ignore: opts.data ? undefined : sendStatus.ignoring,
      bin: getBinary(data, opts.length),
      compressed: isTunnel ? undefined : opts.compressed,
      length: opts.length,
      opcode: isTunnel ? undefined : opcode
    });
  };
  reqReceiver.onerror = function (err: any) {
    if (req._emittedClosed) {
      return;
    }
    req._emittedClosed = true;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'emit' does not exist on type '(callback:... Remove this comment to see the full error message
    proxy.emit('frame', {
      reqId: reqId,
      frameId: getFrameId(),
      isClient: true,
      err: err.message,
      bin: ''
    });
  };
  reqTrans._transform = function (chunk: any, _: any, cb: any) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'emit' does not exist on type '(callback:... Remove this comment to see the full error message
    hasEvent && proxy.emit(eventName, url);
    handleFrame(reqReceiver, res, sendStatus, chunk, cb, true);
  };
}

function handleWsReceive(ctx: any, resTrans: any, receiveStatus: any, isTunnel: any) {
  var req = ctx.req;
  var res = ctx.res;
  var url = ctx.url;
  var hideWs = isHide(req);
  var resReceiver: any;
  if (!hideWs) {
    try {
      resReceiver = wsParser.getReceiver(res, true);
    } catch (e) {
      hideWs = true;
    }
  }
  var eventName = isTunnel ? 'tunnelRequest' : 'wsRequest';
  var hasEvent = ctx.hasEvent;
  if (hideWs) {
    if (hasEvent) {
      resTrans._transform = function (chunk: any, _: any, cb: any) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'emit' does not exist on type '(callback:... Remove this comment to see the full error message
        proxy.emit(eventName, url);
        cb(null, chunk);
      };
    }
    return;
  }
  var reqId = req.reqId;
  util.onSocketEnd(req, function(err: any) {
    resReceiver.flush(function() {
      resReceiver.cleanup();
    });
  });
  ctx.sendToClient = function (data: any) {
    if (receiveStatus.data.length > MAX_COMPOSE_FRAME_COUNT) {
      return false;
    }
    receiveStatus.data.push(data);
    if (
      receiveStatus.ignoring ||
      receiveStatus.callback ||
      !resReceiver.existsCacheData
    ) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
      drainData(receiveStatus, req, resReceiver);
    }
  };
  resReceiver.ping = function () {
    if (isTunnel || receiveStatus.timer || req.disable.ping) {
      return;
    }
    req.write(PING);
    receiveStatus.timer = setInterval(function () {
      req.write(PING);
      clearTimer(receiveStatus);
    }, INTERVAL);
  };
  resReceiver.onclose = function (code: any) {
    ctx.res._errorCode = code;
  };
  resReceiver.onData = function (data: any, opts: any) {
    var opcode = opts.opcode;
    if (!opcode) {
      opcode = opts.binary ? 2 : 1;
    }
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'emit' does not exist on type '(callback:... Remove this comment to see the full error message
    proxy.emit('frame', {
      reqId: reqId,
      frameId: getFrameId(),
      bin: getBinary(data, opts.length),
      mask: isTunnel ? undefined : opts.mask,
      ignore: opts.data ? undefined : receiveStatus.ignoring,
      compressed: isTunnel ? undefined : opts.compressed,
      length: opts.length,
      opcode: isTunnel ? undefined : opcode
    });
  };
  resReceiver.onerror = function (err: any) {
    if (req._emittedClosed) {
      return;
    }
    req._emittedClosed = true;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'emit' does not exist on type '(callback:... Remove this comment to see the full error message
    proxy.emit('frame', {
      reqId: reqId,
      frameId: getFrameId(),
      err: err.message,
      bin: ''
    });
  };
  resTrans._transform = function (chunk: any, _: any, cb: any) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'emit' does not exist on type '(callback:... Remove this comment to see the full error message
    hasEvent && proxy.emit(eventName, url);
    // @ts-expect-error ts-migrate(2575) FIXME: No overload expects 5 arguments, but overloads do ... Remove this comment to see the full error message
    handleFrame(resReceiver, req, receiveStatus, chunk, cb);
  };
}

function getContext(req: any, res: any, hasEvent: any, sendStatus: any, receiveStatus: any) {
  var reqId = req.reqId;
  // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  var ctx = (conns[reqId] = {
    customParser: req.customParser,
    req: req,
    res: res,
    hasEvent: hasEvent,
    url: req.fullUrl,
    charset: util.getCharset(res.headers['content-type']) || '',
    clearup: function () {
      clearupStatus(conns, reqId, sendStatus, receiveStatus);
    },
    setSendStatus: function (status: any) {
      setConnStatus(ctx, status, sendStatus, 'sendStatus');
    },
    setReceiveStatus: function (status: any) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
      setConnStatus(ctx, status, receiveStatus);
    }
  });
  initStatus(ctx, req.enable);
  return ctx;
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.setContext = getContext;

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.removeContext = function (req: any) {
  // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  delete conns[req.reqId];
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.handleUpgrade = function (req: any, res: any) {
  if (req.isPluginReq) {
    handleClose(req, res, true);
    return req.pipe(res).pipe(req);
  }
  var url = req.fullUrl;
  var customParser = req.customParser;
  var reqId = req.reqId;
  var sendStatus = { data: [] };
  var receiveStatus = { data: [] };
  var emitError = function (err: any) {
    req.emit('error', err);
  };
  var reqTrans = new PassThrough();
  var resTrans = new PassThrough();

  reqTrans.on('error', emitError);
  resTrans.on('error', emitError);
  res.headers = res.headers || {};
  req.wsExts = res.headers['sec-websocket-extensions'] || '';
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
  handleClose(req, res);
  pluginMgr.getWsPipe(
    req,
    res,
    function (reqRead: any, reqWrite: any, resRead: any, resWrite: any) {
      customParser && removePending(reqId);
      if (req._hasClosed) {
        return;
      }
      var hasEvent = util.listenerCount(proxy, 'wsRequest');
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      var ctx = (conns[reqId] = getContext(
        req,
        res,
        hasEvent,
        sendStatus,
        receiveStatus
      ));
      if (customParser) {
        var handleInspect = function (chunk: any, _: any, cb: any) {
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'emit' does not exist on type '(callback:... Remove this comment to see the full error message
          hasEvent && proxy.emit('wsRequest', url);
          cb(null, chunk);
        };
        reqTrans._transform = handleInspect;
        resTrans._transform = handleInspect;
      } else {
        if (reqWrite) {
          reqWrite.headers = res.headers;
          res.pipeWriter = reqWrite;
        }
        if (resWrite) {
          resWrite.headers = res.headers;
          req.pipeWriter = resWrite;
        }
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
        handleWsSend(ctx, reqTrans, sendStatus);
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
        handleWsReceive(ctx, resTrans, receiveStatus);
      }
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
      pipeStream(req, reqRead)
        .pipe(reqTrans)
        .pipe(pipeStream(reqWrite, res, true));
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
      pipeStream(res, resRead)
        .pipe(resTrans)
        .pipe(pipeStream(resWrite, req, true));
    }
  );
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.handleConnect = function (req: any, res: any) {
  var hasEvent = util.listenerCount(proxy, 'tunnelRequest');
  var isConn = req.inspectFrames;
  if (req.isPluginReq || (!isConn && !hasEvent)) {
    handleClose(req, res, true);
    return req.pipe(res).pipe(req);
  }
  var url = req.fullUrl;
  var reqId = req.reqId;
  var customParser = req.customParser;
  var sendStatus = { data: [] };
  var receiveStatus = { data: [] };
  var ctx = '';
  var reqTrans = new PassThrough();
  var resTrans = new PassThrough();
  var emitError = function (err: any) {
    req.emit('error', err);
  };
  reqTrans.on('error', emitError);
  resTrans.on('error', emitError);
  res.headers = res.headers || req.headers;
  handleClose(req, res, !isConn);
  pluginMgr.getTunnelPipe(
    req,
    res,
    function (reqRead: any, reqWrite: any, resRead: any, resWrite: any) {
      customParser && removePending(reqId);
      if (req._hasClosed) {
        return;
      }
      var hide = isHide(req);
      if (isConn && !hide) {
        // @ts-expect-error ts-migrate(2322) FIXME: Type '{ customParser: any; req: any; res: any; has... Remove this comment to see the full error message
        ctx = getContext(req, res, hasEvent, sendStatus, receiveStatus);
      }

      if (customParser || hide || !isConn) {
        var handleInspect = function (chunk: any, _: any, cb: any) {
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'emit' does not exist on type '(callback:... Remove this comment to see the full error message
          hasEvent && proxy.emit('tunnelRequest', url);
          cb(null, chunk);
        };
        reqTrans._transform = handleInspect;
        resTrans._transform = handleInspect;
      } else {
        req.wsExts = res.wsExts = '';
        if (reqWrite) {
          reqWrite.wsExts = '';
          res.pipeWriter = reqWrite;
        }
        if (resWrite) {
          resWrite.wsExts = '';
          req.pipeWriter = resWrite;
        }
        if (reqRead && reqWrite) {
          handleWsSend(ctx, reqTrans, sendStatus, true);
        } else {
          handleConnSend(ctx, reqTrans, sendStatus);
        }
        if (resRead && resWrite) {
          handleWsReceive(ctx, resTrans, receiveStatus, true);
        } else {
          handleConnReceive(ctx, resTrans, receiveStatus);
        }
      }

      // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
      pipeStream(req, reqRead)
        .pipe(reqTrans)
        .pipe(pipeStream(reqWrite, res, true));
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
      pipeStream(res, resRead)
        .pipe(resTrans)
        .pipe(pipeStream(resWrite, req, true));
    }
  );
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.abort = function (reqId: any) {
  // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  var ctx = conns[reqId];
  if (!ctx) {
    return;
  }
  // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  delete conns[reqId];
  ctx.req.destroy();
  ctx.res.destroy();
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getStatus = function (reqId: any) {
  // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  var ctx = reqId && conns[reqId];
  if (!ctx) {
    return;
  }
  return {
    sendStatus: ctx.sendStatus,
    receiveStatus: ctx.receiveStatus
  };
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.removePending = function (req: any) {
  removePending(req.reqId);
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.setPending = function (req: any) {
  var reqId = req.customParser && req.reqId;
  if (reqId && pendingReqList.indexOf(reqId) === -1) {
    pendingReqList.push(reqId);
    if (pendingReqList.length > 2000) {
      pendingReqList = pendingReqList.slice(-1600);
    }
  }
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.exists = function (reqId: any) {
  // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  return reqId && conns[reqId];
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getData = function (reqId: any) {
  // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  var ctx = reqId && conns[reqId];
  if (ctx) {
    var result = {
      sendStatus: ctx.sendStatus,
      receiveStatus: ctx.receiveStatus,
      toServer: ctx.toServerData,
      toClient: ctx.toClientData
    };
    delete ctx.toServerData;
    delete ctx.toClientData;
    return result;
  }
  return pendingReqList.indexOf(reqId) === -1 ? undefined : 1;
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.changeStatus = function (data: any) {
  // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  var ctx = conns[data.reqId];
  if (!ctx) {
    return;
  }
  if (data.sendStatus >= 0) {
    ctx.setSendStatus(data.sendStatus);
  } else {
    ctx.setReceiveStatus(data.receiveStatus);
  }
  return true;
};

// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'getBuffer'.
function getBuffer(data: any, charset: any) {
  if (data.base64) {
    try {
      return Buffer.from(data.base64, 'base64');
    } catch (e) {}
  } else if (data.text) {
    return util.toBuffer(data.text, charset);
  }
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.sendData = function (data: any) {
  // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  var ctx = conns[data.reqId];
  if (!ctx) {
    return;
  }
  var buf = getBuffer(data, ctx.charset);
  if (!buf) {
    return;
  }
  var isServer = data.target === 'server';
  var binary = data.type === 'bin';
  data = { binary: binary };
  if (ctx.customParser) {
    var name = isServer ? 'toServerData' : 'toClientData';
    var dataList = (ctx[name] = ctx[name] || []);
    if (dataList.length > MAX_COMPOSE_FRAME_COUNT) {
      return false;
    }
    data.base64 = buf.toString('base64');
    dataList.push(data);
    return;
  }
  data.binary = binary;
  data.length = buf.length;
  data.data = buf;
  if (isServer) {
    data.mask = true;
    return ctx.sendToServer(data);
  } else {
    return ctx.sendToClient(data);
  }
};
