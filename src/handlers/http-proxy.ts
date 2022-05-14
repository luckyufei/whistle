// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function (req: any, res: any, next: any) {
  if (!req.isWebProtocol) {
    next();
    return;
  }
  req.request(req.options);
};
