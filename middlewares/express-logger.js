'use strict';

/**
 * Module dependencies.
 */
let log4js = require('log4js');
let log = log4js.getLogger('middlewares/express-logger.js');
/** End of dependencies. */

// Custom logger for express requests.
module.exports = function(req, res, next) {
  let date = new Date();
  let hh = date.getHours();
  let mm = date.getMinutes();
  let time = hh + ':' + mm;

  log.info(time, '[' + req.method + ']:', req.url);
  next();
};
