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


module.exports = {
  AuthError: AuthError
};
