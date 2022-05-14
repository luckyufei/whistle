// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var PassThrough = require('stream').PassThrough;

// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'noop'.
var noop = function () {};

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function (stream: any, endHandler: any) {
  if (stream._hasAlreadyDrain || (!stream.noReqBody && stream.useH2)) {
    return typeof endHandler == 'function' && endHandler();
  }
  stream._hasAlreadyDrain = true;
  var emitEndStream = new PassThrough();
  emitEndStream.on('data', noop).on('error', noop);
  emitEndStream.on('end', endHandler);
  stream.pipe(emitEndStream);
};
