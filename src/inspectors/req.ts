// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var qs = require('querystring');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var iconv = require('iconv-lite');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var util = require('../util');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var extend = require('extend');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var hparser = require('hparser');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var pluginMgr = require('../plugins');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var config = require('../config');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var Transform = require('pipestream').Transform;
// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'WhistleTransform'.
var WhistleTransform = util.WhistleTransform;
var ReplacePatternTransform = util.ReplacePatternTransform;
// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'ReplaceStringTransform'.
var ReplaceStringTransform = util.ReplaceStringTransform;
// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'FileWriterTransform'.
var FileWriterTransform = util.FileWriterTransform;
var toMultiparts = hparser.toMultiparts;
var MultipartParser = hparser.MultipartParser;

var JSON_RE = /{[\w\W]*}|\[[\w\W]*\]/;
var MAX_REQ_SIZE = 256 * 1024;
var REQ_TYPE = {
  urlencoded: 'application/x-www-form-urlencoded',
  form: 'application/x-www-form-urlencoded',
  json: 'application/json',
  xml: 'text/xml',
  text: 'text/plain',
  upload: 'multipart/form-data',
  multipart: 'multipart/form-data',
  defaultType: 'application/octet-stream'
};

/**
 * 处理请求数据
 *
 * @param req：method、body、headers，top，bottom，speed、delay，charset,timeout
 * @param data
 */
function handleReq(req: any, data: any) {
  extend(req.headers, data.headers);
  if (typeof data.charset == 'string') {
    var type = req.headers['content-type'];
    var charset = '; charset=' + data.charset;
    if (typeof type == 'string') {
      req.headers['content-type'] = type.split(';')[0] + charset;
    } else {
      req.headers['content-type'] = charset;
    }
  } else {
    delete data.charset;
  }
  if (!util.hasRequestBody(req.method)) {
    delete data.top;
    delete data.bottom;
    delete data.body;
    delete req.headers['content-length'];
  } else {
    util.removeReqBody(req, data);
    if (data.top || data.bottom || data.body) {
      delete req.headers['content-length'];
      req._hasInjectBody = true;
    }
  }

  util.isWhistleTransformData(data) &&
    req.addZipTransform(new WhistleTransform(data));
  var opList = util.parseHeaderReplace(req.rules.headerReplace).req;
  util.handleHeaderReplace(req.headers, opList);
}

function handleAuth(data: any, auth: any) {
  auth = util.getAuthBasic(auth);
  auth && util.setHeader(data, 'authorization', auth);
}

function handleParams(req: any, params: any, urlParams: any) {
  var originParams = params;
  var hasBody;
  if ((params = params && qs.stringify(params))) {
    var transform;
    var headers = req.headers;
    var isJson = util.isJSONContent(req);
    if (isJson || util.isUrlEncoded(req)) {
      delete headers['content-length'];
      transform = new Transform();
      var buffer: any, interrupt: any;
      transform._transform = function (chunk: any, encoding: any, callback: any) {
        if (chunk) {
          if (!interrupt) {
            buffer = buffer ? Buffer.concat([buffer, chunk]) : chunk;
            chunk = null;
            if (buffer.length > MAX_REQ_SIZE) {
              interrupt = true;
              chunk = buffer;
              buffer = null;
            }
          }
        } else if (buffer && buffer.length) {
          var body;
          var isGBK = !util.isUtf8(buffer);
          if (isGBK) {
            try {
              body = iconv.decode(buffer, 'GB18030');
            } catch (e) {}
          }
          if (!body) {
            body = buffer + '';
          }
          if (isJson) {
            body = body.replace(JSON_RE, function (json: any) {
              var obj = util.parseRawJson(json);
              return obj
                ? JSON.stringify(extend(true, obj, originParams))
                : json;
            });
          } else {
            body = util.replaceQueryString(body, params);
          }
          if (isGBK) {
            try {
              body = iconv.encode(body, 'GB18030');
            } catch (e) {}
          } else {
            chunk = util.toBuffer(body);
          }
          buffer = null;
        } else {
          var data = params;
          if (isJson) {
            try {
              data = JSON.stringify(originParams);
            } catch (e) {}
          }
          chunk = util.toBuffer(data);
        }

        callback(null, chunk);
      };
      req.addZipTransform(transform);
      hasBody = true;
    } else if (
      util.isMultipart(req) &&
      /boundary=(?:"([^"]+)"|([^;]+))/i.test(headers['content-type'])
    ) {
      delete headers['content-length'];
      var boundaryStr = '--' + (RegExp.$1 || RegExp.$2);
      var startBoundary = util.toBuffer(boundaryStr + '\r\n');
      var boundary = util.toBuffer('\r\n' + boundaryStr);
      var sepBoundary = util.toBuffer('\r\n' + boundaryStr + '\r\n');
      var endBoudary = util.toBuffer('\r\n' + boundaryStr + '--');
      var length = startBoundary.length;
      var sepLength = sepBoundary.length;
      transform = new Transform();

      transform.parse = function (chunk: any) {
        var index, result, sep, data;
        while (
          (index = util.indexOfList(chunk, boundary)) != -1 &&
          ((sep = util.startWithList(chunk, sepBoundary, index)) ||
            util.startWithList(chunk, endBoudary, index))
        ) {
          data = this.parser.transform(chunk.slice(0, index));
          result =
            result && data ? Buffer.concat([result, data]) : result || data;
          if (!sep) {
            data = toMultiparts(originParams, boundaryStr);
            result = result ? Buffer.concat([result, data]) : data;
          }
          sep = sep ? sepBoundary : endBoudary;
          result = result ? Buffer.concat([result, sep]) : sep;
          chunk = chunk.slice(index + sepLength);
          this.parser = new MultipartParser(originParams);
        }

        var len = chunk.length;
        if (len >= sepLength) {
          var lastIndex = len - sepLength + 1;
          data = this.parser.transform(chunk.slice(0, lastIndex));
          chunk = chunk.slice(lastIndex);
          result =
            result && data ? Buffer.concat([result, data]) : result || data;
        }
        this.buffer = chunk;

        return result;
      };
      transform._transform = function (chunk: any, encoding: any, callback: any) {
        if (this.badMultipart) {
          return callback(null, chunk);
        }

        var end;
        if (chunk) {
          chunk = this.buffer ? Buffer.concat([this.buffer, chunk]) : chunk;
        } else {
          end = true;
          chunk = this.buffer;
        }

        if (chunk) {
          this.buffer = null;
          if (!this.parser) {
            if (util.startWithList(chunk, startBoundary)) {
              this.parser = new MultipartParser(originParams);
              chunk = this.parse(chunk.slice(length));
              chunk = chunk
                ? Buffer.concat([startBoundary, chunk])
                : startBoundary;
            } else if (end || chunk.length >= length) {
              this.badMultipart = true;
            } else {
              this.buffer = chunk;
              chunk = null;
            }
          } else {
            chunk = this.parse(chunk);
          }
        }

        if (end && this.buffer) {
          chunk = chunk ? Buffer.concat([chunk, this.buffer]) : this.buffer;
        }
        callback(null, chunk);
      };
      req.addZipTransform(transform);
      hasBody = true;
    }
  }
  var _params = hasBody ? null : originParams;
  if (_params || urlParams) {
    req._urlParams =
      urlParams && _params ? extend(_params, urlParams) : _params || urlParams;
  }
}

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
function handleReplace(req: any, replacement: any) {
  if (!util.hasRequestBody(req) || !replacement) {
    return;
  }

  var type = req.headers['content-type'];
  type = util.isUrlEncoded(req) ? 'FORM' : util.getContentType(type);
  if (!type || type == 'IMG') {
    return;
  }

  Object.keys(replacement).forEach(function (pattern) {
    var value = replacement[pattern];
    if (
      util.isOriginalRegExp(pattern) &&
      (pattern = util.toOriginalRegExp(pattern))
    ) {
      req.addTextTransform(new ReplacePatternTransform(pattern, value));
    } else if (pattern) {
      req.addTextTransform(new ReplaceStringTransform(pattern, value));
    }
  });
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function (req: any, res: any, next: any) {
  var reqRules = req.rules;
  var authObj = util.getAuthByRules(reqRules);

  util.parseRuleJson(
    [
      reqRules.reqHeaders,
      reqRules.reqCookies,
      authObj ? null : reqRules.auth,
      reqRules.params,
      reqRules.reqCors,
      reqRules.reqReplace,
      reqRules.urlReplace,
      reqRules.urlParams
    ],
    function (
      headers: any,
      cookies: any,
      auth: any,
      params: any,
      cors: any,
      replacement: any,
      urlReplace: any,
      urlParams: any
    ) {
      var data = {};
      if (headers) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'headers' does not exist on type '{}'.
        data.headers = extend(data.headers || {}, headers);
      }
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'body' does not exist on type '{}'.
      if (data.body && typeof data.body !== 'string') {
        try {
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'body' does not exist on type '{}'.
          data.body = JSON.stringify(data.body);
        } catch (e) {}
      }

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'headers' does not exist on type '{}'.
      if (data.headers) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'headers' does not exist on type '{}'.
        data.headers = util.lowerCaseify(data.headers, req.rawHeaderNames);
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'headers' does not exist on type '{}'.
        req._customHost = data.headers.host;
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'headers' does not exist on type '{}'.
        req._customXFF = data.headers[config.CLIENT_IP_HEAD];
      }

      if (reqRules.method) {
        var method = util.getMatcherValue(reqRules.method);
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'method' does not exist on type '{}'.
        data.method = method;
      }

      if (reqRules.reqType) {
        var newType = util.getMatcherValue(reqRules.reqType).split(';');
        var type = newType[0];
        newType[0] =
          !type || type.indexOf('/') != -1
            ? type
            // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            : REQ_TYPE[type] || REQ_TYPE.defaultType;
        type = newType.join(';');
        if (type.indexOf(';') == -1) {
          var origType = req.headers['content-type'];
          if (typeof origType == 'string' && origType.indexOf(';') != -1) {
            origType = origType.split(';');
            origType[0] = type;
            type = origType.join(';');
          }
        }
        util.setHeader(data, 'content-type', type);
      }

      if (reqRules.reqCharset) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'charset' does not exist on type '{}'.
        data.charset = util.getMatcherValue(reqRules.reqCharset);
      }

      if (reqRules.referer) {
        var referer = util.getMatcherValue(reqRules.referer);
        util.setHeader(data, 'referer', referer);
      }

      if (reqRules.ua) {
        var ua = util.getMatcherValue(reqRules.ua);
        util.setHeader(data, 'user-agent', ua);
      }

      var reqSpeed = util.getMatcherValue(reqRules.reqSpeed);
      reqSpeed = reqSpeed && parseFloat(reqSpeed);
      if (reqSpeed > 0) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'speed' does not exist on type '{}'.
        data.speed = reqSpeed;
      }
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'headers' does not exist on type '{}'.
      var cookie = data.headers && data.headers.cookie;
      if (typeof cookie !== 'string') {
        if (Array.isArray(cookie)) {
          cookie = cookie.join('; ');
        } else {
          cookie = req.headers.cookie;
        }
      }
      util.setReqCookies(data, cookies, cookie);
      handleAuth(data, auth || authObj);
      util.setReqCors(data, cors);
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'method' does not exist on type '{}'.
      req.method = util.getMethod(data.method || req.method);
      util.readInjectFiles(data, function (data: any) {
        var bodyList = [
          reqRules.reqBody,
          reqRules.reqPrepend,
          reqRules.reqAppend
        ];
        util.getRuleValue(
          bodyList,
          function (reqBody: any, reqPrepend: any, reqAppend: any) {
            if (reqBody != null) {
              data.body = reqBody || util.EMPTY_BUFFER;
            }

            if (reqPrepend) {
              data.top = reqPrepend;
            }

            if (reqAppend) {
              data.bottom = reqAppend;
            }

            handleReq(req, data);
            handleParams(req, params, urlParams);
            if (req._urlParams || urlReplace) {
              var options = req.options;
              var isUrl = util.isUrl(options.href);
              var newUrl = isUrl ? options.href : req.fullUrl;
              if (req._urlParams) {
                newUrl = util.replaceUrlQueryString(newUrl, req._urlParams);
              }
              if (urlReplace) {
                newUrl = util.parsePathReplace(newUrl, urlReplace);
              }
              if (newUrl !== options.href) {
                if (isUrl) {
                  req.options = util.parseUrl(newUrl);
                } else {
                  req._realUrl = newUrl;
                }
              }
            }
            util.removeUnsupportsHeaders(req.headers);
            util.disableReqProps(req);
            handleReplace(req, replacement);
            var reqWriter = util.hasRequestBody(req)
              ? util.getRuleFile(reqRules.reqWrite)
              : null;
            util.getFileWriters(
              [reqWriter, util.getRuleFile(reqRules.reqWriteRaw)],
              function (writer: any, rawWriter: any) {
                if (writer) {
                  req.addZipTransform(
                    new FileWriterTransform(writer, req, false, false, true)
                  );
                }
                if (rawWriter) {
                  req.addZipTransform(
                    new FileWriterTransform(rawWriter, req, true, false, true)
                  );
                }
                pluginMgr.postStats(req);
                next();
              },
              util.isEnable(req, 'forceReqWrite')
            );
          },
          !util.hasRequestBody(req.method),
          null,
          null,
          req
        );
      });
    },
    req
  );
};
