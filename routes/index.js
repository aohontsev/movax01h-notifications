'use strict';

/**
 * Module dependencies.
 */
let requireTree = require('require-tree');
let controllers = requireTree('../controllers');
let mustAuthenticatedMw = require('../middlewares/must-authenticated');
let mongoose = require('mongoose');
let Task = require('mongoose').model('task');
/** End of dependencies. */

module.exports = function() {
  // Only for registred users
  this.all('/admin', mustAuthenticatedMw);
  this.all('/admin/*', mustAuthenticatedMw);

  // Basic routes
  this.get('/', controllers.render('index.pug'));
  this.get('/private', controllers.render('private.pug'));
  this.get('/fail', controllers.render('fail.pug'));

  // Auth routes
  this.get('/login', controllers.render('auth/login.pug'));
  this.get('/register', controllers.render('auth/register.pug'));

  // Auth controllers
  this.post('/login', controllers.users.login);
  this.post('/register', controllers.users.register);
  this.get('/logout', controllers.users.logout);

  // Admin routes
  this.get('/admin', controllers.render('admin/index.pug'));

  // Admin users
  this.get('/admin/users', (req, res) => {
    mongoose.connection.db.collection('users').find().toArray((err, result) => {
      if (err) return log(err);
      log.info(result);
      res.render('admin/users/view_all.pug', {users: result});
    });
  });

  this.post('/admin/users', (req, res) => {
    mongoose.connection.db.collection('users').save(req.body, (err, result) => {
      if (err) return console.log(err);
      log.info('saved to database');
      res.render('admin/');
    });
  });

  // Admin tasks
  this.get('/admin/home_cleanup_bot/tasks', (req, res) => {
    mongoose.connection.db.collection('tasks').find().toArray((err, result) => {
      if (err) return log(err);
      log.info(result);
      res.render('admin/home_cleanup_bot/tasks.pug', {tasks: result});
    });
  });
  this.post('/admin/home_cleanup_bot/tasks', (req, res) => {
    let task = new Task(req.body);
    task.save(function(err) {
      if (err) return console.log(err);
      log.info('saved to database');
      res.render('admin/');
    });
  });
};
