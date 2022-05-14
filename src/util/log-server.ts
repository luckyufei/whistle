var MAX_LENGTH = 512;
var MIN_LENGTH = 420;
var SIZE = 1024 * 64;
var COUNT = 100;
var count = 0;
var logs: any = [];

function sliceLogs(index: any, count: any, logId: any) {
  if (!logId) {
    return logs.slice(index, index + count);
  }
  var result = [];
  for (var len = logs.length; index < len; index++) {
    var log = logs[index];
    if (log.logId === logId) {
      result.push(log);
      if (--count <= 0) {
        return result;
      }
    }
  }
  return result;
}

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
function getLogs(startTime: any, count: any, logId: any) {
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
        return sliceLogs(i + 1, count, logId);
      }
    }
  }
  return sliceLogs(0, count, logId);
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function init(proxy: any) {
  proxy.addLog = function set(log: any) {
    if (!log) {
      return;
    }

    var now = Date.now();
    var text = log.text;
    if (text == null) {
      text = '';
    } else if (typeof text != 'string') {
      text += '';
    }
    logs.push({
      id: now + '-' + ++count,
      logId: log.id,
      date: now,
      level: /^fatal|error|warn|info|debug$/.test(log.level)
        ? log.level
        : 'info',
      text: text.substring(0, SIZE)
    });

    var len = logs.length;
    if (len > MAX_LENGTH) {
      logs = logs.slice(len - MIN_LENGTH, len);
    }
  };
  proxy.getLogs = getLogs;
  proxy.getLatestId = function () {
    var last = logs[logs.length - 1];
    return last && last.id;
  };
};
