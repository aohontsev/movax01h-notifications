'use strict';

/**
 * Module dependencies.
 */
let log4js = require('log4js');
let log = log4js.getLogger('controller/users/login.js');
let passport = require('passport');
/** End of dependencies. */

module.exports = function(req, res, next) {
  log.info('someone trying to login');

  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
  })(req, res, next);
};
