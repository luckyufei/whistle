// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var Transform = require('pipestream').Transform;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var util = require('util');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var iconv = require('iconv-lite');

var LT_RE = /^\s*</;
var JSON_RE = /^\s*[\[\{]/;

// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'WhistleTransform'.
function WhistleTransform(this: any, options: any) {
  Transform.call(this);
  options = options || {};
  // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
  var value = parseInt((options.speed * 1000) / 8);
  if (value > 0) {
    this._speed = value;
  }
  if ((value = parseInt(options.delay)) > 0) {
    this._delay = value;
  }

  var charset = options.charset && String(options.charset);
  if (!iconv.encodingExists(charset)) {
    charset = 'utf8';
  }
  this._body = getBuffer(options, 'body', charset);
  this._top = getBuffer(options, 'top', charset);
  this._bottom = getBuffer(options, 'bottom', charset);
  if (this._body || this._top || this._bottom) {
    if (options.strictHtml) {
      this._strictHtml = true;
    } else if (options.safeHtml) {
      this._safeHtml = true;
    }
  }
}

function getBuffer(options: any, name: any, charset: any) {
  var buf = options[name];
  return buf == null || Buffer.isBuffer(buf)
    ? buf
    : iconv.encode(buf + '', charset);
}

util.inherits(WhistleTransform, Transform);

WhistleTransform.prototype.allowInject = function (chunk: any) {
  if (!chunk || (!this._strictHtml && !this._safeHtml)) {
    return true;
  }
  return this._strictHtml
    ? LT_RE.test(chunk.toString())
    : !JSON_RE.test(chunk.toString());
};

WhistleTransform.prototype._transform = function (chunk: any, encoding: any, callback: any) {
  var self = this;
  var cb = function () {
    if (self._allowInject && self._ended && self._bottom) {
      chunk = chunk ? Buffer.concat([chunk, self._bottom]) : self._bottom;
      self._bottom = null;
    }
    if (chunk && self._speed) {
      setTimeout(function () {
        callback(null, chunk);
      }, Math.round((chunk.length * 1000) / self._speed));
    } else {
      callback(null, chunk);
    }
  };

  if (!self._ended) {
    self._ended = !chunk;
  }

  if (!self._inited) {
    self._allowInject = self.allowInject(chunk);
    self._inited = true;
    if (self._allowInject) {
      if (self._body) {
        self._ended = true;
        chunk = self._body;
      }
      if (self._top) {
        chunk = chunk ? Buffer.concat([self._top, chunk]) : self._top;
        self._top = null;
      }
    }
    return self._delay ? setTimeout(cb, self._delay) : cb();
  }

  if (self._ended) {
    chunk = null;
  }

  cb();
};

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = WhistleTransform;
