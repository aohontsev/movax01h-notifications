'use strict';

/**
 * Module dependencies.
 */
let mongoose = require('mongoose');
/** End of dependencies. */

/**
 * @class TaskSchema
 */
let TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    default: null,
  },
  days_period: {
    type: Number,
    default: null,
  },
  current_day_period: {
    type: Number,
    default: null,
  },
  users_period: {
    type: [String],
    default: null,
  },
  current_user: {
    type: String,
    default: null,
  },
  day_notification: {
    type: [Number],
    default: null,
  },
  time_notification: {
    type: Number,
    default: 18,
  },
  last_notification_send: {
    type: Number,
    default: 0,
  },
});

module.exports = TaskSchema;
mongoose.model('task', TaskSchema);
