'use strict';

/**
 * Module dependencies.
 */
/** End of dependencies. */

module.exports = function(req, res, next) {
  req.isAuthenticated()
      ? next()
      : res.redirect('/private');
};
