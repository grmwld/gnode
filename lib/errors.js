var util = require('util')
;


/**
 * Abstract Error
 * 
 * @param {String} msg
 * @param {Object} constr
 */
var AbstractError = function(msg, constr) {
  Error.captureStackTrace(this, constr || this);
  this.name = 'Abstract Error';
  this.message = msg || 'Error';
  this.repr = {
    level: 'error',
    message: this.message
  };
};
util.inherits(AbstractError, Error);


/**
 * Authentication Error
 * 
 * @param {String} msg
 * @param {Object} constr
 */
var AuthError = function(msg) {
  AuthError.super_.call(this, msg, this.constructor);
  this.name = 'AuthError';
  this.message = msg || 'Authentication Error';
};
util.inherits(AuthError, AbstractError);


/**
 * Signup Error
 * 
 * @param {String} msg
 * @param {Object} constr
 */
var SignupError = function(msg) {
  SignupError.super_.call(this, msg, this.constructor);
  this.name = 'SignupError';
  this.message = msg || 'Signup Error';
};
util.inherits(SignupError, AbstractError);



module.exports = {
  AuthError: AuthError,
  SignupError: SignupError
};
