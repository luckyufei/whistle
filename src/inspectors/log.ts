// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var fs = require('fs');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var path = require('path');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var Transform = require('pipestream').Transform;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var util = require('../util');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var config = require('../config');
var logScriptFile = path.join(config.ASSESTS_PATH, 'js/log.js');
var logScript = fs.readFileSync(logScriptFile, { encoding: 'utf8' });
var logHtmlScript = '<!DOCTYPE html>\r\n<script>' + logScript + '</script>\r\n';
var LOG_ID_RE = /^log:\/\/(\{[^\s]{1,36}\}|[^/\\{}()<>\s]{1,36})$/;

function wrapScript(script: any, isHtml: any) {
  return isHtml
    ? '\r\n<script>' + script + '</script>\r\n'
    : '\r\n' + script + '\r\n';
}

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
function getScript(host: any, isHtml: any, req: any) {
  host = util.getInternalHost(req, host);
  var logCgiPath =
    config.WEBUI_PATH + 'log.' + config.port + '/cgi-bin/log/set';
  var result = isHtml ? logHtmlScript : logScript;
  logCgiPath = (req.isHttps ? 'https://' : 'http://') + host + logCgiPath;
  return result.replace('$LOG_CGI', logCgiPath);
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function (req: any, res: any, next: any) {
  var log = req.rules.log;
  if (log) {
    util.disableReqCache(req.headers);
    var host = req.headers.host;
    res.on('src', function (_res: any) {
      var topScript: any, isHtml: any;
      if (util.supportHtmlTransform(_res, req)) {
        isHtml = true;
        topScript = getScript(host, isHtml, req);
      } else if (util.getContentType(_res.headers) == 'JS') {
        topScript = getScript(host, isHtml, req);
      }

      if (topScript) {
        var enable = req.enable;
        topScript = topScript.replace(
          /\$INTERCEPT_CONSOLE/g,
          !req.disable.interceptConsole || !!enable.interceptConsole
        );
        !enable.keepAllCSP && util.disableCSP(_res.headers);
        !req._customCache && util.disableResStore(_res.headers);
        var userScript: any;
        var transform = new Transform();
        var added: any;
        transform._transform = function (chunk: any, encoding: any, callback: any) {
          if (!added) {
            added = true;
            var logId = '';
            var isValue;
            if (LOG_ID_RE.test(log.matcher)) {
              logId = RegExp.$1;
              if (logId[0] === '{') {
                logId = logId.slice(1, -1);
                isValue = true;
              }
              try {
                logId = encodeURIComponent(logId);
              } catch (e) {}
            }
            util.getRuleValue(
              logId && !isValue ? null : log,
              function (script: any) {
                topScript = topScript.replace('$LOG_ID', logId);
                var buf = [util.toBuffer(topScript)];
                userScript = script || null;
                if (userScript) {
                  userScript = util.toBuffer(wrapScript(userScript, isHtml));
                  if (isHtml || !chunk) {
                    buf.push(userScript);
                    userScript = null;
                  }
                }
                chunk && buf.push(chunk);
                callback(null, Buffer.concat(buf));
              },
              null,
              null,
              null,
              req
            );
          } else {
            callback(null, chunk || userScript);
          }
        };

        res.addZipTransform(transform, false, true);
      }
    });
  }

  next();
};
