var mongoose = require('mongoose')
  ;

var userSchema = mongoose.Schema({
  username: String
, password: String
});

userSchema.methods.validPassword = function(password) {
  if (password === this.password) {
    return true;
  }
  return false;
}

exports.User = mongoose.model('User', userSchema);
