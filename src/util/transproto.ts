// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var Buffer = require('safe-buffer').Buffer;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var Transform = require('stream').Transform;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var bufUtil = require('./buf-util');

// @ts-expect-error ts-migrate(2403) FIXME: Subsequent variable declarations must have the sam... Remove this comment to see the full error message
var OPTIONS = { highWaterMark: 0 };
var LF = Buffer.from('\n');

function getBuffer(data: any) {
  return !data || Buffer.isBuffer(data) ? data : Buffer.from(String(data));
}

function pack(data: any) {
  if (!data) {
    return Buffer.from('\n0\n');
  }
  return Buffer.concat([Buffer.from('\n' + data.length + '\n'), data]);
}

// @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'exports'. Did you mean 'ports'?
exports.pack = function (data: any) {
  return pack(getBuffer(data));
};

// @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'exports'. Did you mean 'ports'?
exports.getEncodeTransform = function () {
  var trans = new Transform(OPTIONS);
  trans._transform = function (chunk: any, _: any, cb: any) {
    cb(null, pack(chunk));
  };
  trans.push_ = trans.push;
  trans.push = function (chunk: any, encoding: any) {
    if (chunk) {
      return trans.push_(chunk, encoding);
    }
  };
  trans.end_ = trans.end;
  trans.end = function (chunk: any, encoding: any, callback: any) {
    chunk && trans.write(chunk, encoding, callback);
    return trans.end_(function () {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
      trans.push_(pack());
    });
  };
  return trans;
};

function Parser(this: any) {
  var buf: any;
  var len = 0;
  var parseChunk = function () {
    if (len <= 0) {
      var index = bufUtil.indexOf(buf, LF, 1);
      if (index === -1) {
        return;
      }
      len = parseInt(String(buf.slice(1, index)), 10);
      if (!len) {
        return false;
      }
      buf = buf.slice(index + 1);
      if (!buf.length) {
        return;
      }
    }
    var curLen = len;
    var chunk = buf.slice(0, curLen);
    len -= chunk.length;
    buf = buf.length > curLen ? buf.slice(curLen) : null;
    return chunk;
  };
  var self = this;
  self.write = function (chunk: any) {
    if (chunk) {
      buf = buf ? Buffer.concat([buf, chunk]) : chunk;
    } else if (!buf) {
      return;
    }
    var data = parseChunk();
    if (data === false) {
      return self.onEnd && self.onEnd();
    }
    if (!data) {
      if (chunk === false) {
        return;
      }
      return self.onContinue && self.onContinue();
    }
    self.onData && self.onData(data);
    self.write(false);
  };
}

// @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'exports'. Did you mean 'ports'?
exports.getDecodeTransform = function () {
  var trans = new Transform(OPTIONS);
  // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
  var parser = new Parser();
  var transCb: any, data: any;
  parser.onEnd = function () {
    data && trans.push(data);
    trans.push(null);
  };
  parser.onContinue = function () {
    if (transCb) {
      transCb();
      transCb = null;
    }
  };
  parser.onData = function (chunk: any) {
    data = data ? Buffer.concat([data, chunk]) : chunk;
    if (transCb) {
      transCb(null, data);
      transCb = data = null;
    }
  };
  trans._transform = function (chunk: any, _: any, cb: any) {
    transCb = cb;
    parser.write(chunk);
  };
  return trans;
};
