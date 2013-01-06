/*************************
 *  Module dependencies  *
 *************************/

var util = require('util')
  , bcrypt = require('bcrypt')
  , mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , SignupError = require('../lib/errors').SignupError
  , AuthError = require('../lib/errors').AuthError
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
    unique: true
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
    unique: true
  },
  privileges: Array,
  instances: Array,
  bookmarks: Array
});



/*****************
 *  Middlewares  *
 *****************/

/**
 * Initialize availability errors
 */
//userSchema.pre('save', function startChecks(next, errors) {
  //next([]);
//});

/**
 * Check that the username is available
 */
userSchema.pre('save', function checkUsername(next/*, errors*/) {
  var self = this
    //, errors = errors
  ;
  mongoose.models['User'].findByUsername(self['username'], function(err, user) {
    if (err) next(err);
    if (user) {
      self.invalidate('username', 'Unavailable username');
      next(new SignupError('Unavailable username'));
    }
    next();
  });
});

/**
 * Check that the email address is available
 */
userSchema.pre('save', function checkEmail(next/*, errors*/) {
  var self = this
    //, errors = errors
  ;
  mongoose.models['User'].findByEmail(self['email'], function(err, user) {
    if (err) next(err);
    if (user) {
      self.invalidate('email', 'Unavailable email');
      next(new SignupError('Unavailable email'));
    }
    next();
  });
});

/**
 * Parse availability errors
 */
//userSchema.pre('save', function finishChecks(next, errors) {
  //console.log(errors);
  //next(errors);
//});

/**
 * Hash the password synchronously
 */
userSchema.pre('save', function hashPassword(next) {
  var self = this;
  userSchema.statics.hashPassword(self['password'], function(err, hash) {
    if (err) next(err);
    self['passwordHash'] = hash;
    self['password'] = '';
    next();
  });
});



/****************
 *  Validators  *
 ****************/



/*************
 *  Methods  *
 *************/

/**
 * check if a user password matches a candidated password
 *
 * @param {string} password
 * @param {function} callback
 */
userSchema.methods.checkPassword = function(password, callback) {
  bcrypt.compare(password, this.passwordHash, function(err, isMatch) {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

/**
 * check if a user has a given privilege
 *
 * @param {String} privilege
 * @returns {Boolean}
 */
userSchema.methods.hasPrivilege = function(privilege) {
  return (this['privileges'].indexOf(privilege) > -1);
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
};

/**
 * Find a user by its email
 *
 * @param {String} email
 * @param {Function} callback
 */
userSchema.statics.findByEmail = function(email, callback) {
  this.findOne({email: email}, callback);
};

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
      callback(new AuthError('Username does not exist'), null);
    }
    else {
      user.checkPassword(password, function(err, isMatch) {
        if (err) {
          callback(err);
        }
        if(isMatch) {
          callback(null, user);
        }
        else {
          callback(new AuthError('Invalid Password'), null);
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
