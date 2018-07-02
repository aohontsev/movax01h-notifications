'use strict';

/**
 * Module dependencies.
 */
let User = require('mongoose').model('user');
/** End of dependencies. */

module.exports = function(req, res, next) {
  let user = new User({username: req.body.email, password: req.body.password});
  user.save(function(err, newUser) {
    return err
        ? next(err)
        : req.login(user, function(err) {
          return err
              ? next(err)
              : res.redirect('/');
        });
  });
};
