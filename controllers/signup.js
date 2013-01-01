var User = require('../models/user').User;

/**
 * Function used to handle the routing associated to
 * the signup page '/signup'
 *
 * @param {Object} application
 */
var route = function(app) {
  
  /**
   * Signup page
   *
   * @handle {Route#GET} /signup
   */
  app.get('/signup', function(req, res) {
    res.render('signup', {
      title: 'GStrider signup'
    });
  });

  /**
   * POST the signup form
   *
   * @handle {Route#POST} /signup
   */
  app.post('/signup', function(req, res) {
    var new_user = null;
    req.onValidationError(function(msg) {
      return res.redirect('/signup');
    });
    req.check('email', 'Please enter a valid email').len(1).isEmail();
    req.check('password', 'Please enter a password with a length between 4 and 34 digits').len(4, 34);
    req.check('password_confirm', 'Please confirm your password').equals(req.body.password);
    req.check('username', 'Please enter your desired username').len(1);
    req.check('name.first', 'Please enter your first name').len(1);
    req.check('name.last', 'Please enter your last name').len(1);
    new_user = {
      name: {
        first: req.body.name.first,
        last: req.body.name.last
      },
      username: req.body.username,
      password: req.body.password,
      email: req.body.email
    };
    User.create(new_user, function(err, created_user) {
      if (err) throw err;
      return res.redirect('/account');
    });
  });

};


/**
 * Expose public functions, classes and methods
 */
exports.route = route;
