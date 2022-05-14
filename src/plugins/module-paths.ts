// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var path = require('path');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var config = require('../config');

var uniqueArr = function(list: any) {
  var result: any = [];
  list.forEach(function(item: any) {
    if (result.indexOf(item) === -1) {
      result.push(item);
    }
  });
  return result;
};
// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'resolvePath'.
var resolvePath = function (str: any) {
  return path.resolve(str);
};
var prePlugins = (config.prePluginsPath || []).map(resolvePath);
var addon = (config.addon || []).map(resolvePath);
addon = addon.concat(addon.map(formatPath));

function addDebugPaths(plugins: any) {
  if (config.debugMode) {
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    var cwd = process.cwd();
    plugins.unshift(cwd);
    config.projectPluginPaths = config.projectPluginPaths || [];
    config.projectPluginPaths.push(cwd);
    var pluginDirRe = /[/\\]whistle\.[a-z\d_-]+[/\\]?$/;
    if (pluginDirRe.test(cwd)) {
      plugins.unshift(cwd.replace(pluginDirRe, '/'));
    }
  }
}

var pluginPaths = config.pluginPaths;
if (pluginPaths) {
  pluginPaths = prePlugins.concat(pluginPaths.concat(
    pluginPaths.map(formatPath).concat(addon)
  ));
  addDebugPaths(pluginPaths);
  pluginPaths = uniqueArr(pluginPaths);
  // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'exports'. Did you mean 'ports'?
  exports.getPaths = function () {
    return pluginPaths;
  };
  // @ts-expect-error ts-migrate(1108) FIXME: A 'return' statement can only be used within a fun... Remove this comment to see the full error message
  return;
}

addon = prePlugins.concat(addon);
if (config.noGlobalPlugins) {
  addDebugPaths(addon);
  addon = uniqueArr(addon);
  // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'exports'. Did you mean 'ports'?
  exports.getPaths = function () {
    return addon;
  };
  // @ts-expect-error ts-migrate(1108) FIXME: A 'return' statement can only be used within a fun... Remove this comment to see the full error message
  return;
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
var env = process.env || {};
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
var execPath = process.execPath;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
var isWin = process.platform === 'win32';
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
var paths = module.paths.map(formatPath);
// @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
var globalDir = formatPath(getGlobalDir());
var appDataDir = formatPath(env.APPDATA, 'npm');
// @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
var pluginsPath = formatPath(config.baseDir);

if (typeof execPath !== 'string') {
  execPath = '';
}

paths = paths.filter(function (p: any) {
  return p;
});

if (paths.indexOf(pluginsPath) == -1) {
  paths.unshift(pluginsPath);
}

// @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
pluginsPath = formatPath(env.WHISTLE_PLUGINS_PATH);
if (pluginsPath && paths.indexOf(pluginsPath) == -1) {
  paths.unshift(pluginsPath);
}
if (!config.customPluginPaths || !config.customPluginPaths.length) {
  paths.unshift(config.CUSTOM_PLUGIN_PATH);
}
paths = addon.concat(paths);
addDebugPaths(paths);

var nvmBin = env.NVM_BIN;
if (nvmBin && typeof nvmBin === 'string') {
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
  nvmBin = formatPath(path.join(nvmBin, '../lib'));
  if (paths.indexOf(nvmBin) == -1) {
    paths.push(nvmBin);
  }
}

if (appDataDir && paths.indexOf(appDataDir) == -1) {
  paths.push(appDataDir);
}

if (globalDir && paths.indexOf(globalDir) == -1) {
  paths.push(globalDir);
}
if (env.PATH && typeof env.PATH === 'string') {
  var list = env.PATH.trim().split(isWin ? ';' : ':');
  ['', '../', '../lib'].forEach(function (prefix) {
    list.forEach(function (dir: any) {
      dir = formatPath(dir, prefix);
      addPluginPath(dir);
    });
  });
}

function addPluginPath(dir: any) {
  dir && paths.indexOf(dir) == -1 && paths.push(dir);
}

function formatPath(dir: any, prefix: any) {
  if (typeof dir !== 'string' || !(dir = dir.trim())) {
    return null;
  }
  if (/(?:^|\/|\\)node_modules[\\\/]?$/.test(dir)) {
    return dir.replace(/\\/g, '/');
  }
  return path
    .resolve(dir, typeof prefix === 'string' ? prefix : '', 'node_modules')
    .replace(/\\/g, '/');
}

function getGlobalDir() {
  var globalPrefix;
  if (env.PREFIX) {
    globalPrefix = env.PREFIX;
  } else if (isWin) {
    globalPrefix = execPath && path.dirname(execPath);
  } else {
    globalPrefix = execPath && path.dirname(path.dirname(execPath));
    if (env.DESTDIR && typeof env.DESTDIR === 'string') {
      globalPrefix = path.join(env.DESTDIR, globalPrefix);
    }
  }
  if (typeof globalPrefix !== 'string') {
    return;
  }
  return formatPath(globalPrefix, isWin ? '' : 'lib');
}
paths = uniqueArr(paths);
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getPaths = function () {
  return paths;
};
