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
  admin: Boolean,
  bookmarks: Array,
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
      next(new Error('Unavailable username'));
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
      next(new Error('Unavailable email'));
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
      callback(err, true);
    }
    if(!user) {
      callback(new Error('AuthFailed : Username does not exist'), false, null);
    }
    else {
      user.checkPassword(password, function(err, isMatch) {
        if (err) {
          callback(err, true);
        }
        if(isMatch) {
          callback(null, false, user);
        }
        else {
          callback(new Error('AuthFailed : Invalid Password'), false, null);
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
