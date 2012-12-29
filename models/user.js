var util = require('util')
  , bcrypt = require('bcrypt')
  , mongoose = require('mongoose')
  , Schema = mongoose.Schema
  ;


var toLower = function(string) {
  return string.toLowerCase();
};


var userSchema = new Schema({
  username: {
    type: String,
    set: toLower,
    index: { uniq: true }
  },
  password: String,
  email: {
    type: String,
    set: toLower,
    index: { uniq: true }
  },
  admin: Boolean,
  bookmarks: Array,
});


/**
 * Methods
 */


/**
 * Statics
 */

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
  this.findByUsername(username, function(err, user) {
    if(!user) {
      callback(new Error('AuthFailed : Username does not exist'));
    }
    else {
      if(password === user.password) {
        util.log('Authenticated User ' + username);
        callback(null, user);
      }
      else {
        callback(new Error('AuthFailed : Invalid Password'));
      }
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

/**
 * compare a password to a hashed password
 *
 * @param {String} password
 * @param {String} hash
 * @param {Function} callback
 */
userSchema.statics.comparePasswordAndHash = function(password, hash, callback) {
    bcrypt.compare(password, hash, callback);
};


exports.User = mongoose.model('User', userSchema);
