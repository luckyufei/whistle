// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var util = require('../util');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var rules = require('../rules');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var pluginMgr = require('../plugins');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var ca = require('./ca');

var remoteCerts = ca.remoteCerts;
var SNI_CALLBACK_RE =
  /^sniCallback:\/\/(?:whistle\.|plugin\.)?([a-z\d_\-]+)(?:\(([\s\S]*)\))?$/;
var certCallbacks = {};

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function (socket: any, callback: any) {
  var servername = socket.servername;
  var curCert = remoteCerts.get(servername);
  var plugin = rules.resolveSNICallback(socket);
  if (plugin) {
    if (socket.rules) {
      socket.rules.sniCallback = plugin;
    }
    if (SNI_CALLBACK_RE.test(plugin.matcher)) {
      socket.sniRuleValue = RegExp.$2;
      var pluginName = RegExp.$1;
      plugin = pluginMgr.getPlugin(pluginName + ':');
      if (plugin) {
        if (curCert && curCert.name) {
          socket.hasCertCache =
            curCert.name + (curCert.mtime ? '+' + curCert.mtime : '');
        }
        var cbKey = servername + '/' + pluginName;
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        var cbList = certCallbacks[cbKey];
        var handleCert = function (cert: any) {
          if (cert === false) {
            return callback(false);
          }
          if (cert && util.isString(cert.key) && util.isString(cert.cert)) {
            socket.sniPlugin = cert.name;
            if (
              !curCert ||
              curCert.key !== cert.key ||
              curCert.cert !== cert.cert
            ) {
              remoteCerts.set(servername, cert);
              curCert = cert;
            }
          } else {
            if (curCert) {
              if (cert) {
                socket.sniPlugin = curCert.name;
              } else {
                remoteCerts.del(servername);
                curCert = null;
              }
            }
          }
          callback(curCert);
        };
        if (cbList) {
          return cbList.push(handleCert);
        }
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        certCallbacks[cbKey] = [handleCert];
        return pluginMgr.loadCert(socket, plugin, function (cert: any) {
          // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          cbList = certCallbacks[cbKey];
          // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          delete certCallbacks[cbKey];
          cbList &&
            cbList.forEach(function (handleCb: any) {
              handleCb(cert);
            });
        });
      }
    }
  }
  curCert && remoteCerts.del(servername);
  callback();
};
