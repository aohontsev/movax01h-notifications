'use strict';

/**
 * Module dependencies.
 */
let log4js = require('log4js');
let log = log4js.getLogger('controller/users/logout.js');
/** End of dependencies. */


module.exports = function(req, res) {
  log.warn('User will logout');
  req.logout();
  res.redirect('/');
};
