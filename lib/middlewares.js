/**
 * Module dependecies
 */
var User = require('../models/user').User
;


/**
 * Check if a user is authenticated
 */
var ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect(401, '/');
};

/**
 * Check if a user has admin privileges
 */
var ensureAdmin = function(req, res, next) {
  if (req.user.hasPrivilege('admin')) {
    return next();
  }
  return res.redirect(403, '/');
};


module.exports = {
  ensureAuthenticated: ensureAuthenticated,
  ensureAdmin: ensureAdmin
};
