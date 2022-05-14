// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var forge = require('node-forge');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var fs = require('fs');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var net = require('net');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var path = require('path');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var crypto = require('crypto');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var LRU = require('lru-cache');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var hagent = require('hagent');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var extend = require('extend');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var h2 = require('./h2');
var createSecureContext =
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  require('tls').createSecureContext || crypto.createCredentials;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var util = require('../util');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var config = require('../config');

var pki = forge.pki;
var workerIndex = util.workerIndex;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
var CUR_VERSION = process.version;
var requiredVersion = parseInt(CUR_VERSION.slice(1), 10) >= 6;
var HTTPS_DIR = mkdir(path.join(config.getDataDir(), 'certs'));
var ROOT_NEW_KEY_FILE = path.join(HTTPS_DIR, 'root_new.key');
var ROOT_NEW_CRT_FILE = path.join(HTTPS_DIR, 'root_new.crt');
var CUSTOM_CERTS_DIR = config.disableCustomCerts
  ? null
  : config.CUSTOM_CERTS_DIR;
var useNewKey =
  fs.existsSync(ROOT_NEW_KEY_FILE) && fs.existsSync(ROOT_NEW_CRT_FILE);
var ROOT_KEY_FILE = useNewKey
  ? ROOT_NEW_KEY_FILE
  : path.join(HTTPS_DIR, 'root.key');
var ROOT_CRT_FILE = useNewKey
  ? ROOT_NEW_CRT_FILE
  : path.join(HTTPS_DIR, 'root.crt');
var customCertDir = config.certDir;
var customPairs = {};
var customCertsInfo = {};
var customCertsFiles = {};
var allCustomCerts = {};
var customCertCount = 0;
var cachePairs = new LRU({ max: 5120 });
var certsCache = new LRU({ max: 256 });
var remoteCerts = new LRU({ max: 1280 });
var ILEGAL_CHAR_RE = /[^a-z\d-]/i;
var RANDOM_SERIAL = '.' + Date.now() + '.' + Math.floor(Math.random() * 10000);
var CLEAR_CERTS_INTERVAL = 1000 * 60 * 60 * 24 * 20;
var MAX_INNTERFAL = 18;
var PORT_RE = /:\d*$/;
var customRoot: any;
var ROOT_KEY: any, ROOT_CRT: any;
var rootKey: any, rootCrt: any;

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.remoteCerts = remoteCerts;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.createSecureContext = createSecureContext;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.CUSTOM_CERTS_DIR = CUSTOM_CERTS_DIR;

// When delay is larger than 2147483647 or less than 1, the delay will be set to 1. Non-integer delays are truncated to an integer.
var intervalCount = 0;
var timer = setInterval(function () {
  if (++intervalCount >= MAX_INNTERFAL) {
    intervalCount = 0;
    cachePairs.reset();
    certsCache.reset();
  }
}, CLEAR_CERTS_INTERVAL);

// @ts-expect-error ts-migrate(2339) FIXME: Property 'unref' does not exist on type 'number'.
if (timer && typeof timer.unref === 'function') {
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'unref' does not exist on type 'number'.
  timer.unref();
}

if (!useNewKey && requiredVersion && !checkCertificate()) {
  try {
    fs.unlinkSync(ROOT_KEY_FILE);
    fs.unlinkSync(ROOT_CRT_FILE);
  } catch (e) {}
}

function mkdir(path: any) {
  !fs.existsSync(path) && fs.mkdirSync(path);
  return path;
}

function checkCertificate() {
  try {
    var crt = pki.certificateFromPem(fs.readFileSync(ROOT_CRT_FILE));
    if (crt.publicKey.n.toString(2).length < 2048) {
      return false;
    }
    return /^whistle\.\d+$/.test(getCommonName(crt));
  } catch (e) {}
  return true;
}

function getCommonName(crt: any) {
  var attrs = crt.issuer && crt.issuer.attributes;
  if (Array.isArray(attrs)) {
    for (var i = 0, len = attrs.length; i < len; i++) {
      var attr = attrs[i];
      if (attr && attr.name === 'commonName') {
        return attr.value;
      }
    }
  }
  return '';
}

// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'getDomain'.
function getDomain(hostname: any) {
  if (getCacheCert(hostname) || net.isIP(hostname)) {
    return hostname;
  }
  var list = hostname.split('.');
  var prefix = list[0];
  list[0] = '*';
  var wildDomain = list.join('.');
  if (getCacheCert(wildDomain)) {
    return wildDomain;
  }
  var len = list.length;
  if (len < 3) {
    return hostname;
  }
  if (
    len > 3 ||
    ILEGAL_CHAR_RE.test(prefix) ||
    list[1].length > 3 ||
    list[2] === 'com' ||
    list[1] === 'url'
  ) {
    // For tencent cdn
    return wildDomain;
  }

  return hostname;
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getDomain = getDomain;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.existsCustomCert = function (hostname: any) {
  if (!customCertCount) {
    return false;
  }
  hostname = hostname.replace(PORT_RE, '');
  // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  var cert = customPairs[hostname];
  if (cert) {
    return true;
  }
  hostname = hostname.split('.');
  hostname[0] = '*';
  // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  return customPairs[hostname.join('.')];
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.hasCustomCerts = function () {
  return customCertCount;
};

function getCacheCert(hostname: any) {
  return (
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    customPairs[hostname] ||
    cachePairs.get(hostname) ||
    certsCache.get(hostname)
  );
}

var curIndex = 0;
// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
function getIndex() {
  ++curIndex;
  if (curIndex < 10) {
    return '0' + curIndex;
  }
  if (curIndex > 99) {
    curIndex = 0;
    return '00';
  }
  return curIndex;
}

function createSelfCert(hostname: any) {
  var serialNumber =
    crypto
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'createHash' does not exist on type 'Cryp... Remove this comment to see the full error message
      .createHash('sha1')
      .update(hostname + RANDOM_SERIAL, 'binary')
      .digest('hex') +
    getIndex() +
    workerIndex;
  var cert = createCert(
    pki.setRsaPublicKey(ROOT_KEY.n, ROOT_KEY.e),
    serialNumber,
    true
  );
  cert.setSubject([
    {
      name: 'commonName',
      value: hostname
    }
  ]);
  cert.setIssuer(ROOT_CRT.subject.attributes);
  cert.setExtensions([
    {
      name: 'subjectAltName',
      altNames: [
        net.isIP(hostname)
          ? {
            type: 7,
            ip: hostname
          }
          : {
            type: 2,
            value: hostname
          }
      ]
    }
  ]);
  cert.sign(ROOT_KEY, forge.md.sha256.create());
  return {
    key: pki.privateKeyToPem(ROOT_KEY),
    cert: pki.certificateToPem(cert)
  };
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.createCertificate = function (hostname: any) {
  hostname = getDomain(hostname);
  var cert = cachePairs.get(hostname); // 确保使用自己生成的证书，防止把用户证书下载出去
  if (!cert) {
    cert = createSelfCert(hostname);
    certsCache.set(hostname, cert);
  }
  return cert;
};

function parseCert(cert: any) {
  var pem = pki.certificateFromPem(cert.cert);
  var altNames = getAltNames(pem.extensions);
  if (!altNames || !altNames.length) {
    return;
  }
  return { cert: cert, altNames: altNames, validity: pem.validity };
}

function parseAllCustomCerts() {
  var pairs = {};
  var certsInfo = {};
  var certFiles = {};
  var keys = Object.keys(allCustomCerts).sort(function (key1, key2) {
    return util.compare(
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      allCustomCerts[key1].cert.mtime,
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      allCustomCerts[key2].cert.mtime
    );
  });
  keys.forEach(function (filename) {
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    var info = allCustomCerts[filename];
    var cert = info.cert;
    var mtime = cert.mtime;
    var validity = info.validity;
    var altNames = info.altNames;
    var dnsName: any = [];
    altNames.forEach(function (item: any) {
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      if ((item.type === 2 || item.type === 7) && !pairs[item.value]) {
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        var preCert = customPairs[item.value];
        if (preCert && preCert.key === cert.key && preCert.cert === cert.cert) {
          if (preCert.mtime < mtime) {
            preCert.mtime = mtime;
          }
          // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          pairs[item.value] = preCert;
        } else {
          // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          pairs[item.value] = cert;
        }
        dnsName.push(item.value);
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        certsInfo[item.value] = extend(
          { filename: filename, mtime: mtime, domain: item.value },
          validity
        );
      }
    });
    if (dnsName.length) {
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      certFiles[filename] = extend(
        { mtime: mtime, dir: cert.dir, dnsName: dnsName.join(', ') },
        validity
      );
    }
  });
  customPairs = pairs;
  customCertsInfo = certsInfo;
  customCertsFiles = certFiles;
  customCertCount = Object.keys(customPairs).length;
  checkExpired();
}

function loadCustomCerts(certDir: any, isCustom: any) {
  if (!certDir) {
    return;
  }
  var certs = {};
  try {
    fs.readdirSync(certDir).forEach(function (name: any) {
      if (!/^(.+)\.(crt|key)$/.test(name)) {
        return;
      }
      var filename = RegExp.$1;
      var suffix = RegExp.$2;
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      var cert = (certs[filename] = certs[filename] || {});
      if (suffix === 'crt') {
        suffix = 'cert';
      }
      try {
        var filePath = path.join(certDir, name);
        cert.dir = certDir;
        cert[suffix] = fs.readFileSync(filePath, { encoding: 'utf8' });
        var mtime = fs.statSync(filePath).mtime.getTime();
        if (cert.mtime == null || cert.mtime < mtime) {
          cert.mtime = mtime;
        }
      } catch (e) {}
    });
  } catch (e) {}
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'root' does not exist on type '{}'.
  var rootCA = certs.root;
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'root' does not exist on type '{}'.
  delete certs.root;
  if (rootCA && rootCA.key && rootCA.cert && !customRoot) {
    customRoot = rootCA;
    ROOT_KEY_FILE = path.join(certDir, 'root.key');
    ROOT_CRT_FILE = path.join(certDir, 'root.crt');
  }
  Object.keys(certs).filter(function (key) {
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    var cert = certs[key];
    if (cert && cert.mtime != null && cert.key && cert.cert) {
      try {
        cert = parseCert(cert);
        if (cert) {
          // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          allCustomCerts[isCustom ? 'z/' + key : key] = cert;
        }
      } catch (e) {}
    }
  });
}

function getAltNames(exts: any) {
  for (var i = 0, len = exts.length; i < len; i++) {
    var item = exts[i];
    if (item.name === 'subjectAltName') {
      return Array.isArray(item.altNames) && item.altNames.filter(util.noop);
    }
  }
}

function createRootCA() {
  allCustomCerts = {};
  loadCustomCerts(customCertDir, true);
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
  loadCustomCerts(CUSTOM_CERTS_DIR);
  parseAllCustomCerts();
  if (ROOT_KEY && ROOT_CRT) {
    return;
  }
  try {
    ROOT_KEY = fs.readFileSync(ROOT_KEY_FILE);
    ROOT_CRT = fs.readFileSync(ROOT_CRT_FILE);
    rootKey = ROOT_KEY.toString();
    rootCrt = ROOT_CRT.toString();
  } catch (e) {
    ROOT_KEY = ROOT_CRT = null;
  }

  if (ROOT_KEY && ROOT_CRT && ROOT_KEY.length && ROOT_CRT.length) {
    ROOT_KEY = pki.privateKeyFromPem(ROOT_KEY);
    ROOT_CRT = pki.certificateFromPem(ROOT_CRT);
    if (customRoot) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'root' does not exist on type '{}'.
      customCertsFiles.root = extend(
        {
          mtime: customRoot.mtime,
          dir: customRoot.dir,
          dnsName: ''
        },
        ROOT_CRT.validity
      );
    }
    try {
      var altNames = getAltNames(ROOT_CRT.extensions);
      var dnsName: any = [];
      altNames.forEach(function (item: any) {
        if (
          (item.type === 2 || item.type === 7) &&
          dnsName.indexOf(item.value) === -1
        ) {
          dnsName.push(item.value);
        }
      });
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'root' does not exist on type '{}'.
      customCertsFiles.root.dnsName = dnsName.join(', ');
    } catch (e) {}
  } else {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
    var cert = createCACert();
    ROOT_CRT = cert.cert;
    ROOT_KEY = cert.key;
    rootKey = pki.privateKeyToPem(ROOT_KEY).toString();
    rootCrt = pki.certificateToPem(ROOT_CRT).toString();
    fs.writeFileSync(ROOT_KEY_FILE, rootKey);
    fs.writeFileSync(ROOT_CRT_FILE, rootCrt);
  }
}

function getRandom() {
  var random = Math.floor(Math.random() * 1000);
  if (random < 10) {
    return '00' + random;
  }
  if (random < 100) {
    return '0' + random;
  }
  return '' + random;
}

function createCACert(opts: any) {
  opts = opts || {};
  var keys = pki.rsa.generateKeyPair(requiredVersion ? 2048 : 1024);
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 1.
  var cert = createCert(keys.publicKey);
  var now = Date.now() + getRandom();
  var attrs = [
    {
      name: 'commonName',
      value: opts.commonname || opts.commonName || 'whistle.' + now
    },
    {
      name: 'countryName',
      value: opts.countryname || opts.countryName || 'CN'
    },
    {
      shortName: 'ST',
      value: opts.st || opts.ST || 'ZJ'
    },
    {
      name: 'localityName',
      value: opts.localityname || opts.localityName || 'HZ'
    },
    {
      name: 'organizationName',
      value: opts.organizationname || opts.organizationName || now + '.wproxy.org'
    },
    {
      shortName: 'OU',
      value: opts.ou || opts.OU || 'wproxy.org'
    }
  ];

  cert.setSubject(attrs);
  cert.setIssuer(attrs);
  cert.setExtensions([
    {
      name: 'basicConstraints',
      cA: true
    },
    {
      name: 'keyUsage',
      keyCertSign: true,
      digitalSignature: true,
      nonRepudiation: true,
      keyEncipherment: true,
      dataEncipherment: true
    },
    {
      name: 'extKeyUsage',
      serverAuth: true,
      clientAuth: true,
      codeSigning: true,
      emailProtection: true,
      timeStamping: true
    },
    {
      name: 'nsCertType',
      client: true,
      server: true,
      email: true,
      objsign: true,
      sslCA: true,
      emailCA: true,
      objCA: true
    }
  ]);

  cert.sign(keys.privateKey, forge.md.sha256.create());

  return {
    key: keys.privateKey,
    cert: cert
  };
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.createRootCA = function(opts: any) {
  var cert = createCACert(opts);
  cert.key = pki.privateKeyToPem(cert.key).toString();
  cert.cert = pki.certificateToPem(cert.cert).toString();
  return cert;
};

function createCert(publicKey: any, serialNumber: any, isShortPeriod: any) {
  var cert = pki.createCertificate();
  cert.publicKey = publicKey;
  cert.serialNumber = serialNumber || '01';
  var curYear = new Date().getFullYear();
  cert.validity.notBefore = new Date();
  cert.validity.notAfter = new Date();
  cert.validity.notBefore.setFullYear(curYear - 1);
  // https://chromium.googlesource.com/chromium/src/+/refs/heads/master/net/cert/cert_verify_proc.cc#900
  cert.validity.notAfter.setFullYear(curYear + (isShortPeriod ? 1 : 10));
  return cert;
}

function getRootCAFile() {
  return ROOT_CRT_FILE;
}

createRootCA(); // 启动生成ca

function getOrCreateCert(servername: any) {
  var requestCert = servername[0] === ':';
  if (requestCert) {
    servername = servername.substring(1);
  }
  var cert = remoteCerts.get(servername);
  if (!cert) {
    servername = getDomain(servername);
    cert = getCacheCert(servername);
    if (!cert) {
      cert = createSelfCert(servername);
      cachePairs.set(servername, cert);
    }
  }
  return requestCert
    ? extend(
      {
        requestCert: true,
        rejectUnauthorized: false
      },
        cert
      )
    : cert;
}

hagent.serverAgent.createCertificate = getOrCreateCert;
var getHttp2Server = hagent.create(h2.getHttpServer, 42900);
var getHttpsServer = hagent.create(h2.getServer, 43900);
var cbs = {};
var ports = {};
var TIMEOUT = 6000;

var SNICallback = function (servername: any, cb: any) {
  var options = getOrCreateCert(servername);
  if (!options._ctx) {
    try {
      options._ctx = createSecureContext(options);
    } catch (e) {}
  }
  cb(null, options._ctx);
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getRootCA = function () {
  return {
    key: rootKey,
    cert: rootCrt
  };
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getCustomCertsInfo = function () {
  return customCertsInfo;
};
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getCustomCertsFiles = function () {
  return customCertsFiles;
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getRootCAFile = getRootCAFile;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.serverAgent = hagent.serverAgent;

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.SNICallback = SNICallback;

function addCallback(name: any, callback: any) {
  // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  var cbList = cbs[name];
  if (!cbList) {
    cbList = [];
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    cbs[name] = cbList;
  }
  cbList.push(callback);
  return cbList;
}

// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'createServer'.
function createServer(name: any, cbList: any, listener: any, options: any) {
  var removeServer = function(this: any) {
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    ports[name] = null;
    try {
      this.close();
    } catch (e) {} //重复关闭会导致异常
  };
  // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  ports[name] = false; // pending
  var getServer = options ? getHttpsServer : getHttp2Server;
  getServer(options, listener, function (server: any, port: any) {
    server.on('error', removeServer);
    var timeout = setTimeout(removeServer, TIMEOUT);
    var clearup = function () {
      clearTimeout(timeout);
    };
    if (options) {
      server.once('tlsClientError', clearup);
      server.once('secureConnection', clearup);
    } else {
      server.once('connection', clearup);
    }
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    ports[name] = port;
    cbList.forEach(function (cb: any) {
      cb(port);
    });
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    cbs[name] = [];
  });
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getHttp2Server = function (listener: any, callback: any) {
  var name = 'httpH2';
  // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  var curPort = ports[name];
  if (curPort) {
    return callback(curPort);
  }
  var cbList = addCallback(name, callback);
  if (curPort === false) {
    return;
  }
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
  createServer(name, cbList, listener);
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getSNIServer = function (listener: any, callback: any, disableH2: any, requestCert: any) {
  var enableH2 = config.enableH2 && !disableH2;
  var name = (enableH2 ? 'h2Sni' : 'sni') + (requestCert ? 'WithCert' : '');
  // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  var curPort = ports[name];
  if (curPort) {
    return callback(curPort);
  }
  var cbList = addCallback(name, callback);
  if (curPort === false) {
    return;
  }
  var options = { SNICallback: SNICallback };
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'allowHTTP1' does not exist on type '{ SN... Remove this comment to see the full error message
  options.allowHTTP1 = enableH2; // 是否启用http2
  if (requestCert) {
    options = extend(
      {
        requestCert: true,
        rejectUnauthorized: false
      },
      options
    );
  }
  createServer(name, cbList, listener, options);
};

var checkTimer: any;

function checkExpired() {
  clearTimeout(checkTimer);
  var now = Date.now();
  var files = Object.keys(customCertsFiles);
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
  exports.hasInvalidCerts = false;
  for (var i = 0, len = files.length; i < len; i++) {
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    var file = customCertsFiles[files[i]];
    try {
      var startDate = new Date(file.notBefore);
      var endDate = new Date(file.notAfter);
      if (startDate.getTime() > now) {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
        exports.hasInvalidCerts = true;
        return;
      } else if (endDate.getTime() < now) {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
        exports.hasInvalidCerts = true;
        return;
      }
    } catch (e) {}
  }
  checkTimer = setTimeout(checkExpired, 600000);
}

function removeFile(filename: any) {
  fs.unlink(filename, function (err: any) {
    err && fs.unlink(filename, util.noop);
  });
}

function writeFile(filename: any, ctn: any, callback: any) {
  fs.writeFile(filename, ctn, function (err: any) {
    if (!err) {
      return callback();
    }
    fs.writeFile(filename, ctn, callback);
  });
}
// 异步重试，出错重试即可
function removeCertFile(filename: any) {
  removeFile(path.join(CUSTOM_CERTS_DIR, filename + '.key'));
  removeFile(path.join(CUSTOM_CERTS_DIR, filename + '.crt'));
}
// 异步写入，出错重试即可
function writeCertFile(filename: any, cert: any, mtime: any) {
  var keyFile = path.join(CUSTOM_CERTS_DIR, filename + '.key');
  var certFile = path.join(CUSTOM_CERTS_DIR, filename + '.crt');
  writeFile(keyFile, cert.key, function () {
    fs.utimes && fs.utimes(keyFile, mtime, mtime, util.noop);
  });
  writeFile(certFile, cert.cert, function () {
    fs.utimes && fs.utimes(certFile, mtime, mtime, util.noop);
  });
}

var ILLEGAL_PATH_RE = /[/\\]/;

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
function checkFilename(name: any) {
  return name && !ILLEGAL_PATH_RE.test(name) && name !== 'root';
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.removeCert = function (filename: any) {
  if (!CUSTOM_CERTS_DIR) {
    return;
  }
  // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  if (checkFilename(filename) && allCustomCerts[filename]) {
    removeCertFile(filename);
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    delete allCustomCerts[filename];
    parseAllCustomCerts();
  }
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.uploadCerts = function (certs: any) {
  if (!CUSTOM_CERTS_DIR) {
    return;
  }
  var now = Date.now();
  var hasChanged;
  var index = 0;
  Object.keys(certs).forEach(function (filename) {
    if (!checkFilename(filename) || filename.length > 128) {
      return;
    }
    var cert = certs[filename];
    if (!cert) {
      return;
    }
    var keyStr, certStr;
    if (Array.isArray(cert)) {
      keyStr = cert[0];
      certStr = cert[1];
    } else {
      keyStr = cert.key;
      certStr = cert.cert;
    }
    if (util.isString(keyStr) && util.isString(certStr)) {
      var mtime = now + index * 1000;
      ++index;
      try {
        cert = parseCert({
          key: keyStr,
          cert: certStr,
          mtime: mtime
        });
        if (cert) {
          writeCertFile(filename, cert.cert, new Date(mtime));
          // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          allCustomCerts[filename] = cert;
          hasChanged = true;
        }
      } catch (e) {}
    }
  });
  hasChanged && parseAllCustomCerts();
};
