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
let log = log4js.getLogger('03_telegram.js');
let mongoose = require('mongoose');
let TelegramBot = require('node-telegram-bot-api');
let Task = require('mongoose').model('task');
/** End of dependencies. */

module.exports = function() {
  let bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {polling: true});
  let groupChatID = -1001260852981;
  let GMTMoscow = 3;

  /**
   * Get current time in UTC.
   * @param {date} GMT
   * @return {Date}
   */
  function currentUTCTime(GMT) {
    let now = new Date();
    return new Date(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours() + GMT,
        now.getUTCMinutes(),
        now.getUTCSeconds()
    );
  }

  /**
   * Get current day of week.
   * @return {number}
   */
  function getCurrentDayOfWeek() {
    let d = currentUTCTime(GMTMoscow);
    return d.getDay();
  }

  /**
   * Get current time in UTC.
   * @return {number}
   */
  function getCurrentTime() {
    let d = currentUTCTime(GMTMoscow);
    return d.getHours();
  }

  bot.on('message', (msg) => {
    const check = 'check';
    if (msg.text.toString().toLowerCase().indexOf(check) === 0) {
      bot.sendMessage(msg.chat.id, 'I\'m alive!');
    }
  });

  setInterval(function() {
    mongoose.connection.db.collection('tasks').find().toArray((err, result) => {
      if (err) return log.error(err);
      for (let i = 0; i < result.length; i++) {
        let item = result[i];

        if (item.last_notification_send === getCurrentDayOfWeek()) {
          continue;
        }

        // Sending yesterday and later.
        if (item.last_notification_send !== getCurrentDayOfWeek() &&
            item.last_notification_send !== 0) {
          // Set not sending yet
          item.last_notification_send = 0;

          Task.findById(item._id, function(err, task) {
            if (err) return log.error(err);

            task.set({last_notification_send: 0});
            task.save(function(err, updatedTask) {
              if (err) return log.error(err);
            });
          });
        }

        if (item.days_period) {
          if (item.last_notification_send === 0 &&
              item.time_notification <= getCurrentTime()) {
            bot.sendMessage(groupChatID, item.current_user + item.message);
            item.current_day_period += 1;
            if (item.current_day_period >= item.days_period) {
              item.current_day_period = 1;

              let func = function(element) {
                return element === item.current_user;
              };

              let nextUserIndex = item.users_period.findIndex(func) + 1;
              if (nextUserIndex >= item.users_period.length) {
                nextUserIndex = 0;
              }
              item.current_user = item.users_period[nextUserIndex];
            }

            item.last_notification_send = getCurrentDayOfWeek();

            Task.findById(item._id, function(err, task) {
              if (err) return log.error(err);

              task.set({
                last_notification_send: item.last_notification_send,
                current_day_period: item.current_day_period,
                current_user: item.current_user,
              });
              task.save(function(err, updatedTask) {
                if (err) return log.error(err);
              });
            });
          }
        } else {
          if (item.last_notification_send === 0 &&
              item.day_notification.includes(getCurrentDayOfWeek()) &&
              item.time_notification <= getCurrentTime()) {
            bot.sendMessage(groupChatID, item.current_user + item.message);
            item.last_notification_send = getCurrentDayOfWeek();

            Task.findById(item._id, function(err, task) {
              if (err) return log.error(err);

              task.set({last_notification_send: item.last_notification_send});
              task.save(function(err, updatedTask) {
                if (err) return log.error(err);
              });
            });
          }
        }
      }
    });
  }, 5 * 60 * 1000); // every 30 minutes);
};
