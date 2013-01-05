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
  return res.json(401, {
    redirect: '/'
  });
};

/**
 * Check if a user has admin privileges
 */
//var ensureAdmin = function(req, res, next) {
  //if (req.isAuthenticated()) {
    //if (req.user.hasRole) {
      //// body ...
    //}
    //return next();
  //}
  //return res.json({
    //redirect: '/'
  //});
//};


exports.ensureAuthenticated = ensureAuthenticated;
