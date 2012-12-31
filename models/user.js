/*************************
 *  Module dependencies  *
 *************************/

var util = require('util')
  , bcrypt = require('bcrypt')
  , mongoose = require('mongoose')
  , Schema = mongoose.Schema
  ;



/***********************
 *  Utility functions  *
 ***********************/

var toLower = function(string) {
  return string.toLowerCase();
};



/**********************
 *  Shema definition  *
 **********************/

var userSchema = new Schema({
  username: {
    type: String,
    set: toLower,
    uniq: true
  },
  name: {
    first: String,
    last: String
  },
  passwordHash: String,
  password: String,
  email: {
    type: String,
    set: toLower,
    uniq: true
  },
  admin: Boolean,
  bookmarks: Array,
});



/*****************
 *  Middlewares  *
 *****************/

/**
 * Hash the password synchronously
 */
userSchema.pre('save', function(next) {
  var user = this;
  userSchema.statics.hashPassword(user.password, function(err, hash) {
    user.passwordHash = hash;
    user.password = '';
    next();
  });
  //next();
});



/*************
 *  Methods  *
 *************/

/**
 * Check if a user password matches a candidated password
 *
 * @param {String} username
 * @param {String} password
 * @param {Function} callback
 */
userSchema.methods.checkPassword = function(password, callback) {
  bcrypt.compare(password, this.passwordHash, function(err, isMatch) {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};



/*************
 *  Statics  *
 *************/

/**
 * Find a user by its username
 *
 * @param {String} username
 * @param {Function} callback
 */
userSchema.statics.findByUsername = function(username, callback) {
  this.findOne({username: username}, callback);
}

/**
 * Find a user by its username
 *
 * @param {String} username
 * @param {String} password
 * @param {Function} callback
 */
userSchema.statics.checkCredentials = function(username, password, callback) {
  var self = this;
  self.findByUsername(username, function(err, user) {
    if (err) {
      callback(err);
    }
    if(!user) {
      callback(new Error('AuthFailed : Username does not exist'));
    }
    else {
      user.checkPassword(password, function(err, isMatch) {
        if (err) {
          callback(err);
        }
        if(isMatch) {
          util.log('Authenticated User ' + username);
          callback(null, user);
        }
        else {
          callback(new Error('AuthFailed : Invalid Password'));
        }
      });
    }
  });
};

/**
 * Hash a password
 *
 * @param {String} password
 * @param {Function} callback
 */
userSchema.statics.hashPassword = function(password, callback) {
  var BCRYPT_COST = (process.env.NODE_ENV === 'test') ? 1 : 10;
  bcrypt.hash(password, BCRYPT_COST, callback);
};



exports.User = mongoose.model('User', userSchema);
