'use strict';

let express = require('express');
let bootable = require('bootable');
let stylus = require('stylus');
let nib = require('nib');

let log4js = require('log4js');
let log = log4js.getLogger('app.js');
let config = require('nconf');

let app = bootable(express());

/**
 * Add nib to stylus.
 * @param {string} str The first number.
 * @param {string} path The second number.
 * @return {Renderer|Authenticator|*}
 */
function compile(str, path) {
  return stylus(str).set('filename', path).use(nib());
}

app.use(stylus.middleware(
    {
      src: __dirname + '/public',
      compile: compile,
    }
));
app.use(express.static(__dirname + '/public'));

// Setup initializers
app.phase(bootable.initializers('setup/initializers/'));

// Setup routes
app.phase(bootable.routes('routes/', app));

// Boot app
app.boot(function(err) {
  if (err) {
    throw err;
  }
  app.listen(process.env.PORT || config.get('express:port'), function() {
    log.info('Express listen port', config.get('express:port'));
  });
});
