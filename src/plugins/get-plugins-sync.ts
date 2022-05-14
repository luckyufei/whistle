// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var path = require('path');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var fs = require('fs');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var fse = require('fs-extra2');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var util = require('../util');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var pluginUtil = require('./util');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var mp = require('./module-paths');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var config = require('../config');

var CUSTOM_PLUGIN_PATH = config.CUSTOM_PLUGIN_PATH;
var customPluginPaths = config.customPluginPaths || [];
var notUninstallPluginPaths = config.notUninstallPluginPaths || [];
var projectPluginPaths = config.projectPluginPaths || [];
var accountPluginsPath = config.accountPluginsPath || [];
var paths = mp.getPaths();

function readPluginModulesSync(dir: any, plugins: any) {
  plugins = plugins || {};
  var isAccount = accountPluginsPath.indexOf(dir) !== -1;
  var account = isAccount ? config.account : undefined;
  var isSys = isAccount || CUSTOM_PLUGIN_PATH === dir || customPluginPaths.indexOf(dir) !== -1;
  var isProj = projectPluginPaths.indexOf(dir) !== -1;
  var notUn = notUninstallPluginPaths.indexOf(dir) !== -1;

  try {
    var list = fs.readdirSync(dir).filter(function (name: any) {
      if (pluginUtil.isWhistleModule(name)) {
        return true;
      }

      if (pluginUtil.isOrgModule(name)) {
        try {
          var _dir = path.join(dir, name);
          var org = name;
          fs.readdirSync(_dir).forEach(function (name: any) {
            if (!plugins[name] && pluginUtil.isWhistleModule(name)) {
              var root = isSys
                ? path.join(_dir, name, 'node_modules', org, name)
                : path.join(_dir, name);
              if (fs.existsSync(path.join(root, 'package.json'))) {
                plugins[name] = {
                  root: root,
                  account: account,
                  isSys: isSys,
                  notUn: notUn,
                  isProj: isProj
                };
              }
            }
          });
        } catch (e) {}
      }
      return false;
    });

    list.forEach(function (name: any) {
      if (!plugins[name]) {
        var root = isSys
          ? path.join(dir, name, 'node_modules', name)
          : path.join(dir, name);
        if (fs.existsSync(path.join(root, 'package.json'))) {
          plugins[name] = {
            root: root,
            account: account,
            isSys: isSys,
            notUn: notUn,
            isProj: isProj
          };
        }
      }
    });
  } catch (e) {}

  return plugins;
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function () {
  var plugins = {};
  paths.forEach(function (dir: any) {
    readPluginModulesSync(dir, plugins);
  });

  var _plugins = {};
  Object.keys(plugins).forEach(function (name) {
    var simpleName = name.split('.', 2)[1];
    if (pluginUtil.excludePlugin(simpleName)) {
      return;
    }
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    var dir = plugins[name];
    var account = dir.account;
    var isSys = dir.isSys;
    var isProj = dir.isProj;
    var notUn = dir.notUn;
    dir = dir.root;
    try {
      var pkgPath = path.join(dir, 'package.json');
      var pkg = fse.readJsonSync(pkgPath);
      if (pkg && pkg.version && pluginUtil.isPluginName(pkg.name)) {
        var stats = fs.statSync(pkgPath);
        var conf = pkg.whistleConfig || '';
        var tabs = conf.inspectorTabs || conf.inspectorTab || '';
        var hintList = util.getHintList(conf);
        var plugin = {
          account: account,
          isSys: isSys,
          isProj: isProj,
          notUn: notUn,
          moduleName: pkg.name,
          enableAuthUI: !!conf.enableAuthUI,
          inheritAuth: !!conf.inheritAuth,
          updateUrl: util.getUpdateUrl(conf),
          tunnelKey: util.getTunnelKey(conf),
          staticDir: util.getStaticDir(conf),
          pluginVars: util.getPluginVarsConf(conf),
          networkMenus: util.getPluginMenu(
            conf.networkMenus || conf.networkMenu,
            simpleName
          ),
          rulesMenus: util.getPluginMenu(
            conf.rulesMenus || conf.rulesMenu,
            simpleName
          ),
          valuesMenus: util.getPluginMenu(
            conf.valuesMenus || conf.valuesMenu,
            simpleName
          ),
          reqTab: util.getCustomTab(tabs.req, simpleName),
          resTab: util.getCustomTab(tabs.res, simpleName),
          tab: util.getCustomTab(tabs, simpleName),
          comTab: util.getCustomTab(conf.composerTab, simpleName),
          pluginHomepage: pluginUtil.getPluginHomepage(pkg),
          openInPlugins: conf.openInPlugins ? 1 : undefined,
          priority:
            parseInt(conf.priority, 10) ||
            parseInt(pkg.pluginPriority, 10) ||
            0,
          rulesUrl: util.getCgiUrl(conf.rulesUrl),
          valuesUrl: util.getCgiUrl(conf.valuesUrl),
          hintUrl: hintList ? undefined : util.getCgiUrl(conf.hintUrl),
          hideShortProtocol: !!conf.hideShortProtocol,
          hideLongProtocol: !!conf.hideLongProtocol,
          hintList: hintList,
          registry: util.getRegistry(pkg),
          path: dir,
          mtime: stats.mtime.getTime(),
          version: pkg.version,
          description: pkg.description,
          homepage: pluginUtil.getHomePageFromPackage(pkg),
          rules: util.renderPluginRules(
            util.trim(util.readFileSync(path.join(dir, 'rules.txt'))),
            pkg,
            simpleName
          ),
          _rules: util.renderPluginRules(
            util.trim(util.readFileSync(path.join(dir, '_rules.txt'))) ||
              util.trim(util.readFileSync(path.join(dir, 'reqRules.txt'))),
            pkg,
            simpleName
          ),
          resRules: util.renderPluginRules(
            util.trim(util.readFileSync(path.join(dir, 'resRules.txt'))),
            pkg,
            simpleName
          )
        };

        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        plugin[util.PLUGIN_VALUES] = pluginUtil.parseValues(
          util.renderPluginRules(
            util.readFileSync(path.join(dir, '_values.txt')),
            pkg,
            simpleName
          )
        );
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        plugin[util.PLUGIN_MENU_CONFIG] = util.getPluginMenuConfig(conf);
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        plugin[util.PLUGIN_INSPECTOR_CONFIG] =
          util.getPluginInspectorConfig(conf);
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        _plugins[simpleName + ':'] = plugin;
      }
    } catch (e) {}
  });

  return _plugins;
};
