// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var util = require('util');

var MAX_LENGTH = 360;
var MIN_LENGTH = 280;
var COUNT = 100;
var count = 0;
// @ts-expect-error ts-migrate(2403) FIXME: Subsequent variable declarations must have the sam... Remove this comment to see the full error message
var logs = [];
var LEVELS = ['fatal', 'error', 'warn', 'info', 'debug'];

function getLogs(startTime: any, count: any) {
  var len = logs.length;
  if (!len || startTime == -1) {
    return [];
  }

  count = Math.min(count || COUNT, len);
  if (startTime === 0) {
    return logs.slice(-1);
  }

  if (startTime != -2 && startTime) {
    for (var i = 0; i < len; i++) {
      var log = logs[i];
      if (log.id === startTime) {
        ++i;
        return logs.slice(i, i + count);
      }
    }
  }
  return logs.slice(0, count);
}

function log(text: any, level: any) {
  var now = Date.now();
  logs.push({
    id: now + '-' + ++count,
    date: now,
    level: level,
    text: text
  });
  var len = logs.length;
  if (len > MAX_LENGTH) {
    logs = logs.slice(len - MIN_LENGTH, len);
  }
}

// @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'exports'. Did you mean 'ports'?
exports.getLogs = getLogs;

LEVELS.forEach(function (level) {
  // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'exports'. Did you mean 'ports'?
  exports[level] = function (msg: any) {
    if (msg == null && arguments.length < 2) {
      return;
    }
    log(util.format.apply(null, arguments), level);
  };
});

// @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'exports'. Did you mean 'ports'?
exports.getLatestId = function () {
  var last = logs[logs.length - 1];
  return last && last.id;
};

// @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'exports'. Did you mean 'ports'?
exports.log = exports.info;
