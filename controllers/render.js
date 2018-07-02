'use strict';

/**
 * Module dependencies.
 */
/** End of dependencies. */

// Wrapper over res.render().
module.exports = function(template, variables) {
  return function(req, res) {
    res.render(template, variables);
  };
};
