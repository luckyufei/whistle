// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var qs = require('querystring');

var TOKEN_RE = /\r\u0000\n\u0003\r/g;
var PLUS_RE = /\+/g;
var TOKEN = '\r\u0000\n\u0003\r';

var decoder = {
  decodeURIComponent: function (s: any) {
    s = s.replace(TOKEN_RE, '+');
    return qs.unescape(s);
  }
};
var rawDecoder = {
  decodeURIComponent: function (s: any) {
    return s.replace(TOKEN_RE, '+');
  }
};
var rawDecoder2 = {
  decodeURIComponent: function (s: any) {
    return s;
  }
};

// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'parse'.
function parse(str: any, sep: any, eq: any, escape: any) {
  try {
    if (str.indexOf('+') === -1 || str.indexOf(TOKEN) !== -1) {
      return qs.parse(str, sep, eq, escape ? rawDecoder2 : undefined);
    }
    str = str.replace(PLUS_RE, TOKEN);
    return qs.parse(str, sep, eq, escape ? rawDecoder : decoder);
  } catch (e) {}
  return '';
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = parse;
