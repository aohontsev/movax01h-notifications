'use strict';

/**
 * Module dependencies.
 */
let mongoose = require('mongoose');
/** End of dependencies. */

/**
 * @class UserSchema
 */
let UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  is_admin: {
    type: Boolean,
    required: true,
    default: false,
  },
  home_cleanup_telegram_chat_id: {
    type: Number,
    default: null,
  },
});

module.exports = UserSchema;
mongoose.model('user', UserSchema);
