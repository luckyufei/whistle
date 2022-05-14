// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var Transform = require('pipestream').Transform;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var util = require('util');

// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'SpeedTransform'.
function SpeedTransform(this: any, options: any) {
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
}

util.inherits(SpeedTransform, Transform);

SpeedTransform.prototype._transform = function (chunk: any, encoding: any, callback: any) {
  var self = this;
  var cb = function () {
    if (chunk && self._speed) {
      setTimeout(function () {
        callback(null, chunk);
      }, Math.round((chunk.length * 1000) / self._speed));
    } else {
      callback(null, chunk);
    }
  };

  if (self._delay) {
    var delay = self._delay;
    self._delay = null;
    return setTimeout(cb, delay);
  }

  cb();
};

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = SpeedTransform;
