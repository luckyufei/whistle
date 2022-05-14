// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var dns = require('dns');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var net = require('net');
// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'request'.
var request = require('../util/http-mgr').request;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var config = require('../config');

var dnsCacheTime = parseInt(config.dnsCache, 10);
var dnsServer = config.dnsServer;
var dnsOverHttps = config.dnsOverHttps;
var resolve6 = config.resolve6;
var dnsOptional = config.dnsOptional;
var dnsCache = {};
var callbacks = {};
var TIMEOUT = 10000;
var CACHE_TIME = dnsCacheTime >= 0 ? dnsCacheTime : 60000;
var MAX_CACHE_TIME = Math.max(CACHE_TIME * 3, 600000);

if (dnsOverHttps) {
  dnsOverHttps += (dnsOverHttps.indexOf('?') === -1 ? '?' : '&') + 'name=';
}

function getIpFromAnswer(data: any) {
  var index = data.length - 1;
  var ip = data[index] && data[index].data;
  if (net.isIP(ip)) {
    return ip;
  }
  while (index-- > 0) {
    ip = data[index] && data[index].data;
    if (net.isIP(ip)) {
      return ip;
    }
  }
}

function lookDnsOverHttps(hostname: any, callback: any) {
  request(
    {
      url: dnsOverHttps + hostname,
      rejectUnauthorized: config.rejectUnauthorized
    },
    function (err: any, data: any) {
      if (err) {
        return callback(err);
      }
      try {
        data = JSON.parse(data);
        data = data && data.Answer;
        return callback(null, data && getIpFromAnswer(data));
      } catch (e) {
        err = data || e;
      }
      return callback(err || 'DNS Over HTTPS Look Failed.');
    }
  );
}

function lookupDNS(hostname: any, callback: any) {
  if (net.isIP(hostname)) {
    return callback(null, hostname);
  }
  // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  var list = callbacks[hostname];
  if (list) {
    if (callback) {
      list.push(callback);
    }
    return;
  }
  // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  callbacks[hostname] = list = [];
  if (callback) {
    list.push(callback);
  }
  var done: any;
  var timer: any;
  var optional = dnsOptional;
  var handleDns = function (fn: any) {
    timer = setTimeout(function () {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      execCallback(new Error('Timeout'));
    }, TIMEOUT);
    if (!fn) {
      if (dnsServer) {
        fn = resolve6 ? 'resolve6' : 'resolve4';
      } else {
        fn = 'lookup';
      }
    }
    try {
      (dnsOverHttps ? lookDnsOverHttps : dns[fn])(
        hostname,
        function (err: any, ip: any, type: any) {
          clearTimeout(timer);
          if (err) {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
            execCallback(err);
          } else {
            ip = Array.isArray(ip) ? ip[0] : ip;
            if (!ip && optional) {
              // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
              execCallback(true);
            } else {
              execCallback(null, ip || getDefaultIp(type));
            }
          }
        }
      );
    } catch (err) {
      //如果断网，可能直接抛异常，https代理没有用到error-handler
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      execCallback(err);
    }
  };
  function execCallback(err: any, ip: any) {
    clearTimeout(timer);
    if (!err) {
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      dnsCache[hostname] = {
        ip: ip,
        hostname: hostname,
        time: Date.now()
      };
    } else if (optional) {
      optional = false;
      return handleDns('lookup');
    }
    if (done) {
      return;
    }
    done = true;
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    var host = dnsCache[hostname];
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    delete callbacks[hostname];
    list.forEach(function (callback: any) {
      callback(err, host && host.ip);
    });
  }
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
  handleDns();
}

function getDefaultIp(type: any) {
  return resolve6 || type == 6 ? '0:0:0:0:0:0:0:1' : '127.0.0.1';
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function lookup(hostname: any, callback: any, allowDnsCache: any) {
  // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  var host = allowDnsCache ? dnsCache[hostname] : null;
  var cacheTime;
  if (host) {
    cacheTime = Date.now() - host.time;
  }
  // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
  if (host && cacheTime < MAX_CACHE_TIME) {
    callback(null, host.ip);
    // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
    if (cacheTime > CACHE_TIME) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      lookupDNS(host.hostname);
    }
    return host.ip;
  }
  lookupDNS(hostname, function (err: any, ip: any) {
    err ? lookupDNS(hostname, callback) : callback(err, ip);
  });
};
