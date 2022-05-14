// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var fs = require('fs');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var fse = require('fs-extra2');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var path = require('path');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var logger = require('../util/logger');
var ENCODING = { encoding: 'utf8' };

var NAME_RE = /^\d+\.([\s\S]+)$/;
var MAX_COUNT = 200;
// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'noop'.
var noop = function () {};

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
function readFileSafe(file: any, retry: any) {
  try {
    file = fs.readFileSync(file, ENCODING);
  } catch (e) {
    if (retry) {
      file = null;
    } else {
      return readFileSafe(file, true);
    }
  }

  return file || '';
}

function getName(item: any) {
  return item.name;
}

// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'RecycleBin'.
function RecycleBin(this: any, dir: any) {
  fse.ensureDirSync(dir);
  var list: any = [];
  var map = {};
  this._dir = dir;
  fs.readdirSync(dir).forEach(function (name: any) {
    if (NAME_RE.test(name)) {
      var item = {
        name: name,
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
        data: readFileSafe(path.join(dir, name))
      };
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      map[name] = item;
      list.push(item);
    }
  });
  // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'a' implicitly has an 'any' type.
  list.sort(function (a, b) {
    a = a.name;
    b = b.name;
    a = a.substring(0, a.indexOf('.'));
    b = b.substring(0, a.indexOf('.'));
    var aLen = a.length;
    var bLen = b.length;
    return aLen > bLen || (aLen === bLen && a > b) ? -1 : 1;
  });
  if (list.length > MAX_COUNT) {
    // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'item' implicitly has an 'any' type.
    list.slice(MAX_COUNT).forEach(function (item) {
      try {
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        delete map[item.name];
        fs.unlinkSync(path.join(dir, name));
      } catch (e) {}
    });
    list = list.slice(0, MAX_COUNT);
  }
  this._list = list;
  this._map = map;
}

var proto = RecycleBin.prototype;

proto.recycle = function (filename: any, data: any) {
  if (!filename) {
    return;
  }
  try {
    var name = Date.now() + '.' + encodeURIComponent(filename);
    data = data ? data + '' : '';
    var item = {
      name: name,
      data: data
    };
    this._list.unshift(item);
    this._map[name] = item;
    fs.writeFile(path.join(this._dir, name), data, noop);
  } catch (e) {
    logger.error(e);
  }
};

proto.recover = function (name: any) {
  var item = this._map[name];
  if (item) {
    delete this._map[name];
    this._list.splice(this._list.indexOf(item), 1);
    fs.unlink(path.join(this._dir, name), noop);
  }
  return item;
};

proto.remove = proto.recover;

proto.list = function () {
  return this._list.map(getName);
};

proto.getFile = function (name: any) {
  return this._map[name];
};

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = RecycleBin;
