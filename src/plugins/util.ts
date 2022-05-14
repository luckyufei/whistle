// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var util = require('../util');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var config = require('../config');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var protocols = require('../rules/protocols');

var ORG_RE = /^@[\w-]+$/;
var WHISLTE_PLUGIN_RE = /^whistle\.[a-z\d_\-]+$/;
var HTTP_RE = /^https?:\/\//i;
var PLUGIN_NAME_RE = /^(?:@[\w-]+\/)?whistle\.[a-z\d_\-]+$/;

function isOrgModule(name: any) {
  return ORG_RE.test(name);
}

// @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'exports'. Did you mean 'ports'?
exports.isOrgModule = isOrgModule;

// @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'exports'. Did you mean 'ports'?
exports.isPluginName = function(name: any) {
  return PLUGIN_NAME_RE.test(name);
};

function isWhistleModule(name: any) {
  return WHISLTE_PLUGIN_RE.test(name);
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.isWhistleModule = isWhistleModule;

function getHomePageFromPackage(pkg: any) {
  if (HTTP_RE.test(pkg.homepage)) {
    return pkg.homepage;
  }

  return extractUrl(pkg.repository) || '';
}

function extractUrl(repository: any) {
  if (
    !repository ||
    repository.type != 'git' ||
    typeof repository.url != 'string'
  ) {
    return;
  }

  var url = repository.url.replace(/^git\+/i, '');
  if (!HTTP_RE.test(url)) {
    url = url.replace(/^git@([^:]+):/, 'http://$1/');
  }

  return url.replace(/\.git\s*$/i, '');
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getHomePageFromPackage = getHomePageFromPackage;

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.parseValues = function (val: any) {
  if (val) {
    val = util.parseJSON(val);
  }
  if (!val) {
    return '';
  }
  Object.keys(val).forEach(function (key) {
    val[key] = util.toString(val[key]);
  });
  return val;
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getPluginHomepage = function (pkg: any) {
  var url = pkg.pluginHomepage || pkg.pluginHomePage;
  return typeof url === 'string' ? url : undefined;
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.excludePlugin = function (name: any) {
  if (
    protocols.contains(name) ||
    (config.allowPluginList && config.allowPluginList.indexOf(name) === -1)
  ) {
    return true;
  }
  return config.blockPluginList && config.blockPluginList.indexOf(name) !== -1;
};
