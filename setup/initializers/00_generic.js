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
let config = require('nconf');
// let express = require('express');
let expressLogger = require('../../middlewares/express-logger');
let passport = require('passport');
let rootDir = process.env.PWD || process.cwd();
// let favicon = require('serve-favicon');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let session = require('express-session');
let methodOverride = require('method-override');
let errorhandler = require('errorhandler');
// let routes = express.Router();
/** End of dependencies. */

module.exports = function() {
  // Setup nconf
  config.file({'file': rootDir + '/config.json'});

  this.set('views', rootDir + '/views');
  this.set('view engine', 'pug');
  this.use(expressLogger);
  this.use(methodOverride());
  this.use(cookieParser());
  this.use(bodyParser.json());
  this.use(bodyParser.urlencoded({extended: false}));
  this.use(session({
    secret: process.env.SECRET_KEY || 'shmecret',
    resave: true,
    saveUninitialized: true,
  }));
  this.use(passport.initialize());
  this.use(passport.session());
  this.use(errorhandler());
};
