// Any files in this directory will be `require()`'ed when the application
// starts, and the exported function will be invoked with a `this` context of
// the application itself.  Initializers are used to connect to databases and
// message queues, and configure sub-systems such as authentication.

// Async initializers are declared by exporting `function(done) { /*...*/ }`.
// `done` is a callback which must be invoked when the initializer is
// finished.  Initializers are invoked sequentially, ensuring that the
// previous one has completed before the next one executes.

'use strict';

/**
 * Module dependencies.
 */
let log4js = require('log4js');
let log = log4js.getLogger('01_mongoose.js');
let config = require('nconf');

let mongoose = require('mongoose');
let requireTree = require('require-tree');
requireTree('../../models/');
/** End of dependencies. */


module.exports = function(done) {
  mongoose.connection.on('open', function() {
    log.info('Connected to mongo server!');
    if (done) return done();
  });

  mongoose.connection.on('error', function(err) {
    log.error('Could not connect to mongo server!');
    log.error(err.message);
    if (done) return done(err);
  });

  try {
    mongoose.connect(
        config.get('mongoose:db').
            replace(/<MONGODB_PASSWORD>/, process.env.MONGODB_PASSWORD),
        {useMongoClient: true}
    );
    log.info('Started connection on ' + (config.get('mongoose:db')) +
        ', waiting for it to open...');
  } catch (err) {
    log.error(('Setting up failed to connect to ' + config.get('mongoose:db')),
        err.message);
    if (done) done(err);
  }
};
