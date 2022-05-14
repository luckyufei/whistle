// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require("./util/patch");
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var net = require("net");
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var tls = require("tls");
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var extend = require("extend");
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var path = require("path");
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var cluster = require("cluster");
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var os = require("os");
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var assert = require("assert");
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var common = require("./util/common");

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
var ver = process.version.substring(1).split(".");
var PROD_RE = /(^|\|)prod(uction)?($|\|)/;
// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'noop'.
var noop = function () {};
var state = {};
var INTERVAL = 1000;
var TIMEOUT = 10000;
var MASTER_TIMEOUT = 12000;

if (ver[0] >= 7 && ver[1] >= 7) {
  // @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'connect'.
  var connect = net.Socket.prototype.connect;
  if (typeof connect === "function") {
    //fix: Node v7.7.0+引入的 `"listener" argument must be a function` 问题
    net.Socket.prototype.connect = function (options: any, cb: any) {
      if (options && typeof options === "object" && typeof cb !== "function") {
        return connect.call(this, options, null);
      }
      // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'IArguments' is not assignable to... Remove this comment to see the full error message
      return connect.apply(this, arguments);
    };
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
var env = process.env || "";
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '__dirname'.
env.WHISTLE_ROOT = __dirname;
if (typeof tls.checkServerIdentity == "function") {
  var checkServerIdentity = tls.checkServerIdentity;
  tls.checkServerIdentity = function () {
    try {
      return checkServerIdentity.apply(this, arguments);
    } catch (err) {
      return err;
    }
  };
}
if (env.WHISTLE_PLUGIN_EXEC_PATH) {
  env.PFORK_EXEC_PATH = env.WHISTLE_PLUGIN_EXEC_PATH;
}

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
function isPipeName(s: any) {
  return typeof s === "string" && toNumber(s) === false;
}

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
function toNumber(x: any) {
  return (x = Number(x)) >= 0 ? x : false;
}

if (!net._normalizeConnectArgs) {
  //Returns an array [options] or [options, cb]
  //It is the same as the argument of Socket.prototype.connect().
  net._normalizeConnectArgs = function (args: any) {
    var options = {};

    if (args[0] !== null && typeof args[0] === "object") {
      // connect(options, [cb])
      options = args[0];
    } else if (isPipeName(args[0])) {
      // connect(path, [cb]);
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'path' does not exist on type '{}'.
      options.path = args[0];
    } else {
      // connect(port, [host], [cb])
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'port' does not exist on type '{}'.
      options.port = args[0];
      if (typeof args[1] === "string") {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'host' does not exist on type '{}'.
        options.host = args[1];
      }
    }

    var cb = args[args.length - 1];
    return typeof cb === "function" ? [options, cb] : [options];
  };
}

function loadConfig(options: any) {
  var config = options.config;
  if (config) {
    delete options.config;
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    return require(path.resolve(config));
  }
}

function likePromise(p: any) {
  return p && typeof p.then === "function" && typeof p.catch === "function";
}

function killWorker(worker: any) {
  try {
    worker.removeAllListeners();
    worker.on("error", noop);
    worker.kill("SIGTERM");
  } catch (err) {}
}

function forkWorker(index: any) {
  var worker = cluster.fork({ workerIndex: index });
  var reforked: any;
  var refork = () => {
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    if (!state[index]) {
      setTimeout(function () {
        // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        process.exit(1);
      }, INTERVAL);
      return;
    }
    if (reforked) {
      return;
    }
    reforked = true;
    killWorker(worker);
    clearInterval(worker.timer);
    clearTimeout(worker.activeTimer);
    setTimeout(function () {
      forkWorker(index);
    }, 600);
  };
  worker.once("disconnect", refork);
  worker.once("exit", refork);
  worker.on("error", noop);
  worker.on("message", (msg: any) => {
    if (msg !== "1") {
      return;
    }
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    state[index] = true;
    if (!worker.timer) {
      worker.timer = setInterval(() => {
        try {
          worker.send("1", noop);
        } catch (e) {
          clearInterval(worker.timer);
        }
      }, INTERVAL);
    } else {
      clearTimeout(worker.activeTimer);
    }
    worker.activeTimer = setTimeout(refork, MASTER_TIMEOUT);
  });
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function (options: any, callback: any) {
  if (typeof options === "function") {
    callback = options;
    options = null;
  }
  var startWhistle = function () {
    var server = options.server;
    if (server) {
      assert(options.port > 0, "options.port of the custom server is required");
      if (!options.storage && options.storage !== false) {
        options.storage = "__custom_server_5b6af7b9884e1165__" + options.port;
      }
    }
    var workerIndex = env.workerIndex;
    if (options && options.cluster && workerIndex >= 0) {
      options.storage =
        "." +
        (options.storage || "") +
        "__cluster_worker." +
        workerIndex +
        "_5b6af7b9884e1165__";
    }
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    var conf = require("./config").extend(options);
    if (!conf.cluster) {
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
      return require("./index")(callback, server);
    }
    var timer: any;
    var activeTimeout = function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        process.exit(1);
      }, TIMEOUT);
    };
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    process.once("SIGTERM", function () {
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      process.exit(0);
    });

    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    require("./index")(function () {
      activeTimeout();
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      process.on("message", activeTimeout);
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      process.send("1", noop);
      setInterval(() => {
        try {
          // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
          process.send("1", noop);
        } catch (e) {}
      }, INTERVAL);
    });
  };
  if (options) {
    if (/^\d+$/.test(options.cluster)) {
      options.cluster = Math.min(parseInt(options.cluster, 10), 999);
    } else if (options.cluster) {
      options.cluster = Math.min(os.cpus().length, 999);
    }
    if (options.cluster && cluster.isMaster) {
      assert(!options.server, "cannot exist options.server in cluster mode");
      for (var i = 0; i < options.cluster; i++) {
        forkWorker(i);
      }
      return;
    }
    if (options.debugMode) {
      if (PROD_RE.test(options.mode)) {
        options.debugMode = false;
      } else {
        env.PFORK_MODE = "bind";
      }
    }
    var config = loadConfig(options);
    if (typeof config === "function") {
      var handleCallback = function (opts: any) {
        opts && extend(options, opts);
        return startWhistle();
      };
      if (config.length < 2) {
        config = config(options);
        if (likePromise(config)) {
          return config.then(handleCallback).catch(function (err: any) {
            // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
            process.nextTick(function () {
              throw err;
            });
          });
        }
      } else {
        config(options, handleCallback);
      }
    }
    config && extend(options, config);
  }
  return startWhistle();
};

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports.getWhistlePath = common.getWhistlePath;
