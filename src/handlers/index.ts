// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = [
  './file-proxy',
  './plugin-handler',
  './http-proxy',
  './final-handler',
  './error-handler'
].map(function (mod) {
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  return require(mod);
});
