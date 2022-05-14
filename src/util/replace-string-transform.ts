// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var Transform = require('pipestream').Transform;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var util = require('util');

// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'ReplaceStringTransform'.
function ReplaceStringTransform(this: any, str: any, value: any) {
  Transform.call(this);
  this._str = str;
  this._length = this._str.length;
  this._value = value == null ? '' : value + '';
  this._rest = '';
}

util.inherits(ReplaceStringTransform, Transform);

var proto = ReplaceStringTransform.prototype;
proto._transform = function (chunk: any, encoding: any, callback: any) {
  if (chunk != null) {
    chunk = this._rest + chunk;
    var minIndex = chunk.length + 1 - this._length;
    var index = chunk.lastIndexOf(this._str);

    if (index != -1) {
      index = Math.max(minIndex, index + this._length);
    } else {
      index = minIndex;
    }
    this._rest = chunk.substring(index);
    chunk = chunk.substring(0, index);
  } else {
    chunk = this._rest;
  }

  callback(null, replace(chunk, this._str, this._value));
};

function replace(chunk: any, str: any, value: any) {
  return chunk ? chunk.split(str).join(value) : null;
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ReplaceStringTransform;
