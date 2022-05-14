// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var Transform = require('pipestream').Transform;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var path = require('path');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var fs = require('fs');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var util = require('../util');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var config = require('../config');

var weinreScriptFile = path.join(config.ASSESTS_PATH, 'js/weinre.js');
var weinreScript = fs.readFileSync(weinreScriptFile, { encoding: 'utf8' });
var weinreHtmlScript = '\r\n<script>' + weinreScript + '</script>\r\n';

function getScript(host: any, name: any, isHtml: any, req: any) {
  host = util.getInternalHost(req, host);
  var weinrePath =
    (req.isHttps ? 'https://' : 'http://') +
    host +
    config.WEBUI_PATH +
    'weinre.' +
    config.port;
  var result = isHtml ? weinreHtmlScript : weinreScript;
  var weinreUrl =
    weinrePath + '/target/target-script-min.js#' + (name || 'anonymous');
  return result
    .replace('$WEINRE_PATH', weinrePath)
    .replace('$WEINRE_URL', weinreUrl);
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function (req: any, res: any, next: any) {
  if (req.rules.weinre) {
    util.disableReqCache(req.headers);
    var host = req.headers.host;
    res.on('src', function (_res: any) {
      var isHtml = util.supportHtmlTransform(_res, req);
      if (!isHtml && util.getContentType(_res.headers) !== 'JS') {
        return;
      }
      !req.enable.keepAllCSP && util.disableCSP(_res.headers);
      !req._customCache && util.disableResStore(_res.headers);
      var name = util.getPath(util.rule.getMatcher(req.rules.weinre));
      var transform = new Transform();
      transform._transform = function (chunk: any, _: any, callback: any) {
        if (!chunk) {
          chunk = util.toBuffer(getScript(host, name, isHtml, req));
        }
        callback(null, chunk);
      };

      res.addZipTransform(transform, false, true);
    });
  }

  next();
};
