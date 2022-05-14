// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var net = require('net');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var util = require('./index');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var Buffer = require('safe-buffer').Buffer;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var logger = require('./logger');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var config = require('../config');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var socketMgr = require('../socket-mgr');

var version = config.version;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
var nodeVersion = process.version.substring(1);

if (!(config.reqCacheSize > 0) || config.reqCacheSize < 600) {
  config.reqCacheSize = 600;
}

if (!(config.frameCacheSize > 0) || config.frameCacheSize < 720) {
  config.frameCacheSize = 600;
}

var CLEAR_INTERVAL = 6000;
var CACHE_TIME = 1000 * 60 * 2;
var MAX_CACHE_TIME = 1000 * 60 * 6;
var MAX_LENGTH = config.reqCacheSize;
var OVERFLOW_LENGTH = MAX_LENGTH * 3;
var MAX_CACHE_SIZE = MAX_LENGTH * 2;
var PRESERVE_LEN = 360;
var MAX_FRAMES_LENGTH = config.frameCacheSize;
var COUNT = 100;
var count = 0;
var ids: any = [];
var reqData = {};
var framesCache: any = [];
var framesMap = {};
// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'proxy'.
var proxy, binded: any;
var clearCount = 0;

function enable() {
  if (binded) {
    return;
  }
  binded = true;
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'on' does not exist on type '(callback: a... Remove this comment to see the full error message
  proxy.on('request', handleRequest);
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'on' does not exist on type '(callback: a... Remove this comment to see the full error message
  proxy.on('frame', handleFrame);
  setInterval(clearCache, CLEAR_INTERVAL);
}

/**
 * 如果超过最大缓存数，清理如下请求数据：
 * 1. 已经请求结束且结束时间超过10秒
 * 2. 请求#1前面的未结束且未被ui读取过的请求
 */

var MAX_BUF_LEN1 = 1024 * 512;
var MAX_BUF_LEN2 = 1024 * 256;
var MAX_BUF_LEN3 = 1024 * 128;
var MAX_BUF_LEN4 = 1024 * 64;
var MIN1 = 1000 * 60;
var MIN2 = MIN1 * 2;
var MIN3 = MIN1 * 6;
var MIN4 = MIN1 * 12;

function reduceFrameSize(frame: any, len: any, interval: any, now: any) {
  var id = frame.frameId;
  if (now - id.substring(0, id.indexOf('-')) < interval) {
    return;
  }
  frame.len = len;
  var bin = frame.bin;
  var base64 = frame.base64;
  if (base64) {
    frame.base64 = null;
    bin = Buffer.from(base64, 'base64');
  }
  if (bin) {
    frame.bin = bin.slice(0, len);
  }
}

var clearFrames = function (frame: any, now: any) {
  var len = frame.len || frame.length;
  if (!len || len <= MAX_BUF_LEN4) {
    return;
  }
  if (len > MAX_BUF_LEN1) {
    return reduceFrameSize(frame, MAX_BUF_LEN1, MIN1, now);
  }
  if (len > MAX_BUF_LEN2) {
    return reduceFrameSize(frame, MAX_BUF_LEN2, MIN2, now);
  }

  if (len > MAX_BUF_LEN3) {
    return reduceFrameSize(frame, MAX_BUF_LEN3, MIN3, now);
  }
  reduceFrameSize(frame, MAX_BUF_LEN4, MIN4, now);
};

function clearCache() {
  var overflow = framesCache.length - MAX_FRAMES_LENGTH;
  var now = Date.now();
  // 1 分钟触发一次
  ++clearCount;
  if (clearCount > 10) {
    clearCount = 0;
  }

  if (overflow > 0) {
    framesCache.splice(0, overflow + 60);
    framesMap = {};
    // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'frame' implicitly has an 'any' type.
    framesCache.forEach(function (frame) {
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      framesMap[frame.reqId] = frame;
      !clearCount && clearFrames(frame, now);
    });
  } else if (!clearCount) {
    // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'frame' implicitly has an 'any' type.
    framesCache.forEach(function (frame) {
      clearFrames(frame, now);
    });
  }
  var len = ids.length;
  if (len <= MAX_LENGTH) {
    return;
  }

  var _ids = [];
  var preserveLen = len;
  overflow = -1;
  if (len >= OVERFLOW_LENGTH) {
    overflow = len - MAX_CACHE_SIZE;
    preserveLen = len - PRESERVE_LEN;
  }
  var isTimeout = function (curData: any, i: any) {
    if (i < overflow) {
      return true;
    }
    return (
      curData.endTime &&
      now - curData.endTime > (i >= preserveLen ? MAX_CACHE_TIME : CACHE_TIME)
    );
  };
  for (var i = 0; i < len; i++) {
    var id = ids[i];
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    var curData = reqData[id];
    if (isTimeout(curData, i)) {
      curData.abort && curData.abort(true);
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      delete reqData[id];
    } else {
      if (curData.abort && now - curData.startTime > MAX_CACHE_TIME) {
        curData.abort(true);
      }
      _ids.push(id);
    }
  }
  ids = _ids;
}
// 不存在startTime相等的id
// @ts-expect-error ts-migrate(7023) FIXME: 'getIndex' implicitly has return type 'any' becaus... Remove this comment to see the full error message
function getIndex(startTime: any, start: any, end: any) {
  var midIndex = Math.floor((start + end) / 2);
  if (midIndex == start) {
    return end;
  }
  if (ids[midIndex] < startTime) {
    return getIndex(startTime, midIndex, end);
  }
  return getIndex(startTime, start, midIndex);
}

function getIds(startTime: any, count: any, lastRowId: any) {
  startTime = startTime || lastRowId;
  if (!startTime) {
    return ids.slice(-count);
  }
  var index = 0;
  if (startTime !== '0') {
    index = ids.indexOf(startTime) + 1;
    if (!index && startTime.length > 6) {
      var startId = ids[0];
      if (startId && startId < startTime) {
        var end = ids.length - 1;
        if (ids[end] < startTime) {
          return [];
        }
        index = getIndex(startTime, 0, end);
      }
    }
  }
  return ids.slice(index, index + count);
}

function getList(ids: any) {
  if (!Array.isArray(ids)) {
    return [];
  }
  return ids.map(function (id, i) {
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    return reqData[id];
  });
}

function handleRequest(req: any, data: any) {
  var id = (data.id = data.id || data.startTime + '-' + ++count);
  var removeAbort = function () {
    if (data.abort) {
      delete data.abort;
    }
  };
  req.on('end', removeAbort);
  req.on('error', removeAbort);
  req.on('abort', removeAbort);
  data.version = version;
  data.nodeVersion = nodeVersion;
  // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  reqData[id] = data;
  ids.indexOf(id) === -1 && ids.push(id);
}

function decodeData(frame: any) {
  if (frame.base64 == null) {
    frame.base64 = frame.bin ? frame.bin.toString('base64') : '';
    frame.bin = '';
  }
  return frame;
}
function handleFrame(data: any) {
  framesCache.push(data);
  // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  framesMap[data.reqId] = data;
}

// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'getFrames'.
function getFrames(curReqId: any, lastFrameId: any) {
  if (!curReqId) {
    return;
  }
  var result = [];
  // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  var lastFrame = framesMap[curReqId];
  if (lastFrame && (!lastFrameId || lastFrame.frameId > lastFrameId)) {
    var count = 16;
    for (var i = 0, len = framesCache.length; i < len; i++) {
      var frame = framesCache[i];
      if (
        frame.reqId === curReqId &&
        (!lastFrameId || frame.frameId > lastFrameId)
      ) {
        result.push(decodeData(frame));
        if (--count <= 0) {
          return result;
        }
      }
    }
  }
  return result;
}

function getLastFrame(curReqId: any) {
  // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  var frame = framesMap[curReqId];
  if (frame && frame.reqId === curReqId) {
    return decodeData(frame);
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function init(_proxy: any) {
  // @ts-expect-error ts-migrate(2539) FIXME: Cannot assign to 'proxy' because it is not a varia... Remove this comment to see the full error message
  proxy = _proxy;
  enable();
  /**
   * options: {
   * 		startTime: timestamp || timestamp + '-' + count
   * 		count: 获取新数据的数量
   * 		ids: 请未结束的id列表
   * }
   *
   * @param options
   */
  function formatFilter(filter: any, clientIp: any, clientId: any) {
    if (!filter.url && !filter.name && !filter.value && !filter.ip) {
      return;
    }
    var url = util.trimStr(filter.url).toLowerCase();
    var ip = util.trimStr(filter.ip);
    var list: any = [];
    var cid;
    var result;
    if (ip === 'self') {
      ip = clientIp;
      cid = clientId;
    } else if (ip === 'clientIp') {
      ip = clientIp;
    }
    if (ip === 'clientId') {
      if (clientId) {
        cid = clientId;
      } else {
        result = { clientIp: clientIp };
      }
      ip = null;
    } else if (ip && !net.isIP(ip)) {
      ip.split(',').forEach(function (item: any) {
        item = item.trim();
        if (item === 'clientId') {
          cid = clientId;
        } else {
          if (item === 'self') {
            cid = clientId;
            item = clientIp;
          } else if (item === 'clientIp') {
            item = clientIp;
          }
          if (list.indexOf(item) === -1) {
            list.push(item);
          }
        }
      });
      ip = null;
    }
    if (url) {
      result = result || {};
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'url' does not exist on type '{ clientIp:... Remove this comment to see the full error message
      result.url = url;
    }
    var headers;
    for (var i = 0; i < 6; i++) {
      var key = 'name' + (i || '');
      var name = util.trimStr(filter[key]).toLowerCase();
      if (name) {
        result = result || {};
        var value = util.trimStr(filter['value' + (i || '')]).toLowerCase();
        if (i) {
          headers = headers || [];
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'headers' does not exist on type '{ clien... Remove this comment to see the full error message
          result.headers = headers;
          headers.push({
            // @ts-expect-error ts-migrate(2322) FIXME: Type 'any' is not assignable to type 'never'.
            name: name,
            // @ts-expect-error ts-migrate(2322) FIXME: Type 'any' is not assignable to type 'never'.
            value: value
          });
        } else {
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type '{ clientIp... Remove this comment to see the full error message
          result.name = name;
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'value' does not exist on type '{ clientI... Remove this comment to see the full error message
          result.value = value;
        }
      }
    }
    if (ip) {
      result = result || {};
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'ip' does not exist on type '{ clientIp: ... Remove this comment to see the full error message
      result.ip = ip;
    }
    if (cid) {
      result = result || {};
      // @ts-expect-error ts-migrate(2551) FIXME: Property 'clientId' does not exist on type '{ clie... Remove this comment to see the full error message
      result.clientId = cid;
    }
    if (list.length) {
      result = result || {};
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'ipList' does not exist on type '{ client... Remove this comment to see the full error message
      result.ipList = result.idList = list.slice(0, 16);
    }
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type '{ clientIp... Remove this comment to see the full error message
    if (result && (result.name || headers) && filter.mtype == 1) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'exact' does not exist on type '{ clientI... Remove this comment to see the full error message
      result.exact = 1;
    }
    return result;
  }
  function checkClientIp(item: any, filter: any) {
    var clientId = getClientId(item);
    var ipList = filter.ipList;
    var clientIp = item.req.ip;
    if (filter.clientIp) {
      return clientId === filter.clientIp;
    }
    if (filter.ip && clientIp === filter.ip) {
      return true;
    }
    // 有 clientId 过滤条件时，必须匹配 clientId
    if (filter.clientId) {
      if (clientId === filter.clientId) {
        return true;
      }
      if (!ipList) {
        return false;
      }
    } else if (!ipList) {
      return true;
    }
    var len = ipList.length;
    if (len < 3) {
      if (ipList[0] === clientIp || ipList[0] === clientId) {
        return true;
      }
      if (ipList[1] && (ipList[1] === clientIp || ipList[1] === clientId)) {
        return true;
      }
    } else {
      for (var i = 0; i < len; i++) {
        var ip = ipList[i];
        if (ip === clientIp || ip === clientId) {
          return true;
        }
      }
    }
    return false;
  }

  function checkHeader(text: any, keyword: any, exact: any) {
    if (!keyword) {
      return text != null;
    }
    if (!text || typeof text !== 'string') {
      if (!Array.isArray(text)) {
        return false;
      }
      text = text.join('\n');
    }
    text = text.toLowerCase();
    if (exact) {
      return (
        text === keyword ||
        text === util.encodeURIComponent(keyword).toLowerCase()
      );
    }
    return (
      text.indexOf(keyword) !== -1 ||
      text.indexOf(util.encodeURIComponent(keyword).toLowerCase()) !== -1
    );
  }

  function getClientId(item: any) {
    return (
      item._clientId ||
      item.req.headers[config.CLIENT_ID_HEADER] ||
      item.clientId
    );
  }

  function checkItem(item: any, filter: any) {
    if (!item || !checkClientIp(item, filter)) {
      return false;
    }
    var h = item.req.headers;
    if (filter.filterKey && h[filter.filterKey] != filter.filterValue) {
      return false;
    }
    if (filter.filterClientId && getClientId(item) != filter.filterClientId) {
      return false;
    }
    if (
      filter.name &&
      !checkHeader(h[filter.name], filter.value, filter.exact)
    ) {
      return false;
    }
    if (
      filter.url &&
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
      !checkHeader((item.isHttps ? 'tunnel://' : '') + item.url, filter.url)
    ) {
      return false;
    }
    var headers = filter.headers;
    if (headers) {
      for (var i = 0, len = headers.length; i < len; i++) {
        var header = headers[i];
        if (!checkHeader(h[header.name], header.value, filter.exact)) {
          return false;
        }
      }
    }
    return true;
  }
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'getLastDataId' does not exist on type '(... Remove this comment to see the full error message
  proxy.getLastDataId = function () {
    return ids[ids.length - 1];
  };

  function toBase64String(data: any) {
    if (Buffer.isBuffer(data.body)) {
      data.base64 = data.body.toString('base64');
      data.body = '';
    }
  }

  // @ts-expect-error ts-migrate(2339) FIXME: Property 'getItem' does not exist on type '(callba... Remove this comment to see the full error message
  proxy.getItem = function (id: any) {
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    var item = reqData[id];
    if (item) {
      toBase64String(item.req);
      toBase64String(item.res);
    }
    return item;
  };
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'abortRequest' does not exist on type '(c... Remove this comment to see the full error message
  proxy.abortRequest = function (id: any) {
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    var item = id && reqData[id];
    item && item.abort && item.abort();
  };
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'getFrames' does not exist on type '(call... Remove this comment to see the full error message
  proxy.getFrames = function (options: any) {
    return getFrames(options.curReqId, options.lastFrameId);
  };
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'getData' does not exist on type '(callba... Remove this comment to see the full error message
  proxy.getData = function (
    options: any,
    clientIp: any,
    key: any,
    value: any,
    filterClientId: any,
    clientId: any
  ) {
    options = options || {};
    var filter = formatFilter(options, clientIp, clientId);
    var data = {};
    var count = options.count;
    var startTime = options.startTime;
    var clearNetwork =
      !(options.dumpCount > 0) && (count == 0 || startTime == -2);
    if (!clearNetwork) {
      count = count > 0 && count < COUNT ? +count : COUNT;
      if (options.dumpCount > 0) {
        var len = ids.length;
        startTime = ids[len > options.dumpCount ? len - options.dumpCount : 0];
      }
    }
    if (key && value) {
      filter = filter || {};
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'filterKey' does not exist on type '{ cli... Remove this comment to see the full error message
      filter.filterKey = key;
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'filterValue' does not exist on type '{ c... Remove this comment to see the full error message
      filter.filterValue = value;
    }
    if (filterClientId) {
      filter = filter || {};
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'filterClientId' does not exist on type '... Remove this comment to see the full error message
      filter.filterClientId = filterClientId;
    }
    var newIds =
      clearNetwork || startTime == -1
        ? []
        : getIds(startTime, count, options.lastRowId);
    var setData = function (item: any) {
      if (item) {
        var req = item.req;
        var res = item.res;
        toBase64String(req);
        toBase64String(res);
        if (config.secureFilter) {
          try {
            item = config.secureFilter(item, clientIp, filter) || item;
          } catch (e) {
            if (config.debugMode) {
              /* eslint-disable no-console */
              console.log(e);
            }
            logger.error(e);
          }
        }
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        data[item.id] = item;
      }
    };
    if (newIds.length > 0) {
      if (filter) {
        var id = newIds[0];
        var index = ids.indexOf(newIds[0]);
        newIds = [];
        while (id && count > 0) {
          // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          var item = reqData[id];
          if (checkItem(item, filter)) {
            setData(item);
            newIds.push(id);
            --count;
          }
          id = ids[++index];
        }
      } else if (!filter) {
        getList(newIds).forEach(setData);
      }
    }
    getList(options.ids).forEach(setData);
    var endId = ids[ids.length - 1];
    var lastFrameId, frames;
    if (options.lastFrameId == -3) {
      var lastFrame = getLastFrame(options.curReqId);
      if (lastFrame) {
        if (lastFrame.closed || lastFrame.err) {
          frames = [lastFrame];
        } else {
          lastFrameId = lastFrame.frameId;
        }
      }
    } else {
      frames = getFrames(options.curReqId, options.lastFrameId);
    }
    var lastNewId = newIds[newIds.length - 1];
    var lastNewFrameId = frames && frames[frames.length - 1];
    var hasNew =
      (lastNewId && endId !== lastNewId) ||
      (lastNewFrameId && lastNewFrameId !== lastFrameId);
    var tunnelIds = options.tunnelIds;
    var tunnelIps = {};
    if (Array.isArray(tunnelIds) && tunnelIds.length > 0) {
      tunnelIds.forEach(function (id) {
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        tunnelIps[id] = proxy.getTunnelIp(id);
      });
    }

    return {
      ids: options.ids || [],
      tunnelIps: tunnelIps,
      newIds: newIds,
      data: data,
      hasNew: hasNew,
      lastId: clearNetwork ? endId : lastNewId,
      endId: endId,
      frames: frames,
      lastFrameId: lastFrameId,
      socketStatus: socketMgr.getStatus(options.curReqId)
    };
  };
};
