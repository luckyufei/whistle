// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var AdmZip = require('adm-zip');
// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'parseString'.
var parseString = require('xml2js').parseString;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var parseUrl = require('url').parse;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var util = require('./util');

function getMetaAttrs(meta: any) {
  meta = meta && meta.Session;
  if (!meta) {
    return {};
  }
  var result = meta.SessionTimers && meta.SessionTimers[0];
  result = (result && result.$) || {};
  var SessionFlag =
    meta.SessionFlags &&
    meta.SessionFlags[0] &&
    meta.SessionFlags[0].SessionFlag;
  if (Array.isArray(SessionFlag)) {
    SessionFlag.forEach(function (flag) {
      flag = flag && flag.$;
      if (!flag || typeof flag.N !== 'string') {
        return;
      }
      result[flag.N] = flag.V || '';
    });
  }
  return result;
}

function parseMetaInfo(result: any) {
  var req = result.req;
  if (!req) {
    return false;
  }
  var port;
  if (/^[^:/]+:\/\//.test(req.url)) {
    var options = parseUrl(req.url);
    if (!req.headers.host) {
      req.headers.host = options.host;
    }
    req.isHttps = /^https:/i.test(req.url);
    port = options.port || (req.isHttps ? 443 : 80);
    req.url = options.path;
  } else if (typeof req.headers.host !== 'string') {
    req.headers.host = '';
  }

  var meta = getMetaAttrs(result.meta);
  if (!result.startTime) {
    var startTime = (result.startTime =
      new Date(meta.ClientConnected).getTime() || 0);
    if (meta.DNSTime >= 0) {
      startTime = result.dnsTime = +startTime + +meta.DNSTime;
    }
    if (meta.ClientDoneRequest) {
      var requestTime = new Date(meta.ClientDoneRequest).getTime() || 0;
      startTime = result.requestTime = Math.max(startTime, requestTime);
    }
    if (meta.ClientBeginResponse) {
      var responseTime = new Date(meta.ClientBeginResponse).getTime() || 0;
      startTime = result.responseTime = Math.max(startTime, responseTime);
    }
    if (meta.ClientDoneResponse) {
      var endTime = new Date(meta.ClientDoneResponse).getTime() || 0;
      result.endTime = Math.max(endTime, startTime);
    }
  }
  result.rules = result.rules || {};
  var res = (result.res = result.res || {});
  result.hostIp = res.ip = util.removeIPV6Prefix(meta['x-hostip']);
  res.port = meta['x-serverport'] || port;
  result.clientIp = req.ip = util.removeIPV6Prefix(meta['x-clientip']);
  var clientPort = meta['x-clientport'];
  if (clientPort) {
    req.port = clientPort;
  }
  var size = meta['x-transfer-size'] || meta['x-responsebodytransferlength'];
  if (typeof size === 'string') {
    size = parseInt(size.replace(/\s*,\s*/g, ''), 10);
  }
  if (size > -1) {
    res.size = size;
  }
  if (req.method === 'CONNECT') {
    result.url = req.url;
    result.isHttps = true;
  } else {
    result.url =
      'http' + (req.isHttps ? 's' : '') + '://' + req.headers.host + req.url;
    if (/\bwebsocket\b/i.test(req.headers.upgrade)) {
      result.url = result.url.replace(/^http/, 'ws');
    }
  }
}

function sortKeys(cur: any, next: any) {
  return parseInt(cur, 10) - parseInt(next, 10);
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function (buffer: any, cb: any) {
  var zip = new AdmZip(buffer);
  var zipEntries = zip.getEntries();
  var sessions = {};
  var count = 0;
  var execCallback = function () {
    if (count <= 0) {
      var result: any = [];
      var wsLen = 0;
      Object.keys(sessions)
        .sort(sortKeys)
        .forEach(function (key) {
          // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          var session = sessions[key];
          if (session.req && session.meta) {
            if (parseMetaInfo(session) !== false) {
              result.push(session);
            }
          }
          if (session.trailers && session.res) {
            session.res.trailers = session.trailers;
            session.res.rawTrailerNames = session.rawTrailerNames;
            delete session.trailers;
            delete session.rawTrailerNames;
          }
          var framesData = session.framesData;
          if (framesData) {
            delete session.framesData;
            ++wsLen;
            util.parseFrames(session.res, framesData, function (frames: any) {
              session.frames = frames;
              if (--wsLen === 0) {
                wsLen = -1;
                cb(result);
              }
            });
          }
        });
      if (wsLen === 0) {
        wsLen = -1;
        cb(result);
      }
    }
  };
  zipEntries.forEach(function (entry: any) {
    if (entry.isDirectory) {
      return;
    }
    var entryName = entry.entryName;
    var filename = entryName.substring(4);
    var dashIndex = filename.lastIndexOf('_');
    if (dashIndex <= 0) {
      return;
    }
    var index = filename.substring(0, dashIndex);
    filename = filename.substring(dashIndex + 1).toLowerCase();
    if (
      ['c.txt', 'm.xml', 's.txt', 'w.txt', 'whistle.json'].indexOf(filename) ===
      -1
    ) {
      return;
    }
    var content = zip.readFile(entryName);
    if (!content) {
      return;
    }
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    var result = (sessions[index] = sessions[index] || {});
    ++count;
    if (filename === 'c.txt') {
      util.getReq(content, function (req: any) {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'setImmediate'.
        setImmediate(function () {
          result.req = req;
          --count;
          execCallback();
        });
      });
    } else if (filename === 'm.xml') {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 2.
      parseString(content, function (err: any, meta: any) {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'setImmediate'.
        setImmediate(function () {
          result.meta = meta;
          --count;
          execCallback();
        });
      });
    } else if (filename === 'whistle.json') {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'setImmediate'.
      setImmediate(function () {
        --count;
        var data = util.parseJSON(String(content));
        if (data) {
          if (typeof data.realUrl === 'string') {
            result.realUrl = data.realUrl;
          }
          if (data.rules) {
            result.rules = data.rules;
          }
          if (data.frames) {
            result.frames = data.frames;
          }
          if (data.fwdHost) {
            result.fwdHost = data.fwdHost;
          }
          if (data.useHttp) {
            result.useHttp = true;
          }
          if (data.sniPlugin) {
            result.sniPlugin = data.sniPlugin;
          }
          if (data.httpsTime > 0) {
            result.httpsTime = data.httpsTime;
          }
          if (data.useH2) {
            result.useH2 = true;
          }
          if (data.mark) {
            result.mark = true;
          }
          var times = data.times;
          if (times) {
            result.startTime = times.startTime;
            result.dnsTime = times.dnsTime;
            result.requestTime = times.requestTime;
            result.responseTime = times.responseTime;
            result.endTime = times.endTime;
          }
          result.trailers = data.trailers;
          result.rawTrailerNames = data.rawTrailerNames;
          if (data.version) {
            result.version = data.version;
          }
          if (data.nodeVersion) {
            result.nodeVersion = data.nodeVersion;
          }
        }
        execCallback();
      });
    } else if (filename === 'w.txt') {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'setImmediate'.
      setImmediate(function () {
        result.framesData = content;
        --count;
        execCallback();
      });
    } else {
      util.getRes(content, function (res: any) {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'setImmediate'.
        setImmediate(function () {
          result.res = res;
          --count;
          execCallback();
        });
      });
    }
  });
  execCallback();
};
