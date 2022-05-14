// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var Pac = require('node-pac');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var net = require('net');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var LRU = require('lru-cache');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var path = require('path');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var parseUrl = require('url').parse;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var extend = require('extend');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var parseQuery = require('querystring').parse;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var lookup = require('./dns');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var Rules = require('./rules');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var values = require('./util').values;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var util = require('../util');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var logger = require('../util/logger');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var fileMgr = require('../util/file-mgr');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var config = require('../config');

var tplCache = new LRU({ max: 36 });
var rulesMgrCache = new LRU({ max: 16 });
var clientCerts = new LRU({ max: 60, maxAge: 1000 * 60 * 60 });
var rules = new Rules();
var tempRules = new Rules();
var cachedPacs = {};
var RULES_HEADER = 'x-whistle-rule-value';
var KV_HEADER = 'x-whistle-key-value';
var KEY_HEADER = 'x-whistle-rule-key';
var HOST_HEADER = 'x-whistle-rule-host';
var LOCALHOST = '127.0.0.1';
var resolveReqRules = rules.resolveReqRules.bind(rules);
var AUTH_RE = /^([^\\/]+)@/;

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.Rules = Rules;
if (config.networkMode && !config.shadowRulesMode) {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
  exports.parse = util.noop;
} else {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
  exports.parse = function (text: any, root: any, _values: any) {
    if (config.pluginsMode || config.shadowRulesMode) {
      text = config.shadowRules || '';
    }
    if (config.shadowValues) {
      _values = _values
        ? extend({}, config.shadowValues, _values)
        : config.shadowValues;
    }
    rules.parse(text, root, _values);
  };
}
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.append = rules.append.bind(rules);
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.resolveSNICallback = rules.resolveSNICallback.bind(rules);
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.resolveHost = rules.resolveHost.bind(rules);
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.resolveInternalHost = rules.resolveInternalHost.bind(rules);
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.resolveProxy = rules.resolveProxy.bind(rules);
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.resolveEnable = rules.resolveEnable.bind(rules);
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.hasReqScript = rules.hasReqScript.bind(rules);
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.resolveDisable = rules.resolveDisable.bind(rules);
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.resolvePipe = rules.resolvePipe.bind(rules);
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.resolveRule = rules.resolveRule.bind(rules);
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.resolveRules = resolveReqRules;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.resolveResRules = rules.resolveResRules.bind(rules);
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.resolveBodyFilter = rules.resolveBodyFilter.bind(rules);
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.lookupHost = rules.lookupHost.bind(rules);
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.resolveLocalRule = rules.resolveLocalRule.bind(rules);
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.clearAppend = rules.clearAppend.bind(rules);

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.disableDnsCache = function () {
  Rules.disableDnsCache();
};

var dnsResolve = function (host: any, callback: any) {
  return lookup(host, callback || util.noop, true);
};
var PROXY_HOSTS_RE = /[?&]proxyHosts?(?:&|$)/i;
var P_HOST_RE = /[?&]host=([\w.:-]+)(?:&|$)/i;

function isProxyHost(req: any, proxy: any, host: any) {
  if (proxy) {
    req._proxyTunnel =
      isLineProp(proxy, 'proxyTunnel') ||
      isLineProp(host, 'proxyTunnel') ||
      util.isEnable(req, 'proxyTunnel') ||
      isProxyEnable(req, 'proxyTunnel');
    if (isLineProp(proxy, 'proxyHost')) {
      return true;
    }
  }
  return isLineProp(host, 'proxyHost');
}

function isProxyEnable(req: any, name: any) {
  var props = req._proxyProps;
  if (props === undefined) {
    props = rules.resolveProxyProps(req);
    req._proxyProps = props || null;
  }
  return props && util.isEnable(props, name);
}

function isLineProp(rule: any, name: any) {
  return rule && rule.lineProps[name];
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getProxy = function (url: any, req: any, callback: any) {
  if (!req) {
    return callback();
  }
  var reqRules = req.rules;
  req.curUrl = url;
  if (!reqRules) {
    return rules.lookupHost(req, callback);
  }

  delete reqRules.proxy;
  delete reqRules.pac;
  var pRules = req.pluginRules;
  var fRules = req.rulesFileMgr;
  if (fRules) {
    fRules._values = req._scriptValues;
  }
  var hRules = req.headerRulesMgr;
  var filter = extend(
    rules.resolveFilter(req),
    pRules && pRules.resolveFilter(req),
    fRules && fRules.resolveFilter(req),
    hRules && hRules.resolveFilter(req)
  );
  var ignoreProxy;
  var proxy;
  var pacRule: any;
  var host = rules.getHost(req, pRules, fRules, hRules);
  var hostValue = util.getMatcherValue(host) || '';
  if (config.multiEnv || req._headerRulesFirst) {
    proxy =
      (pRules && pRules.resolveProxy(req, hostValue)) ||
      (hRules && hRules.resolveProxy(req, hostValue)) ||
      rules.resolveProxy(req, hostValue) ||
      (fRules && fRules.resolveProxy(req, hostValue));
  } else {
    proxy =
      (pRules && pRules.resolveProxy(req, hostValue)) ||
      rules.resolveProxy(req, hostValue) ||
      (fRules && fRules.resolveProxy(req, hostValue)) ||
      (hRules && hRules.resolveProxy(req, hostValue));
  }
  var proxyHostOnly = isLineProp(proxy, 'proxyHostOnly');
  var proxyHost =
    proxyHostOnly ||
    util.isEnable(req, 'proxyHost') ||
    isProxyEnable(req, 'proxyHost');
  if (proxy) {
    var protocol = proxy.matcher.substring(0, proxy.matcher.indexOf(':'));
    ignoreProxy =
      !filter['ignore:' + protocol] &&
      (util.isIgnored(filter, 'proxy') || util.isIgnored(filter, protocol));
    if (ignoreProxy) {
      proxy = null;
    } else {
      proxyHost = proxyHost || PROXY_HOSTS_RE.test(proxy.matcher);
    }
  }

  if (!ignoreProxy) {
    proxyHost = isProxyHost(req, proxy, host) || proxyHost; // 不能调换顺序
  }
  var setHost = function () {
    if (!host || req._isProxyReq) {
      return false;
    }
    reqRules.host = host;
    var hostname = util.removeProtocol(host.matcher, true);
    if (!net.isIP(hostname)) {
      req.curUrl = hostname || url;
      return rules.lookupHost(req, function (err: any, ip: any) {
        callback(err, ip, host.port, host);
      });
    }
    callback(null, hostname, host.port, host);
    return true;
  };
  var resolvePacRule = function () {
    if (pacRule != null) {
      return;
    }
    if (util.isIgnored(filter, 'pac')) {
      pacRule = false;
      return;
    }
    if (config.multiEnv || req._headerRulesFirst) {
      pacRule =
        (pRules && pRules.resolvePac(req)) ||
        (hRules && hRules.resolvePac(req)) ||
        rules.resolvePac(req) ||
        (fRules && fRules.resolvePac(req)) ||
        false;
    } else {
      pacRule =
        (pRules && pRules.resolvePac(req)) ||
        rules.resolvePac(req) ||
        (fRules && fRules.resolvePac(req)) ||
        (hRules && hRules.resolvePac(req)) ||
        false;
    }
    if (pacRule) {
      proxyHostOnly = isLineProp(pacRule, 'proxyHostOnly');
      proxyHost =
        proxyHost || proxyHostOnly || isLineProp(pacRule, 'proxyHost');
    }
  };
  if (host) {
    if (!proxyHost && !ignoreProxy) {
      resolvePacRule();
    }
    if (proxyHost) {
      req._phost = parseUrl(util.setProtocol(host.matcher + (host.port ? ':' + host.port : '')));
    } else if (
      !isLineProp(proxy, 'proxyFirst') &&
      !isLineProp(host, 'proxyFirst') &&
      !util.isEnable(req, 'proxyFirst') &&
      !isProxyEnable(req, 'proxyFirst')
    ) {
      return setHost();
    }
    proxyHost = true;
    reqRules.host = host;
    req._enableProxyHost = true;
  }
  if (ignoreProxy || (proxyHostOnly && !req._phost)) {
    req.curUrl = url;
    return setHost() || rules.lookupHost(req, callback);
  }
  if (proxy) {
    if (!req._phost && P_HOST_RE.test(proxy.matcher)) {
      req._phost = parseUrl(util.setProtocol(RegExp.$1));
    }
    reqRules.proxy = proxy;
    return callback();
  }
  resolvePacRule();
  var pacUrl = util.getMatcherValue(pacRule);
  if (!pacUrl) {
    return setHost() || callback();
  }
  if (AUTH_RE.test(pacUrl)) {
    var auth = RegExp.$1;
    req._pacAuth = auth;
    pacUrl = pacUrl.substring(auth.length + 1);
  }
  pacUrl = /^https?\:\/\//.test(pacUrl)
    ? pacUrl
    : util.join(pacRule.root, pacUrl);
  // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  var pac = cachedPacs[pacUrl];
  if (pac) {
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    delete cachedPacs[pacUrl];
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    cachedPacs[pacUrl] = pac;
  } else {
    var list = Object.keys(cachedPacs);
    if (list.length >= 10) {
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      delete cachedPacs[list[0]];
    }
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    cachedPacs[pacUrl] = pac = new Pac(pacUrl, dnsResolve);
  }
  reqRules.pac = pacRule;
  return pac.findWhistleProxyForURL(
    url.replace('tunnel:', 'https:'),
    function (err: any, rule: any) {
      if (rule) {
        tempRules.parse(pacRule.rawPattern + ' ' + rule);
        req.curUrl = url;
        if ((proxy = tempRules.resolveProxy(req, hostValue))) {
          // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
          proxyHost = isProxyHost(req, proxy) || proxyHost; // 不能调换顺序
          req._proxyTunnel =
            req._proxyTunnel || isLineProp(pacRule, 'proxyTunnel');
          var protocol = proxy.matcher.substring(0, proxy.matcher.indexOf(':'));
          if (!util.isIgnored(filter, protocol)) {
            reqRules.proxy = proxy;
            reqRules.proxy.raw = pacRule.raw;
          }
        }
      }
      if (reqRules.proxy) {
        (!proxyHost && setHost()) || callback();
      } else {
        req.curUrl = url;
        setHost() || rules.lookupHost(req, callback);
      }
      logger.error(err);
    }
  );
};

function tpl(str: any, data: any) {
  if (
    typeof str !== 'string' ||
    str.indexOf('<%') === -1 ||
    str.indexOf('%>') === -1
  ) {
    return str + '';
  }
  var key = str;
  var fn = tplCache.get(key);
  if (!fn) {
    str = str
      .replace(/[\u2028\u2029]/g, '')
      .replace(/\t/g, ' ')
      .replace(/\r?\n|\r/g, '\t')
      .split('<%')
      .join('\u2028')
      .replace(/((^|%>)[^\u2028]*)'/g, '$1\r')
      .replace(/\u2028=(.*?)%>/g, '\',$1,\'')
      .split('\u2028')
      .join('\');')
      .split('%>')
      .join('p.push(\'')
      .split('\r')
      .join('\\\'');
    try {
      fn = new Function(
        'obj',
        'var p=[],print=function(){p.push.apply(p,arguments);};' +
          'with(obj){p.push(\'' +
          str +
          '\');}return p.join(\'\');'
      );
    } catch (e) {
      fn = e;
      throw e;
    } finally {
      tplCache.set(key, fn);
    }
  } else if (typeof fn !== 'function') {
    throw fn;
  }
  return fn(data || {}).replace(/\t/g, '\n');
}

function getScriptContext(req: any, res: any, body: any, pattern: any) {
  var ip = req.clientIp || LOCALHOST;
  var ctx = req.scriptContenxt;
  if (!ctx) {
    var headers = extend(true, {}, req.headers);
    ctx = req.scriptContenxt = {
      pattern: pattern,
      version: config.version,
      port: config.port,
      uiHost: 'local.wproxy.org',
      uiPort: config.uiport,
      url: req.fullUrl,
      method: util.toUpperCase(req.method) || 'GET',
      httpVersion: req.httpVersion || '1.1',
      isLocalAddress: function (_ip: any) {
        return util.isLocalAddress(_ip || ip);
      },
      ip: ip,
      clientIp: ip,
      clientPort: req.clientPort,
      headers: headers,
      reqHeaders: headers,
      body: body || '',
      reqScriptData: {},
      res: null
    };
  }
  ctx.rules = [];
  ctx.values = {};
  ctx.value = req.globalValue;
  ctx.getValue = function (key: any, onlyValues: any) {
    var value = !onlyValues && req._inlineValues && req._inlineValues[key];
    return typeof value === 'string' ? value : values.get(key);
  };
  ctx.parseUrl = parseUrl;
  ctx.parseQuery = parseQuery;
  ctx.tpl = ctx.render = tpl;
  if (res) {
    ctx.statusCode = res.statusCode;
    ctx.serverIp = req.hostIp || LOCALHOST;
    ctx.resHeaders = extend(true, {}, res.headers);
  } else {
    ctx.statusCode = '';
    ctx.serverIp = '';
    ctx.resHeaders = '';
  }
  return ctx;
}

function getReqPayload(req: any, res: any, cb: any) {
  if (res) {
    return cb();
  }
  if (req.getPayload && util.hasRequestBody(req)) {
    if (typeof req._reqBody === 'string') {
      cb(req._reqBody);
    } else {
      req.getPayload(function (_: any, payload: any) {
        cb(fileMgr.decode(payload));
      });
    }
  } else {
    cb();
  }
}

function execRulesScript(script: any, req: any, res: any, body: any, pattern: any) {
  var context = getScriptContext(req, res, body, pattern);
  if (util.execScriptSync(script, context) && Array.isArray(context.rules)) {
    return {
      rules: context.rules.join('\n').trim(),
      values: context.values
    };
  }
  return '';
}
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.execRulesScript = execRulesScript;

function handleDynamicRules(script: any, req: any, res: any, cb: any) {
  util.getRuleValue(script, function (list: any) {
    var scriptItem, index: any, text: any;
    if (list) {
      index = script.scriptIndex;
      scriptItem = script.list[index];
      text = scriptItem && list[index];
    }
    if (!scriptItem || util.isRulesContent(text)) {
      return cb(list && list.join('\n'));
    }
    getReqPayload(req, res, function (body: any) {
      var result = execRulesScript(text, req, res, body, script.rawPattern);
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'rules' does not exist on type 'string | ... Remove this comment to see the full error message
      list[index] = result.rules;
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'values' does not exist on type 'string |... Remove this comment to see the full error message
      cb(list.join('\n'), result.values);
    });
  }, null, null, null, req);
}

function resolveRulesFile(req: any, callback: any) {
  if (req.rules.G) {
    var varMap = {};
    var globalValue: any;
    var pList: any;
    req.rules.G.list.forEach(function (item: any) {
      if (item.matcher[0] !== 'P') {
        if (!globalValue) {
          globalValue = item;
        }
        return;
      }
      var value = util.getMatcherValue(item);
      var index = value.indexOf('=');
      if (index !== -1) {
        var name = value.substring(0, index);
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
        var plugin = exports.getPlugin(name);
        if (!plugin || !plugin.pluginVars) {
          return;
        }
        value = value.substring(index + 1);
        if (value) {
          pList = pList || [];
          pList.push(item);
          // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          var list = varMap[name] || [];
          // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          varMap[name] = list;
          if (list.indexOf(value) === -1) {
            list.push(value);
          }
        }
      }
    });
    req._pluginVars = varMap;
    req.rules.P = pList;
    req.rules.G = globalValue;
    req.globalValue = util.getMatcherValue(globalValue);
  }
  handleDynamicRules(req.rules.rulesFile, req, null, function (text: any, vals: any) {
    if (text) {
      var rulesFileMgr = rulesMgrCache.get(text);
      if (!rulesFileMgr) {
        rulesFileMgr = new Rules(vals);
        rulesFileMgr.parse(text);
        rulesMgrCache.set(text, rulesFileMgr);
      }
      rulesFileMgr._values = vals;
      req._scriptValues = vals;
      req.rulesFileMgr = rulesFileMgr;
      req.curUrl = req.fullUrl;
      text = req.rulesFileMgr.resolveReqRules(req);
    }
    // 不能放到if里面
    util.mergeRules(req, text);
    callback();
  });
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.resolveRulesFile = resolveRulesFile;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.resolveResRulesFile = function (req: any, res: any, callback: any) {
  handleDynamicRules(
    req.rules && req.rules.resScript,
    req,
    res,
    function (text: any, vals: any) {
      text = text && text.trim();
      callback(
        text && {
          text: text,
          values: vals
        }
      );
    }
  );
};

function getValue(req: any, key: any, keep: any) {
  var value = req.headers[key];
  if (value) {
    if (!keep && config.strict) {
      value = null;
    } else {
      req.rulesHeaders[key] = value;
    }
    delete req.headers[key];
  }
  try {
    return value && decodeURIComponent(value);
  } catch (e) {}
  return value;
}

function initHeaderRules(req: any, needBodyFilters: any) {
  if (req._bodyFilters !== undefined) {
    return;
  }
  req._bodyFilters = null;
  req.rulesHeaders = {};
  var isPluginReq = req.isPluginReq && !req._isProxyReq;
  req._headerRulesFirst = isPluginReq;
  var rulesHeader = getValue(req, RULES_HEADER, isPluginReq);
  // @ts-expect-error ts-migrate(2575) FIXME: No overload expects 2 arguments, but overloads do ... Remove this comment to see the full error message
  var hostHeader = util.trimStr(getValue(req, HOST_HEADER));
  // @ts-expect-error ts-migrate(2575) FIXME: No overload expects 2 arguments, but overloads do ... Remove this comment to see the full error message
  var keyHeader = util.trimStr(getValue(req, KEY_HEADER));
  var kvHeader = getValue(req, KV_HEADER, isPluginReq);

  var ruleValue = util.trimStr(rulesHeader);
  if (hostHeader) {
    ruleValue = ruleValue + '\n' + hostHeader;
  }
  if (keyHeader) {
    keyHeader = util.trimStr(values.get(keyHeader));
    if (keyHeader) {
      ruleValue = keyHeader + '\n' + ruleValue;
    }
  }
  var curVars = rules._globalPluginVars;
  var value;
  req._globalPluginVars = {};
  if (ruleValue) {
    var rulesMgr = new Rules(util.parseJSON(kvHeader));
    rulesMgr.parse(ruleValue);
    req.headerRulesMgr = rulesMgr;
    var bodyFilters = needBodyFilters && rulesMgr._rules._bodyFilters;
    if (bodyFilters && bodyFilters.length) {
      req._bodyFilters = rules._rules._bodyFilters.concat(bodyFilters);
    }
    var headerVars = rulesMgr._globalPluginVars;
    var vars = extend({}, curVars, headerVars);
    Object.keys(vars).forEach(function (key) {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
      var plugin = exports.getPlugin(key);
      if (!plugin || !plugin.pluginVars) {
        return;
      }
      var headerVal = headerVars[key];
      var curVal = curVars[key];
      if (curVal && headerVal) {
        vars[key] = headerVal.concat(curVal);
      }
      value = vars[key];
      req._globalPluginVars[key] = value;
    });
  } else {
    Object.keys(curVars).forEach(function (key) {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
      if (!exports.getPlugin || exports.getPlugin(key)) {
        value = curVars[key];
        req._globalPluginVars[key] = value;
      }
    });
  }
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.initHeaderRules = initHeaderRules;

function initRules(req: any) {
  var fullUrl = req.fullUrl || util.getFullUrl(req);
  req.curUrl = fullUrl;
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
  initHeaderRules(req);
  if (req.headerRulesMgr) {
    if (config.multiEnv || req._headerRulesFirst) {
      req.rules = resolveReqRules(req);
      util.mergeRules(req, req.headerRulesMgr.resolveReqRules(req));
    } else {
      req.rules = req.headerRulesMgr.resolveReqRules(req);
      util.mergeRules(req, resolveReqRules(req));
    }
  } else {
    req.rules = resolveReqRules(req);
  }
  return req.rules;
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.initRules = initRules;

var HTTPS_RE = /^(?:ws|http)s:\/\//;

function checkCache(cacheKey: any, callback: any) {
  var result = clientCerts.peek(cacheKey);
  if (result) {
    if (result.pending) {
      result.push(callback);
    } else {
      callback(result);
    }
    return true;
  } else {
    result = [callback];
    result.pending = true;
    clientCerts.set(cacheKey, result);
  }
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getClientCert = function (req: any, cb: any) {
  if (!req) {
    return cb();
  }
  req.curUrl = req.realUrl || req.fullUrl;
  if (!HTTPS_RE.test(req.curUrl)) {
    return cb();
  }
  var pRules = req.pluginRules;
  var fRules = req.rulesFileMgr;
  var hRules = req.headerRulesMgr;
  var rule;
  if (config.multiEnv || req._headerRulesFirst) {
    rule =
      (pRules && pRules.resolveClientCert(req)) ||
      (hRules && hRules.resolveClientCert(req)) ||
      rules.resolveClientCert(req) ||
      (fRules && fRules.resolveClientCert(req));
  } else {
    rule =
      (pRules && pRules.resolveClientCert(req)) ||
      rules.resolveClientCert(req) ||
      (fRules && fRules.resolveClientCert(req)) ||
      (hRules && hRules.resolveClientCert(req));
  }
  if (!rule) {
    return cb();
  }
  req.rules.clientCert = rule;
  var matcher = rule.matcher.substring(17);
  matcher = matcher && util.parseJSON(matcher);
  if (!matcher) {
    return cb();
  }
  var base = util.getString(matcher.base);
  var key = util.getString(matcher.key);
  var cert = util.getString(matcher.cert);
  var cacheKey: any;
  try {
    if (key && cert) {
      if (base) {
        key = path.join(base, key);
        cert = path.join(base, cert);
      }
      cacheKey = 'cert\n' + key + '\n' + cert;
      if (
        checkCache(cacheKey, function (data: any) {
          if (data) {
            cb(data[0], data[1], false, cacheKey);
          } else {
            cb();
          }
        })
      ) {
        return;
      }
      return fileMgr.readFileList([key, cert], function (data: any) {
        var list = clientCerts.peek(cacheKey);
        if (data[0] && data[1] && data[0].length && data[1].length) {
          clientCerts.set(cacheKey, data);
        } else {
          clientCerts.del(cacheKey);
          data = '';
        }
        list.forEach(function (fn: any) {
          fn(data);
        });
      });
    }
    var pwd = util.getString(matcher.pwd || matcher.passphrase);
    var pfx = util.getString(matcher.pfx);
    if (pfx) {
      if (base) {
        pfx = path.join(base, key);
      }
      cacheKey = 'pfx\n' + pwd + '\n' + pfx;
      if (
        checkCache(cacheKey, function (buf: any) {
          if (buf) {
            cb(pwd, buf, true, cacheKey);
          } else {
            cb();
          }
        })
      ) {
        return;
      }
      return fileMgr.readFile(pfx, function (buf: any) {
        var list = clientCerts.peek(cacheKey);
        if (buf && buf.length) {
          clientCerts.set(cacheKey, buf);
        } else {
          clientCerts.del(cacheKey);
          buf = '';
        }
        list.forEach(function (fn: any) {
          fn(buf);
        });
      });
    }
  } catch (e) {}
  cb();
};
