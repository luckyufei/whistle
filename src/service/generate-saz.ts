// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var fs = require('fs');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var path = require('path');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var Zip = require('node-native-zip2');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var Buffer = require('safe-buffer').Buffer;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var util = require('./util');

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '__dirname'.
var fiddlerAssets = path.join(__dirname, '../../assets/fiddler/');
var fiddlerMeta = fs.readFileSync(fiddlerAssets + 'meta.xml', 'utf8');

function filterSessions(sessions: any) {
  return sessions.filter(function (item: any) {
    if (!item || !item.url || !item.req || !(item.startTime >= 0)) {
      return false;
    }
    return true;
  });
}

function renderTpl(tpl: any, locals: any) {
  locals = getMetaData(locals);
  Object.keys(locals).forEach(function (name) {
    tpl = tpl.replace('${' + name + '}', locals[name]);
  });
  return tpl;
}

function getMetaData(item: any) {
  var meta = {
    SID: item.index + 1
  };
  [
    'ClientConnected',
    'ClientDoneRequest',
    'ServerGotRequest',
    'ServerBeginResponse',
    'ServerDoneResponse',
    'ClientBeginResponse',
    'ClientDoneResponse'
  ].forEach(function (name) {
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    meta[name] = '0001-01-01T00:00:00';
  });
  ['GatewayTime', 'DNSTime', 'TCPConnectTime'].forEach(function (name) {
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    meta[name] = 0;
  });
  ['ttfb', 'ttlb', 'transfer-size', 'clientip', 'hostip'].forEach(function (
    name
  ) {
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    meta[name] = 0;
  });

  // @ts-expect-error ts-migrate(2339) FIXME: Property 'ClientConnected' does not exist on type ... Remove this comment to see the full error message
  meta.ClientConnected = util.toISOString(item.startTime);
  if (item.dnsTime >= item.startTime) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'DNSTime' does not exist on type '{ SID: ... Remove this comment to see the full error message
    meta.DNSTime = item.dnsTime - item.startTime;
  }
  if (item.requestTime > 0) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'ClientDoneRequest' does not exist on typ... Remove this comment to see the full error message
    meta.ClientDoneRequest =
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'ServerGotRequest' does not exist on type... Remove this comment to see the full error message
      meta.ServerGotRequest =
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'ServerBeginResponse' does not exist on t... Remove this comment to see the full error message
      meta.ServerBeginResponse =
        util.toISOString(item.requestTime);
  }

  if (item.responseTime > 0) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'ClientBeginResponse' does not exist on t... Remove this comment to see the full error message
    meta.ClientBeginResponse = util.toISOString(item.responseTime);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'ttfb' does not exist on type '{ SID: any... Remove this comment to see the full error message
    meta.ttfb = item.responseTime - item.startTime;
  }

  if (item.endTime > 0) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'ServerDoneResponse' does not exist on ty... Remove this comment to see the full error message
    meta.ServerDoneResponse = meta.ClientDoneResponse = util.toISOString(
      item.endTime
    );
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'ttlb' does not exist on type '{ SID: any... Remove this comment to see the full error message
    meta.ttlb = item.endTime - item.startTime;
  }

  var req = item.req || {};
  var res = item.res || {};
  if (res.size > 0) {
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    meta['transfer-size'] = res.size;
  }
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'clientip' does not exist on type '{ SID:... Remove this comment to see the full error message
  meta.clientip = req.ip || '127.0.0.1';
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'hostip' does not exist on type '{ SID: a... Remove this comment to see the full error message
  meta.hostip = res.ip || '127.0.0.1';
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'clientport' does not exist on type '{ SI... Remove this comment to see the full error message
  meta.clientport = req.port || 0;
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'serverport' does not exist on type '{ SI... Remove this comment to see the full error message
  meta.serverport = res.port || 0;
  return meta;
}

function getFiddler2Meta(item: any) {
  return renderTpl(fiddlerMeta, item);
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function (body: any) {
  var sessions = util.parseJSON(body.sessions);
  if (!Array.isArray(sessions)) {
    return '';
  }
  sessions = filterSessions(sessions);
  var index = 0;
  var getName = function () {
    var name = String(index);
    ++index;
    var paddingCount = 4 - name.length;
    return paddingCount <= 0
      ? name
      : new Array(paddingCount + 1).join('0') + name;
  };

  var zip = new Zip();
  sessions.map(function (item: any, index: any) {
    item.req.url = item.url;
    var req = util.getReqRaw(item.req);
    var res =
      !item.res || item.res.statusCode == null
        ? Buffer.from('')
        : util.getResRaw(item.res);
    var name = getName();
    item.index = index;
    zip.add('raw/' + name + '_c.txt', req);
    zip.add('raw/' + name + '_m.xml', Buffer.from(getFiddler2Meta(item)));
    zip.add('raw/' + name + '_s.txt', res);
    zip.add(
      'raw/' + name + '_whistle.json',
      Buffer.from(
        JSON.stringify({
          version: item.version,
          nodeVersion: item.nodeVersion,
          realUrl: item.realUrl,
          fwdHost: item.fwdHost,
          rules: item.rules,
          frames: item.frames,
          useHttp: item.useHttp,
          httpsTime: item.httpsTime,
          useH2: item.useH2,
          mark: item.mark,
          sniPlugin: item.sniPlugin,
          trailers: item.res && item.res.trailers,
          rawTrailerNames: item.res && item.res.rawTrailerNames,
          times: {
            startTime: item.startTime,
            dnsTime: item.dnsTime,
            requestTime: item.requestTime,
            responseTime: item.responseTime,
            endTime: item.endTime
          }
        })
      )
    );
  });

  return zip.toBuffer();
};
