var now = Date.now();
var preData = {
  now: now,
  totalHttpRequests: 0,
  totalWsRequests: 0,
  totalTunnelRequests: 0,
  totalAllHttpRequests: 0,
  totalAllWsRequests: 0
};
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
var memUsage = process.memoryUsage();
var maxCpuElap = 0;
var procData = {
  memUsage: memUsage,
  uptime: 0,
  cpuPercent: '0.0%',
  startupTime: now,
  updateTime: now,
  httpRequests: 0,
  allHttpRequests: 0,
  wsRequests: 0,
  allWsRequests: 0,
  tunnelRequests: 0,
  totalHttpRequests: 0,
  totalWsRequests: 0,
  totalTunnelRequests: 0,
  totalAllHttpRequests: 0,
  totalAllWsRequests: 0,
  httpQps: 0,
  tunnelQps: 0,
  wsQps: 0,
  totalQps: 0,
  maxQps: 0,
  maxAllQps: 0,
  maxRss: memUsage.rss,
  maxCpu: 0,
  maxQpsTime: now,
  maxAllQpsTime: now,
  maxRssTime: now,
  maxCpuTime: now
};
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
var startTime = typeof process.hrtime === 'function' && process.hrtime();
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
var startUsage = typeof process.cpuUsage === 'function' && process.cpuUsage();
// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'proxy'.
var proxy;

function secNSec2ms(secNSec: any) {
  if (Array.isArray(secNSec)) {
    return secNSec[0] * 1000 + secNSec[1] / 1000000;
  }
  return secNSec / 1000;
}

if (startTime !== false && startUsage !== false) {
  setInterval(function () {
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    var elapTime = process.hrtime(startTime);
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    var elapUsage = process.cpuUsage(startUsage);
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    startTime = process.hrtime();
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    startUsage = process.cpuUsage();
    var elapTimeMS = secNSec2ms(elapTime) || 1;
    var elapUserMS = secNSec2ms(elapUsage.user);
    var elapSystMS = secNSec2ms(elapUsage.system);
    var cpuElap = (100 * (elapUserMS + elapSystMS)) / elapTimeMS;
    var curTime = Date.now();
    procData.cpuPercent = cpuElap.toFixed(1) + '%';
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    procData.memUsage = process.memoryUsage();
    procData.updateTime = curTime;
    if (cpuElap > maxCpuElap) {
      maxCpuElap = cpuElap;
      // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'number'.
      procData.maxCpu = cpuElap.toFixed(1) + '%';
      procData.maxCpuTime = curTime;
    }
    if (procData.memUsage.rss > procData.maxRss) {
      procData.maxRss = procData.memUsage.rss;
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      process.maxRssTime = curTime;
    }
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'emit' does not exist on type '(callback:... Remove this comment to see the full error message
    proxy && proxy.emit('perfDataChange', procData);
  }, 3000);
  setInterval(function () {
    var curTime = Date.now();
    var costTime = curTime - preData.now || 1;
    var newHttpReqs = procData.totalHttpRequests - preData.totalHttpRequests;
    var newTunnelReqs =
      procData.totalTunnelRequests - preData.totalTunnelRequests;
    var newWsReqs = procData.totalWsRequests - preData.totalWsRequests;
    var newHttpUIReqs =
      procData.totalAllHttpRequests - preData.totalAllHttpRequests;
    var newWsUIReqs = procData.totalAllWsRequests - preData.totalAllWsRequests;
    preData.now = curTime;
    preData.totalHttpRequests = procData.totalHttpRequests;
    preData.totalTunnelRequests = procData.totalTunnelRequests;
    preData.totalWsRequests = procData.totalWsRequests;
    preData.totalAllHttpRequests = procData.totalAllHttpRequests;
    preData.totalAllWsRequests = procData.totalAllWsRequests;
    procData.uptime = curTime - now;
    procData.httpQps = Math.floor((newHttpReqs * 100000) / costTime);
    procData.tunnelQps = Math.floor((newTunnelReqs * 100000) / costTime);
    procData.wsQps = Math.floor((newWsReqs * 100000) / costTime);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'allHttpQps' does not exist on type '{ me... Remove this comment to see the full error message
    procData.allHttpQps = Math.floor((newHttpUIReqs * 100000) / costTime);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'allWsQps' does not exist on type '{ memU... Remove this comment to see the full error message
    procData.allWsQps = Math.floor((newWsUIReqs * 100000) / costTime);
    var totalQps = procData.httpQps + procData.tunnelQps + procData.wsQps;
    var totalAllQps =
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'allHttpQps' does not exist on type '{ me... Remove this comment to see the full error message
      procData.allHttpQps + procData.allWsQps + procData.tunnelQps;
    procData.totalQps = totalQps;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'totalAllQps' does not exist on type '{ m... Remove this comment to see the full error message
    procData.totalAllQps = totalAllQps;
    if (procData.maxQps < totalQps) {
      procData.maxQps = totalQps;
      procData.maxQpsTime = curTime;
    }
    if (procData.maxAllQps < totalAllQps) {
      procData.maxAllQps = totalAllQps;
      procData.maxAllQpsTime = curTime;
    }
  }, 1000);
}
// @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'exports'. Did you mean 'ports'?
exports.procData = procData;
// @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'exports'. Did you mean 'ports'?
exports.setProxy = function (p: any) {
  // @ts-expect-error ts-migrate(2539) FIXME: Cannot assign to 'proxy' because it is not a varia... Remove this comment to see the full error message
  proxy = p;
};
