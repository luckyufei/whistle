var protocols = [
  'G',
  'style',
  'host',
  'rule',
  'pipe',
  'weinre',
  'proxy',
  'https2http-proxy',
  'http2https-proxy',
  'internal-proxy',
  'pac',
  'filter',
  'ignore',
  'enable',
  'disable',
  'delete',
  'log',
  'plugin',
  'referer',
  'auth',
  'ua',
  'urlParams',
  'params',
  'resMerge',
  'replaceStatus',
  'method',
  'cache',
  'attachment',
  'forwardedFor',
  'responseFor',
  'rulesFile',
  'resScript',
  'reqDelay',
  'resDelay',
  'headerReplace',
  'reqSpeed',
  'resSpeed',
  'reqType',
  'resType',
  'reqCharset',
  'resCharset',
  'reqCookies',
  'resCookies',
  'reqCors',
  'resCors',
  'reqHeaders',
  'resHeaders',
  'trailers',
  'reqPrepend',
  'resPrepend',
  'reqBody',
  'resBody',
  'reqAppend',
  'resAppend',
  'urlReplace',
  'reqReplace',
  'resReplace',
  'reqWrite',
  'resWrite',
  'reqWriteRaw',
  'resWriteRaw',
  'cssAppend',
  'htmlAppend',
  'jsAppend',
  'cssBody',
  'htmlBody',
  'jsBody',
  'cssPrepend',
  'htmlPrepend',
  'jsPrepend',
  'cipher',
  'sniCallback'
];

var RULE_RE = /^(?:|x|xs)(?:file|rawfile|dust|tpl|jsonp):/;
var PROXY_RE =
  /^x?(?:socks|proxy|https?-proxy|internal-proxy|internal-https?-proxy|https2http-proxy|http2https-proxy)$/;
var pureResProtocols = [
  'replaceStatus',
  'cache',
  'attachment',
  'resMerge',
  'resDelay',
  'resSpeed',
  'resType',
  'resType',
  'resCharset',
  'resCookies',
  'resCors',
  'resHeaders',
  'trailers',
  'resPrepend',
  'resBody',
  'resAppend',
  'resReplace',
  'resWrite',
  'resWriteRaw',
  'cssAppend',
  'htmlAppend',
  'jsAppend',
  'cssBody',
  'htmlBody',
  'jsBody',
  'cssPrepend',
  'htmlPrepend',
  'jsPrepend',
  'responseFor'
];
var resProtocols = [
  'filter',
  'enable',
  'disable',
  'ignore',
  'style',
  'delete',
  'headerReplace'
].concat(pureResProtocols);
var binProtocols = [
  'reqPrepend',
  'resPrepend',
  'reqBody',
  'resBody',
  'reqAppend',
  'resAppend'
];
var jsProtocols = ['jsAppend', 'jsBody', 'jsPrepend'];
var cssProtocols = ['cssAppend', 'cssBody', 'cssPrepend'];
var aliasProtocols = {
  ruleFile: 'rulesFile',
  ruleScript: 'rulesFile',
  rulesScript: 'rulesFile',
  reqScript: 'rulesFile',
  reqRules: 'rulesFile',
  resRules: 'resScript',
  pathReplace: 'urlReplace',
  download: 'attachment',
  skip: 'ignore',
  'http-proxy': 'proxy',
  'xhttp-proxy': 'xproxy',
  status: 'statusCode',
  hosts: 'host',
  xhost: 'host',
  html: 'htmlAppend',
  js: 'jsAppend',
  reqMerge: 'params',
  css: 'cssAppend',
  excludeFilter: 'filter',
  includeFilter: 'filter',
  P: 'G'
};
var reqProtocols = protocols.filter(function (name: any) {
  return pureResProtocols.indexOf(name) === -1;
});

var RULE_PROTO_RE = /^([\w.-]+):\/\//;

// @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'exports'. Did you mean 'ports'?
exports.getRuleProto = function(rule: any) {
  if (!RULE_PROTO_RE.test(rule.matcher)) {
    return;
  }
  var proto = RegExp.$1;
  // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  var ruleProto = aliasProtocols[proto];
  if (!ruleProto || ruleProto === 'filter') {
    return proto;
  }
  if (ruleProto === 'rulesFile') {
    return 'reqScript';
  }
  if (ruleProto === 'urlReplace') {
    return 'pathReplace';
  }
  if (ruleProto === 'params') {
    return 'reqMerge';
  }
  return ruleProto;
};

// @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'exports'. Did you mean 'ports'?
exports.multiMatchs = [
  'G',
  'ignore',
  'enable',
  'filter',
  'disable',
  'plugin',
  'delete',
  'style',
  'trailers',
  'urlParams',
  'params',
  'headerReplace',
  'reqHeaders',
  'resHeaders',
  'reqCors',
  'resCors',
  'reqCookies',
  'resCookies',
  'reqReplace',
  'urlReplace',
  'resReplace',
  'resMerge',
  'reqBody',
  'reqPrepend',
  'resPrepend',
  'reqAppend',
  'resAppend',
  'resBody',
  'htmlAppend',
  'jsAppend',
  'cssAppend',
  'htmlBody',
  'jsBody',
  'cssBody',
  'htmlPrepend',
  'jsPrepend',
  'cssPrepend',
  'rulesFile',
  'resScript'
];
// @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'exports'. Did you mean 'ports'?
exports.protocols = protocols;
// @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'exports'. Did you mean 'ports'?
exports.pureResProtocols = pureResProtocols;
// @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'exports'. Did you mean 'ports'?
exports.reqProtocols = reqProtocols;
// @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'exports'. Did you mean 'ports'?
exports.resProtocols = resProtocols;
// @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'exports'. Did you mean 'ports'?
exports.aliasProtocols = aliasProtocols;

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
function getRules() {
  return resetRules({});
}

// @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'exports'. Did you mean 'ports'?
exports.getRules = getRules;

function isBinProtocol(protocol: any) {
  if (binProtocols.indexOf(protocol) != -1) {
    return 1;
  }
  if (jsProtocols.indexOf(protocol) != -1) {
    return 2;
  }
  if (cssProtocols.indexOf(protocol) != -1) {
    return 3;
  }
}

// @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'exports'. Did you mean 'ports'?
exports.isBinProtocol = isBinProtocol;

function resetRules(rules: any) {
  protocols.forEach(function (protocol: any) {
    rules[protocol] = [];
  });
  rules._localRule = [];
  rules._bodyFilters = [];
  rules._clientCerts = [];
  rules.rule.isRuleProto = true;
  return rules;
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.resetRules = resetRules;

function isResRule(protocol: any) {
  return resProtocols.indexOf(protocol) != -1;
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.isResRule = isResRule;

function isWebProtocol(protocol: any) {
  return protocol == 'http:' || protocol == 'https:';
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.isWebProtocol = isWebProtocol;

function isWebsocketProtocol(protocol: any) {
  return protocol == 'ws:' || protocol == 'wss:';
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.isWebsocketProtocol = isWebsocketProtocol;

function isFileProxy(protocol: any) {
  return RULE_RE.test(protocol);
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.isFileProxy = isFileProxy;

function contains(name: any) {
  if (
    protocols.indexOf(name) != -1 ||
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    aliasProtocols[name] ||
    PROXY_RE.test(name)
  ) {
    return true;
  }
  name += ':';
  return (
    isWebsocketProtocol(name) ||
    isWebProtocol(name) ||
    isFileProxy(name) ||
    name == 'tunnel:'
  );
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.contains = contains;
