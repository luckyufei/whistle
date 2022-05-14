// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'parse'.
var parse = require('url').parse;

var URL_RE = /^([a-z0-9.+-]+:)\/\/([^/?#]+)(\/[^?#]*)?(\?[^#]*)?(#.*)?$/i;
var HOST_RE = /^(.+)(?::(\d*))$/;
var BRACKET_RE = /^\[|\]$/g;

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function (url: any) {
  if (!URL_RE.test(url)) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 1.
    return parse(url);
  }
  var protocol = RegExp.$1;
  var host = RegExp.$2;
  var pathname = RegExp.$3 || '/';
  var search = RegExp.$4;
  var hash = RegExp.$5 || null;
  var port = null;
  var hostname = host;
  if (HOST_RE.test(host)) {
    hostname = RegExp.$1;
    port = RegExp.$2;
  }

  return {
    protocol: protocol,
    slashes: true,
    auth: null,
    host: host,
    port: port,
    hostname: hostname.replace(BRACKET_RE, ''),
    hash: hash,
    search: search || null,
    query: search ? search.substring(1) : null,
    pathname: pathname,
    path: pathname + search,
    href: url
  };
};
