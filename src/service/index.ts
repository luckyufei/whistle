// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var fork = require('pfork').fork;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var path = require('path');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var config = require('../config');

// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'loadService'.
function loadService(callback: any) {
  fork(
    {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '__dirname'.
      script: path.join(__dirname, 'service.js'),
      debugMode: config.debugMode
    },
    callback
  );
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = loadService;
