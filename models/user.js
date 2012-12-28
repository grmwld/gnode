var util = require('util')
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

userSchema.statics.findByUsername = function(username, callback) {
  this.findOne({username: username}, callback);
}

userSchema.statics.checkCredentials = function(username, password, callback) {
  this.findByUsername(username, function(err, user) {
    console.log(username, password);
    console.log(user.password);
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


module.exports = mongoose.model('User', userSchema);
