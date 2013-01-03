var User = require('../models/user').User
  , _ = require('underscore')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
;


/********************
 *  Passport setup  *
 ********************/

passport.serializeUser(function(user, callback) {
  callback(null, user.id);
});

passport.deserializeUser(function(id, callback) {
  User.findOne({_id: id}, function(err, user) {
    callback(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, callback) {
  User.checkCredentials(username, password, function(err, fatal, user) {
    if (err) {
      if (fatal) {
        return callback(err);
      }
      return callback(null, false, { message: err.message });
    };
    return callback(null, user, { message: 'Welcome ' + username });
  });
}));


/**
 * Function used to handle the routing associated to
 * the login page '/login'
 *
 * @param {Object} application
 */
var route = function(app) {
  
  /**
   * Receive credentials
   *
   * @handle {Route#POST} /login
   */
  app.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      console.log(err, user, info);
      if (err) return next(err);
      if (!user) {
        return res.send(401, {
          status: 'failure',
          info: info,
          redirect: '/',
          user: null
        });
      }
      req.login(user, function(err) {
        if (err) return next(err);
        return res.send(200, {
          status: 'success',
          info: info,
          redirect: '/account',
          user: _.pick(user, ['name', 'email', 'username'])
        });
      });
    })(req, res, next);
  });

  /**
   * Logout
   */
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

};


/**
 * Expose public functions, classes and methods
 */
exports.route = route;
