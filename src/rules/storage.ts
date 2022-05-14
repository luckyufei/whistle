// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var fs = require('fs');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var fse = require('fs-extra2');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var path = require('path');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var logger = require('../util/logger');
// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'RecycleBin'.
var RecycleBin = require('./recycle-bin');

var ENCODING = { encoding: 'utf8' };
var RETRY_INTERVAL = 16000;
var ASCII_RE = /[\x00-\x7f]/g;
var MAX_FILENAME_LEN = 254;
var EMPTY_ARR: any = [];

function encodeName(index: any, name: any) {
  var filename;
  try {
    filename = index + '.' + encodeURIComponent(name);
    if (filename.length <= MAX_FILENAME_LEN) {
      return filename;
    }
  } catch (e) {}
  try {
    filename = index + '.' + name.replace(ASCII_RE, encodeURIComponent);
    if (filename.length <= MAX_FILENAME_LEN) {
      return filename;
    }
  } catch (e) {
    logger.error(e);
  }
  return index + '.' + name;
}

// @ts-expect-error ts-migrate(7023) FIXME: 'readFileSafe' implicitly has return type 'any' be... Remove this comment to see the full error message
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

// @ts-expect-error ts-migrate(7023) FIXME: 'readJsonSafe' implicitly has return type 'any' be... Remove this comment to see the full error message
function readJsonSafe(file: any, retry: any) {
  try {
    file = fs.readFileSync(file, ENCODING);
    file = file && JSON.parse(file);
  } catch (e) {
    if (retry) {
      file = null;
    } else {
      return readJsonSafe(file, true);
    }
  }

  return file;
}

function copyFileObj(file: any) {
  if (!file) {
    return file;
  }

  return {
    index: file.index,
    name: file.name,
    data: file.data,
    selected: file.selected
  };
}

// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'noop'.
function noop() {}

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
function compare(v1: any, v2: any) {
  return v1 == v2 ? 0 : v1 > v2 ? 1 : -1;
}

// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'Storage'.
function Storage(this: any, dir: any, filters: any, disabled: any) {
  var self = this;
  // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
  self.recycleBin = new RecycleBin(path.join(dir, '.recycle_bin'));
  var backupDir = path.join(dir, '.backup');
  fse.ensureDirSync(dir);
  fse.ensureDirSync(backupDir);

  self._disabled = disabled === true;
  self._backupDir = backupDir;
  self._files = path.join(dir, 'files');
  self._properties = path.join(dir, 'properties');
  self._backupProps = path.join(backupDir, 'properties');
  fse.ensureDirSync(self._files);
  fse.ensureFileSync(self._properties);

  var maxIndex = -1;
  var files = {};
  var fileNames = { properties: true };

  filters = filters || {};
  fs.readdirSync(self._files).forEach(function (file: any) {
    if (!/^(\d+)\.(.+)$/.test(file)) {
      return;
    }
    var index = parseInt(RegExp.$1, 10);
    var filename = RegExp.$2;
    try {
      filename = decodeURIComponent(filename);
    } catch (e) {
      logger.error(e);
    }
    if (filters[filename]) {
      return;
    }
    var filePath = path.join(self._files, file);
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    if (files[filename]) {
      return fs.unlinkSync(filePath);
    }
    if (index > maxIndex) {
      maxIndex = index;
    }
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    var data = readFileSafe(filePath);
    var backFile = path.join(backupDir, file);
    if (data) {
      fs.writeFileSync(backFile, data);
    } else {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      data = readFileSafe(backFile);
      if (data) {
        fs.writeFileSync(filePath, data);
      }
    }
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    files[filename] = {
      index: index,
      name: filename,
      data: data
    };
    var newFile = encodeName(index, filename);
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    fileNames[newFile] = true;
    if (file !== newFile) {
      fs.writeFileSync(path.join(self._files, newFile), data);
      fs.writeFileSync(path.join(backupDir, newFile), data);
      fs.unlinkSync(filePath);
    }
  });

  // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
  var properties = readJsonSafe(self._properties);
  if (properties) {
    fse.outputJsonSync(self._backupProps, properties);
  } else {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    properties = readJsonSafe(self._backupProps);
    if (properties) {
      fse.outputJsonSync(self._properties, properties);
    } else {
      properties = {};
    }
  }

  self._cache = {
    maxIndex: maxIndex,
    files: files,
    properties: properties
  };

  var filesOrder = properties.filesOrder;
  if (!Array.isArray(filesOrder)) {
    filesOrder = null;
  }
  filesOrder = Object.keys(files).sort(function (cur, next) {
    if (filesOrder) {
      var curIndex = filesOrder.indexOf(cur);
      if (curIndex !== -1) {
        var nextIndex = filesOrder.indexOf(next);
        if (nextIndex !== -1) {
          return compare(curIndex, nextIndex);
        }
      }
    }
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    cur = files[cur];
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    next = files[next];
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'index' does not exist on type 'string'.
    return compare(cur.index, next.index);
  });
  this._cache.properties['filesOrder'] = filesOrder;
  fs.readdirSync(backupDir).forEach(function (file: any) {
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    if (fileNames[file]) {
      return;
    }
    try {
      fs.unlinkSync(path.join(backupDir, file));
    } catch (e) {}
  });
}

var proto = Storage.prototype;

function copyFile(src: any, dest: any, callback: any, retry: any) {
  var execCb = function (e: any) {
    if (e && !retry) {
      copyFile(src, dest, callback, true);
    } else {
      callback(e);
    }
  };
  if (typeof fs.copyFile === 'function') {
    fs.copyFile(src, dest, execCb);
  } else {
    fse.copy(src, dest, execCb);
  }
}

proto._writeProperties = function () {
  var self = this;
  if (self._disabled || self._writePropertiesPending) {
    self._writePropertiesWaiting = true;
    return;
  }
  clearTimeout(self._writePropertiesTimeout);
  self._writePropertiesPending = true;
  fse.outputJson(self._properties, self._cache.properties, function (err: any) {
    self._writePropertiesPending = false;
    if (err) {
      self._writePropertiesTimeout = setTimeout(
        self._writeProperties.bind(self),
        RETRY_INTERVAL
      );
      logger.error(err);
    } else {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
      copyFile(self._properties, self._backupProps, function () {
        if (self._writePropertiesWaiting) {
          self._writePropertiesWaiting = false;
          self._writeProperties();
        }
      });
    }
  });
};

proto._writeFile = function (file: any) {
  var self = this;
  if (self._disabled || !(file = self._cache.files[file])) {
    return;
  }
  if (file._pending) {
    file._waiting = true;
    return;
  }
  clearTimeout(file._timeout);
  file._pending = true;
  fs.writeFile(self._getFilePath(file), file.data, function (err: any) {
    file._pending = false;
    if (err) {
      file._timeout = setTimeout(function () {
        self._writeFile(file.name);
      }, RETRY_INTERVAL);
      logger.error(err);
    } else {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
      copyFile(
        self._getFilePath(file),
        self._getFilePath(file, true),
        function () {
          if (file._waiting) {
            file._waiting = false;
            self._writeFile(file.name);
          }
        }
      );
    }
  });
};

proto._getFilePath = function (file: any, backup: any) {
  file = typeof file == 'string' ? this._cache.files[file] : file;
  var name = encodeName(file.index, file.name);
  return path.join(backup ? this._backupDir : this._files, name);
};

proto.count = function () {
  return this._disabled ? 0 : Object.keys(this._cache.files).length;
};

proto.existsFile = function (file: any) {
  return !this._disabled && this._cache.files[file];
};

proto.getFileList = function (origObj: any) {
  var cache = this._cache;
  var files = cache.files;
  var filesOrder = cache.properties.filesOrder;
  return this._disabled
    ? EMPTY_ARR
    : filesOrder.map(function (file: any) {
      return origObj ? files[file] : copyFileObj(files[file]);
    });
};

proto.writeFile = function (file: any, data: any) {
  if (this._disabled || !file) {
    return;
  }

  var self = this;
  var cache = self._cache;
  var fileData = cache.files[file];
  var hasChanged = true;
  data = typeof data == 'string' ? data : '';
  if (!fileData) {
    fileData = cache.files[file] = {
      index: ++cache.maxIndex,
      name: file
    };
    cache.properties.filesOrder.push(file);
    self._writeProperties();
  } else if (fileData.data === data) {
    hasChanged = false;
  }
  fileData.data = data;
  self._writeFile(file);
  return hasChanged;
};

proto.updateFile = function (file: any, data: any) {
  return !this._disabled && this.existsFile(file) && this.writeFile(file, data);
};

proto.readFile = function (file: any) {
  file = !this._disabled && file && this._cache.files[file];
  return file && file.data;
};

proto.removeFile = function (file: any) {
  var self = this;
  var files = self._cache.files;
  file = !this._disabled && file && files[file];
  if (!file) {
    return;
  }
  var filesOrder = self._cache.properties.filesOrder;
  filesOrder.splice(filesOrder.indexOf(file.name), 1);
  self.recycleBin.recycle(file.name, file.data);
  delete files[file.name];
  fs.unlink(self._getFilePath(file), function (err: any) {
    if (!err) {
      fs.unlink(self._getFilePath(file, true), noop);
    }
  });
  self._writeProperties();
  return true;
};

proto.renameFile = function (file: any, newFile: any) {
  var self = this;
  var cache = self._cache;
  if (
    this._disabled ||
    !newFile ||
    !(file = cache.files[file]) ||
    cache.files[newFile]
  ) {
    return;
  }
  var filesOrder = self._cache.properties.filesOrder;
  filesOrder[filesOrder.indexOf(file.name)] = newFile;
  var path = self._getFilePath(file);
  var backupPath = self._getFilePath(file, true);
  delete cache.files[file.name];
  file.name = newFile;
  cache.files[newFile] = file;
  fs.rename(path, self._getFilePath(file), function (err: any) {
    if (!err) {
      fs.rename(backupPath, self._getFilePath(file, true), noop);
    }
  }); //不考虑并发
  self._writeProperties();
  return true;
};

proto.moveTo = function (fromName: any, toName: any) {
  var filesOrder = this._cache.properties.filesOrder;
  var fromIndex = filesOrder.indexOf(fromName);
  if (this._disabled || fromIndex === -1) {
    return false;
  }
  var toIndex = filesOrder.indexOf(toName);
  if (toIndex === -1 || fromIndex === toIndex) {
    return false;
  }
  filesOrder.splice(fromIndex, 1);
  filesOrder.splice(toIndex, 0, fromName);
  this._writeProperties();
  return true;
};

proto.setProperty = function (name: any, value: any) {
  if (!this._disabled) {
    this._cache.properties[name] = value;
    this._writeProperties();
  }
};

proto.hasProperty = function (name: any) {
  return !this._disabled && name in this._cache.properties;
};

proto.setProperties = function (obj: any) {
  if (this._disabled || !obj) {
    return;
  }

  var props = this._cache.properties;
  Object.keys(obj).forEach(function (key) {
    props[key] = obj[key];
  });
  this._writeProperties();
  return true;
};

proto.getProperty = function (name: any) {
  return this._disabled ? null : this._cache.properties[name];
};

proto.removeProperty = function (name: any) {
  if (!this._disabled && this.hasProperty(name) && name !== 'filesOrder') {
    delete this._cache.properties[name];
    this._writeProperties();
  }
};

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Storage;
