// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('../util/patch');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var express = require('express');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var bodyParser = require('body-parser');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var multer = require('multer2');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var util = require('./util');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var extractSaz = require('./extract-saz');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var generateSaz = require('./generate-saz');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var getServer = require('hagent').getServer;

var SESSIONS_FILE_RE = /\.(txt|json|saz)$/i;
var LIMIT_SIZE = 1024 * 1024 * 128;
var storage = multer.memoryStorage();
var upload = multer({
  storage: storage,
  fieldSize: LIMIT_SIZE
});

function sessionsHandler() {
  var app = express();
  app.use(function (req: any, res: any, next: any) {
    req.on('error', abort);
    res.on('error', abort);
    function abort() {
      res.destroy();
    }
    next();
  });
  app.use(
    '/cgi-bin/sessions/import',
    upload.single('importSessions'),
    function (req: any, res: any) {
      var file = req.file;
      var suffix;
      if (file && SESSIONS_FILE_RE.test(file.originalname)) {
        suffix = RegExp.$1.toLowerCase();
      }
      if (!suffix || !Buffer.isBuffer(file.buffer)) {
        return res.json([]);
      }
      if (suffix !== 'saz') {
        var sessions = util.parseJSON(file.buffer + '');
        return res.json(Array.isArray(sessions) ? sessions : []);
      }
      try {
        extractSaz(file.buffer, res.json.bind(res));
      } catch (e) {
        res.status(500).send(e.stack);
      }
    }
  );
  app.use(bodyParser.urlencoded({ extended: true, limit: LIMIT_SIZE }));
  app.use(bodyParser.json());
  app.use('/cgi-bin/sessions/export', function (req: any, res: any) {
    var body = req.body;
    var type = body.exportFileType;
    var sessions = type === 'Fiddler' ? generateSaz(body) : body.sessions;
    res.attachment(util.getFilename(type, body.exportFilename)).send(sessions);
  });
  return app;
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function (_: any, callback: any) {
  getServer(function (server: any, port: any) {
    server.on('request', sessionsHandler());
    callback(null, { port: port });
  });
};
