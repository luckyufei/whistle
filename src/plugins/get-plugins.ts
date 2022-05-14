// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var path = require('path');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var fs = require('fs');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var util = require('./util');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var mp = require('./module-paths');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var config = require('../config');

var CUSTOM_PLUGIN_PATH = config.CUSTOM_PLUGIN_PATH;
var customPluginPaths = config.customPluginPaths || [];
var notUninstallPluginPaths = config.notUninstallPluginPaths || [];
var projectPluginPaths = config.projectPluginPaths || [];
var accountPluginsPath = config.accountPluginsPath || [];

function readDir(dir: any, callback: any) {
  fs.readdir(dir, function (err: any, list: any) {
    if (!err) {
      return callback(err, list);
    }
    fs.readdir(dir, callback);
  });
}

function statFile(filepath: any, callback: any) {
  fs.stat(filepath, function (_: any, stat1: any) {
    if (stat1) {
      return callback(stat1.isFile() && stat1);
    }
    fs.stat(filepath, function (_: any, stat2: any) {
      callback(stat2 && stat2.isFile() && stat2);
    });
  });
}

function readPluginRootList(dir: any, callback: any) {
  var roots: any = [];
  readDir(dir, function (_: any, list: any) {
    if (!list || !list.length) {
      return callback(roots);
    }
    var handleCallback = function () {
      var orgRoots: any = [];
      // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'obj' implicitly has an 'any' type.
      roots = roots.filter(function (obj) {
        if (!Array.isArray(obj)) {
          return obj;
        }
        orgRoots.push.apply(orgRoots, obj);
      });
      callback(orgRoots.concat(roots));
    };
    var count = 0;
    list.forEach(function (name: any, i: any) {
      if (util.isWhistleModule(name)) {
        roots[i] = {
          name: name,
          dir: dir
        };
      } else if (util.isOrgModule(name)) {
        ++count;
        readDir(path.join(dir, name), function (_: any, list2: any) {
          if (list2 && list2.length) {
            var orgList: any;
            list2.forEach(function (pluginName: any) {
              if (util.isWhistleModule(pluginName)) {
                orgList = orgList || [];
                orgList.push({
                  org: name,
                  name: pluginName,
                  dir: dir
                });
              }
            });
            roots[i] = orgList;
          }
          if (--count === 0) {
            count = -1;
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
            handleCallback(roots);
          }
        });
      }
    });
    if (count === 0) {
      count = -1;
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
      handleCallback(roots);
    }
  });
}

function readPluginModules(dir: any, callback: any, plugins: any, isCustom: any) {
  readPluginRootList(dir, function (list: any) {
    var len = list.length;
    if (!len) {
      return callback(plugins);
    }
    list.forEach(function (obj: any) {
      var dir = obj.dir;
      var dirName = obj.org ? obj.org + '/' + obj.name : obj.name;
      var root = isCustom
        ? path.join(dir, dirName, 'node_modules', dirName)
        : path.join(dir, dirName);
      statFile(path.join(root, 'package.json'), function (stats: any) {
        if (stats) {
          obj.root = root;
          obj.mtime = stats.mtime.getTime();
        }
        if (--len === 0) {
          list.forEach(function (obj: any) {
            var name = obj.name.split('.')[1];
            if (obj.root && !plugins[name]) {
              plugins[name] = obj;
            }
          });
          callback(plugins);
        }
      });
    });
  });
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function (callback: any) {
  var plugins = {};
  var result = {};
  var paths = mp.getPaths();
  var count = paths.length;
  if (!count) {
    return callback(result);
  }

  var loadPlugins = function (dir: any, cb: any) {
    var isAccount = accountPluginsPath.indexOf(dir) !== -1;
    var account = isAccount ? config.account : undefined;
    var isSys = isAccount || CUSTOM_PLUGIN_PATH === dir || customPluginPaths.indexOf(dir) !== -1;
    var isProj = projectPluginPaths.indexOf(dir) !== -1;
    var notUn = notUninstallPluginPaths.indexOf(dir) !== -1;
    readPluginModules(
      dir,
      function () {
        Object.keys(plugins).filter(function (name) {
          // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          if (util.excludePlugin(name) || result[name + ':']) {
            return;
          }
          // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          var obj = plugins[name];
          // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          result[name + ':'] = {
            account: account,
            isSys: isSys,
            isProj: isProj,
            notUn: notUn,
            path: obj.root,
            mtime: obj.mtime
          };
        });
        cb();
      },
      plugins,
      isSys
    );
  };
  var index = 0;
  var callbackHandler = function () {
    var dir = paths[++index];
    if (dir) {
      return loadPlugins(dir, callbackHandler);
    }
    callback(result);
  };
  loadPlugins(paths[index], callbackHandler);
};
