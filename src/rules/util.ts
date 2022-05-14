// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var fs = require('fs');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var path = require('path');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var rules = require('./index');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var util = require('../util');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var config = require('../config');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var Storage = require('./storage');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var httpMgr = require('../util/http-mgr');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var Buffer = require('safe-buffer').Buffer;

var INTERVAL = 1000 * 60 * 60;
var MAX_URL_LEN = 10 * 1024;
var MAX_HEADERS_LEN = 128 * 1024;
var MAX_BODY_LEN = 256 * 1024;
var MAX_METHOD_LEN = 64;
var MAX_HISTORY_LEN = 64;
// @ts-expect-error ts-migrate(2403) FIXME: Subsequent variable declarations must have the sam... Remove this comment to see the full error message
var history = [];
var rulesStorage = new Storage(
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 3.
  config.rulesDir,
  { Default: true },
  config.disableWebUI
);
// @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 3.
var valuesStorage = new Storage(config.valuesDir, null, config.disableWebUI);
var propertiesStorage = new Storage(
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 3.
  config.propertiesDir,
  null,
  config.disableWebUI
);
var LINE_END_RE = /\n|\r\n|\r/g;
var MAX_REMOTE_RULES_COUNT = 16;
var REMOTE_RULES_RE =
  /^\s*@(`?)(whistle\.[a-z\d_\-]+(?:\/[^\s#]*)?|(?:https?:\/\/|[a-z]:[\\/]|~?\/)[^\s#]+|\$(?:whistle\.)?[a-z\d_-]+[/:][^\s#]+)\s*?\1(?:#.*)?$/gim;
var MAX_COUNT_BY_IMPORT = 60;
var uploadFiles: any = [];
var MAX_FILENAME_LEN = 60;
var ILLEGAL_FILENAME_RE = /[\\/:*?"<>|\s]/;
var LOCAL_FILES = config.LOCAL_FILES;
// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'proxy'.
var inlineValues, proxy;
var CONTROL_RE =
  /[\u001e\u001f\u200e\u200f\u200d\u200c\u202a\u202d\u202e\u202c\u206e\u206f\u206b\u206a\u206d\u206c]+/g;
var MULTI_LINE_VALUE_RE =
  /^[^\n\r\S]*(```+)[^\n\r\S]*(\S+)[^\n\r\S]*[\r\n]([\s\S]+?)[\r\n][^\n\r\S]*\1\s*$/gm;

try {
  history = JSON.parse(propertiesStorage.readFile('composerHistory'));
  if (Array.isArray(history)) {
    // @ts-expect-error ts-migrate(2740) FIXME: Type 'any[]' is missing the following properties f... Remove this comment to see the full error message
    history = history.filter(checkHistory);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'slice' does not exist on type 'History'.
    history = history.slice(0, MAX_HISTORY_LEN);
  } else {
    // @ts-expect-error ts-migrate(2740) FIXME: Type 'never[]' is missing the following properties... Remove this comment to see the full error message
    history = [];
  }
} catch (e) {}

function limitValueLen(name: any, len: any) {
  var value = propertiesStorage.getProperty(name);
  if (typeof value !== 'string') {
    propertiesStorage.setProperty(name, name);
  } else if (value.length > len) {
    propertiesStorage.setProperty(name, value.substring(0, len));
  }
}

limitValueLen('Custom1', 16);
limitValueLen('Custom2', 16);

function checkFilename(name: any) {
  if (!name || typeof name !== 'string' || name.length > MAX_FILENAME_LEN) {
    return false;
  }
  return !ILLEGAL_FILENAME_RE.test(name);
}

try {
  var _files = fs.readdirSync(LOCAL_FILES).filter(checkFilename);
  for (var i = 0, len = _files.length; i < len; i++) {
    var _name = _files[i];
    try {
      // @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'stat'.
      var stat = fs.statSync(path.join(LOCAL_FILES, _name));
      if (stat.isFile) {
        uploadFiles.push({
          name: _name,
          date: stat.mtime.getTime()
        });
      }
    } catch (e) {}
    if (uploadFiles.length >= MAX_FILENAME_LEN) {
      break;
    }
  }
  if (uploadFiles.length) {
    // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'prev' implicitly has an 'any' type.
    uploadFiles.sort(function (prev, next) {
      return util.compare(prev.date, next.date);
    });
  }
} catch (e) {}

function checkHistory(data: any) {
  if (
    typeof data.url === 'string' &&
    typeof data.method === 'string' &&
    typeof data.headers === 'string'
  ) {
    if (!data.body) {
      data.body = '';
      return true;
    }
    return typeof data.body === 'string';
  }
}

/**
 * rules
 */

function resolveInlineValues(str: any) {
  str = str && str.replace(CONTROL_RE, '').trim();
  if (!str || str.indexOf('```') === -1) {
    return str;
  }
  return str.replace(MULTI_LINE_VALUE_RE, function (_: any, __: any, key: any, value: any) {
    inlineValues = inlineValues || {};
    if (!inlineValues[key]) {
      inlineValues[key] = value;
    }
    return '';
  });
}

function reverseRules(text: any, orig: any) {
  if (!text) {
    return '';
  }
  text = resolveInlineValues(text);
  text = text.split(LINE_END_RE).reverse();
  return orig ? text : text.join('\n');
}

function parseRules() {
  var disableRules =
    !config.notAllowedDisableRules &&
    propertiesStorage.getProperty('disabledAllRules');
  var shadowRules =
    disableRules && config.allowDisableShadowRules ? null : config.shadowRules;
  var value = [];
  if (!disableRules && !config.multiEnv) {
    getAllRulesFile().forEach(function (file: any) {
      if (file.selected) {
        value.push(file.data);
      }
    });
  }
  var backRulesFirst =
    !config.disabledBackOption &&
    propertiesStorage.getProperty('backRulesFirst') === true;
  var defaultRules =
    disableRules || defaultRulesIsDisabled() ? null : getDefaultRules();
  if (defaultRules) {
    if (backRulesFirst) {
      value.unshift(defaultRules);
    } else {
      value.push(defaultRules);
    }
  }

  if (backRulesFirst) {
    value = reverseRules(value.join('\n'), true);
  }
  value = value && value.join('\r\n');
  if (shadowRules) {
    if (backRulesFirst) {
      // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'any[]'.
      value = reverseRules(shadowRules) + '\n' + value;
    } else {
      value += '\n' + shadowRules;
    }
  }
  var rulesText = value;
  var index = 0;
  if (rulesText) {
    rulesText = rulesText.replace(REMOTE_RULES_RE, function (_: any, apo: any, rulesUrl: any) {
      if (index >= MAX_REMOTE_RULES_COUNT) {
        return '';
      }
      ++index;
      var remoteRules = util.getRemoteRules(apo, rulesUrl);
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      return backRulesFirst ? reverseRules(remoteRules) : remoteRules;
    });
  }
  if (!index) {
    httpMgr.clean();
  }
  rules.parse(rulesText, null, inlineValues);
  inlineValues = null;
}

httpMgr.addChangeListener(parseRules);

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.parseRules = parseRules;

function setDefaultRules(data: any) {
  data = typeof data != 'string' ? '' : data;
  var oldData = rulesStorage.getProperty('defalutRules') || '';
  rulesStorage.setProperty('defalutRules', data);
  parseRules();
  return data !== oldData;
}

function getDefaultRules() {
  return rulesStorage.getProperty('defalutRules');
}

function disableDefaultRules() {
  rulesStorage.setProperty('disabledDefalutRules', true);
  parseRules();
}

function enableDefaultRules() {
  rulesStorage.setProperty('disabledDefalutRules', false);
  parseRules();
}

function defaultRulesIsDisabled() {
  return rulesStorage.getProperty('disabledDefalutRules');
}

function selectRulesFile(file: any) {
  if (!rulesStorage.existsFile(file) || config.multiEnv) {
    return;
  }

  var selectedList = allowMultipleChoice() ? getSelectedRulesList() : [];
  if (selectedList.indexOf(file) == -1) {
    selectedList.push(file);
    rulesStorage.setProperty('selectedList', selectedList);
  }
  parseRules();
  return selectedList;
}

function unselectRulesFile(file: any, force: any) {
  if (!force && config.multiEnv) {
    return;
  }
  var selectedList = getSelectedRulesList();
  var index = selectedList.indexOf(file);
  if (index != -1) {
    selectedList.splice(index, 1);
    rulesStorage.setProperty('selectedList', selectedList);
  }
  parseRules();

  return selectedList;
}

function allowMultipleChoice() {
  return (
    !config.disabledMultipleOption &&
    propertiesStorage.getProperty('allowMultipleChoice')
  );
}

function clearSelection() {
  rulesStorage.setProperty('selectedList', []);
  parseRules();
}

function getSelectedRulesList() {
  if (config.multiEnv) {
    return [];
  }
  var selectedList = rulesStorage.getProperty('selectedList');
  if (!Array.isArray(selectedList)) {
    selectedList = [];
    rulesStorage.setProperty('selectedList', selectedList);
  }
  return selectedList;
}

function removeRulesFile(file: any) {
  unselectRulesFile(file, true);
  return rulesStorage.removeFile(file);
}

function renameRulesFile(file: any, newFile: any) {
  if (!rulesStorage.renameFile(file, newFile)) {
    return;
  }

  var selectedList = getSelectedRulesList();
  var index = selectedList.indexOf(file);
  if (index != -1) {
    selectedList[index] = newFile;
    rulesStorage.setProperty('selectedList', selectedList);
  }
  return true;
}

function addRulesFile(file: any, data: any) {
  return rulesStorage.writeFile(file, data);
}

function getAllRulesFile() {
  var list = rulesStorage.getFileList();
  var selectedList = getSelectedRulesList();
  list.forEach(function (file: any) {
    file.selected = selectedList.indexOf(file.name) != -1;
  });
  return list;
}

function resetRulesIfResort(fromName: any, toName: any) {
  var selectedList = getSelectedRulesList();
  if (
    selectedList.indexOf(fromName) == -1 &&
    selectedList.indexOf(toName) == -1
  ) {
    return;
  }
  parseRules();
}

function moveRulesTo(fromName: any, toName: any, clientId: any) {
  if (rulesStorage.moveTo(fromName, toName)) {
    resetRulesIfResort(fromName, toName);
    config.setModified(clientId, true);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'emit' does not exist on type '(callback:... Remove this comment to see the full error message
    proxy.emit('rulesDataChange', 'move', fromName, toName);
    return true;
  }
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.rules = {
  recycleBin: rulesStorage.recycleBin,
  enableBackRulesFirst: function (backRulesFirst: any) {
    var curFlag = propertiesStorage.getProperty('backRulesFirst') === true;
    if (curFlag !== backRulesFirst) {
      propertiesStorage.setProperty('backRulesFirst', backRulesFirst);
      parseRules();
    }
  },
  moveTo: moveRulesTo,
  moveToTop: function (name: any, clientId: any) {
    var first = name && getAllRulesFile()[0];
    first && moveRulesTo(name, first.name, clientId);
  },
  get: function (file: any) {
    return rulesStorage.readFile(file);
  },
  remove: function (file: any, clientId: any) {
    if (removeRulesFile(file)) {
      config.setModified(clientId, true);
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'emit' does not exist on type '(callback:... Remove this comment to see the full error message
      proxy.emit('rulesDataChange', 'remove', file);
    }
  },
  add: function (file: any, data: any, clientId: any) {
    if (file !== 'Default' && addRulesFile(file, data)) {
      config.setModified(clientId, true);
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'emit' does not exist on type '(callback:... Remove this comment to see the full error message
      proxy.emit('rulesDataChange', 'add', file);
    }
  },
  rename: function (file: any, newFile: any, clientId: any) {
    if (renameRulesFile(file, newFile)) {
      config.setModified(clientId, true);
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'emit' does not exist on type '(callback:... Remove this comment to see the full error message
      proxy.emit('rulesDataChange', 'rename', file, newFile);
    }
  },
  select: selectRulesFile,
  unselect: unselectRulesFile,
  list: getAllRulesFile,
  getDefault: getDefaultRules,
  setDefault: function (value: any, clientId: any) {
    if (setDefaultRules(value)) {
      config.setModified(clientId, true);
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'emit' does not exist on type '(callback:... Remove this comment to see the full error message
      proxy.emit('rulesDataChange', 'add', 'Default');
    }
  },
  enableDefault: enableDefaultRules,
  disableDefault: disableDefaultRules,
  defaultRulesIsDisabled: defaultRulesIsDisabled,
  parseRules: parseRules,
  clearSelection: clearSelection,
  getSelectedList: getSelectedRulesList
};

/**
 * values
 */

function addValuesFile(file: any, data: any) {
  return valuesStorage.writeFile(file, data);
}

function indexOfUploadFiles(name: any) {
  for (var i = 0, len = uploadFiles.length; i < len; i++) {
    var file = uploadFiles[i];
    if (file.name === name) {
      return i;
    }
  }
  return -1;
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.values = {
  recycleBin: valuesStorage.recycleBin,
  getUploadFiles: function () {
    return uploadFiles;
  },
  download: function (name: any, res: any) {
    if (!checkFilename(name)) {
      return res.end();
    }
    res.download(path.join(LOCAL_FILES, name), name);
  },
  existsFile: function (name: any) {
    return name && indexOfUploadFiles(name) !== -1;
  },
  LIMIMT_FILES_COUNT: MAX_FILENAME_LEN,
  addUploadFile: function (options: any, callback: any) {
    var name = options.name;
    if (!checkFilename(name)) {
      return callback();
    }
    if (
      uploadFiles.length >= MAX_FILENAME_LEN &&
      indexOfUploadFiles(name) === -1
    ) {
      return callback(
        new Error('The number of uploaded files cannot exceed 60.')
      );
    }
    var content = '';
    var base64 = options.base64;
    var headers = options.headers;

    if (headers && typeof headers === 'string') {
      try {
        content = Buffer.from(headers + '\r\n\r\n');
      } catch (e) {
        return callback();
      }
    }

    if (base64 && typeof base64 === 'string') {
      try {
        base64 = Buffer.from(base64, 'base64');
        content = content ? Buffer.concat([content, base64]) : base64;
      } catch (e) {
        return callback();
      }
    }
    if (!content) {
      return callback();
    }
    fs.writeFile(path.join(LOCAL_FILES, name), content, function (err: any) {
      if (!err) {
        var index = indexOfUploadFiles(name);
        if (index !== -1) {
          uploadFiles.splice(index, 1);
        }
        uploadFiles.unshift({
          name: name,
          date: Date.now()
        });
      }
      callback(err);
    });
  },
  removeUploadFile: function (name: any, callback: any) {
    if (!checkFilename(name) || indexOfUploadFiles(name) === -1) {
      return callback();
    }
    fs.unlink(path.join(LOCAL_FILES, name), function (err: any) {
      var index = indexOfUploadFiles(name);
      if (index === -1 || !err || err.code === 'ENOENT') {
        if (index !== -1) {
          uploadFiles.splice(index, 1);
        }
        return callback();
      }
      callback(err);
    });
  },
  moveTo: function (fromName: any, toName: any, clientId: any) {
    if (valuesStorage.moveTo(fromName, toName)) {
      config.setModified(clientId);
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'emit' does not exist on type '(callback:... Remove this comment to see the full error message
      proxy.emit('valuesDataChange', 'move', fromName, toName);
      return true;
    }
  },
  add: function (file: any, data: any, clientId: any) {
    if (addValuesFile(file, data)) {
      config.setModified(clientId);
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'emit' does not exist on type '(callback:... Remove this comment to see the full error message
      proxy.emit('valuesDataChange', 'add', file);
    }
  },
  get: function (file: any) {
    return valuesStorage.readFile(file);
  },
  remove: function remove(file: any, clientId: any) {
    if (valuesStorage.removeFile(file)) {
      config.setModified(clientId);
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'emit' does not exist on type '(callback:... Remove this comment to see the full error message
      proxy.emit('valuesDataChange', 'remove', file);
    }
  },
  rename: function (file: any, newFile: any, clientId: any) {
    if (valuesStorage.renameFile(file, newFile)) {
      config.setModified(clientId);
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'emit' does not exist on type '(callback:... Remove this comment to see the full error message
      proxy.emit('valuesDataChange', 'rename', file, newFile);
    }
  },
  list: function list() {
    var selectedFile = valuesStorage.getProperty('selectedFile');
    var list = valuesStorage.getFileList();
    if (selectedFile) {
      list.forEach(function (file: any) {
        file.selected = file.name == selectedFile;
      });
    }
    return list;
  },
  select: function (file: any) {
    typeof file == 'string' && valuesStorage.setProperty('selectedFile', file);
  },
  unselect: function () {
    valuesStorage.removeProperty('selectedFile');
  }
};

setTimeout(function getWhistleVersion() {
  util.getLatestVersion(config.registry, function (ver: any) {
    ver && propertiesStorage.writeFile('latestVersion', ver);
    setTimeout(getWhistleVersion, INTERVAL);
  });
}, 1000); //等待package的信息配置更新完成

/**
 * properties
 */
var composerTimer: any;
function saveComposerHistory() {
  composerTimer = null;
  try {
    propertiesStorage.writeFile('composerHistory', JSON.stringify(history));
  } catch (e) {}
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.properties = {
  getLatestVersion: function () {
    var version = propertiesStorage.readFile('latestVersion');
    return typeof version === 'string' && version.length < 60 ? version : '';
  },
  isEnableCapture: function () {
    if (config.multiEnv) {
      return false;
    }
    if (config.isEnableCapture != null) {
      return config.isEnableCapture;
    }
    return !!propertiesStorage.getProperty('interceptHttpsConnects');
  },
  setEnableCapture: function (enable: any) {
    config.isEnableCapture = enable;
    propertiesStorage.setProperty('interceptHttpsConnects', enable);
  },
  isEnableHttp2: function () {
    if (config.isEnableHttp2 != null) {
      return config.isEnableHttp2;
    }
    return propertiesStorage.getProperty('enableHttp2') !== false;
  },
  setEnableHttp2: function (enable: any) {
    config.isEnableHttp2 = enable;
    propertiesStorage.setProperty('enableHttp2', enable);
  },
  set: function (name: any, value: any) {
    typeof name == 'string'
      ? propertiesStorage.setProperty(name, value)
      : propertiesStorage.setProperties(name);
  },
  remove: function (name: any) {
    propertiesStorage.removeProperty(name);
  },
  get: function (name: any) {
    return propertiesStorage.getProperty(name);
  },
  getHistory: function () {
    return history;
  },
  addHistory: function (data: any) {
    if (!data.needResponse || !checkHistory(data)) {
      return;
    }
    var url = data.url;
    var method = data.method;
    var headers = data.headers;
    var body = data.body;
    var result = {
      date: Date.now(),
      useH2: data.useH2,
      url: url.length > MAX_URL_LEN ? url.substring(0, MAX_URL_LEN) : url,
      method:
        method.length > MAX_METHOD_LEN
          ? method.substring(0, MAX_METHOD_LEN)
          : method,
      headers:
        headers.length > MAX_HEADERS_LEN
          ? headers.substring(0, MAX_HEADERS_LEN)
          : headers,
      body: body.length > MAX_BODY_LEN ? body.substring(0, MAX_BODY_LEN) : body,
      isHexText: !!data.isHexText
    };
    for (var i = 0, len = history.length; i < len; i++) {
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      var item = history[i];
      if (
        item.url === result.url &&
        item.method === result.method &&
        item.headers === result.headers &&
        item.body === result.body &&
        !item.useH2 !== result.useH2
      ) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'splice' does not exist on type 'History'... Remove this comment to see the full error message
        history.splice(i, 1);
        break;
      }
    }
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'unshift' does not exist on type 'History... Remove this comment to see the full error message
    history.unshift(result);
    var overflow = history.length - MAX_HISTORY_LEN;
    if (overflow > 0) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'splice' does not exist on type 'History'... Remove this comment to see the full error message
      history.splice(MAX_HISTORY_LEN, overflow);
    }
    if (!composerTimer) {
      composerTimer = setTimeout(saveComposerHistory, 2000);
    }
  }
};

function getRules(rules: any) {
  if (Array.isArray(rules)) {
    return rules.join('\n');
  }
  if (typeof rules === 'string') {
    return rules;
  }
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.addRules = function (rules: any, replace: any, clientId: any) {
  if (rules == null) {
    return;
  }
  replace = replace !== false;
  var hasChanged;
  if (Array.isArray(rules) || typeof rules == 'string') {
    if (replace !== false || !getDefaultRules()) {
      hasChanged = setDefaultRules(getRules(rules));
    }
  } else {
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'string[]' is not assignable to p... Remove this comment to see the full error message
    var keys = Object.keys(rules).slice(keys, MAX_COUNT_BY_IMPORT);
    keys.forEach(function (name) {
      var item = name ? rules[name] : null;
      if (Array.isArray(item) || typeof item === 'string') {
        item = { rules: item };
      }
      if (item) {
        item.rules = getRules(item.rules);
        if (typeof item.replace !== 'boolean') {
          item.replace = replace;
        }
        if (name === 'Default') {
          if (
            typeof item.rules === 'string' &&
            (item.replace !== false || !getDefaultRules())
          ) {
            if (setDefaultRules(item.rules)) {
              hasChanged = true;
            }
          }
          if (item.enable) {
            enableDefaultRules();
          } else if (item.enable === false) {
            disableDefaultRules();
          }
        } else {
          if (
            typeof item.rules === 'string' &&
            (item.replace !== false || !rulesStorage.existsFile(name))
          ) {
            if (addRulesFile(name, item.rules)) {
              hasChanged = true;
            }
          }
          if (item.enable) {
            selectRulesFile(name);
          } else if (item.enable === false) {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
            unselectRulesFile(name);
          }
        }
      }
    });
  }
  if (hasChanged) {
    config.setModified(clientId, true);
  }
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.addValues = function (values: any, replace: any, clientId: any) {
  if (values == null || Array.isArray(values)) {
    return;
  }
  replace = replace !== false;
  var hasChanged;
  var keys = Object.keys(values).slice(0, MAX_COUNT_BY_IMPORT);
  keys.forEach(function (name) {
    if (/\s/.test(name) || (!replace && valuesStorage.existsFile(name))) {
      return;
    }
    var value = name ? values[name] : null;
    if (value == null) {
      return;
    }
    if (typeof value !== 'string') {
      value = JSON.stringify(value, null, '  ');
    }
    if (addValuesFile(name, value)) {
      hasChanged = true;
    }
  });
  if (hasChanged) {
    config.setModified(clientId);
  }
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.setup = function (p: any) {
  // @ts-expect-error ts-migrate(2539) FIXME: Cannot assign to 'proxy' because it is not a varia... Remove this comment to see the full error message
  proxy = p;
};
