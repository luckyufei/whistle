// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var zlib = require('zlib');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var Limiter = require('async-limiter');

var limiter = new Limiter({ concurrency: 10 });

function createConvenienceMethod(ctor: any, sync: any) {
  return function (buffer: any, opts: any, callback: any) {
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }
    return zlibBuffer(new ctor(opts), buffer, callback);
  };
}

function zlibBuffer(engine: any, buffer: any, callback: any) {
  engine.buffers = [];
  engine.nread = 0;
  engine.cb = callback;
  engine.on('data', zlibBufferOnData);
  engine.on('error', zlibBufferOnError);
  engine.on('end', zlibBufferOnEnd);
  engine.end(buffer);
}

function zlibBufferOnData(this: any, chunk: any) {
  if (!this.buffers) this.buffers = [chunk];
  else this.buffers.push(chunk);
  this.nread += chunk.length;
}

function zlibBufferOnError(this: any, err: any) {
  this.removeAllListeners('end');
  this.cb(err);
}

function zlibBufferOnEnd(this: any) {
  var buf;
  var err;
  var bufs = this.buffers;
  buf = bufs.length === 1 ? bufs[0] : Buffer.concat(bufs, this.nread);
  this.close();
  if (err) this.cb(err);
  else if (this._info) this.cb(null, { buffer: buf, engine: this });
  else this.cb(null, buf);
}

var inflate = createConvenienceMethod(zlib.Inflate, false);
var gunzip = createConvenienceMethod(zlib.Gunzip, false);
var inflateRaw = createConvenienceMethod(zlib.InflateRaw, false);

function unzip(encoding: any, body: any, callback: any) {
  if (body && typeof encoding === 'string') {
    encoding = encoding.trim().toLowerCase();
    if (encoding === 'gzip') {
      if (body[0] !== 31 || body[1] !== 139) {
        callback(null, body);
        return true;
      }
      limiter.push(function (done: any) {
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
        gunzip(body, function (err: any, data: any) {
          done();
          callback(err, data);
        });
      });
      return;
    }
    if (encoding === 'deflate') {
      limiter.push(function (done: any) {
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
        inflate(body, function (err: any, data: any) {
          if (!err) {
            done();
            return callback(null, data);
          }
          // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
          inflateRaw(body, function (e2: any, data2: any) {
            done();
            callback(e2, data2);
          });
        });
      });
      return;
    }
  }
  callback(null, body);
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  unzip: unzip,
  inflate: inflate,
  gunzip: gunzip,
  inflateRaw: inflateRaw
};
