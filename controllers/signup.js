
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
    req.onValidationError(function(msg) {
      return res.redirect('/signup');
    });
    req.check('email', 'Please enter a valid email').len(1).isEmail();
    req.check('password', 'Please enter a password with a length between 4 and 34 digits').len(4, 34);
    req.check('password_confirm', 'Please confirm your password').equals(req.body.password);
    req.check('username', 'Please enter your desired username').len(1);
    req.check('name.first', 'Please enter your first name').len(1);
    req.check('name.last', 'Please enter your last name').len(1);
    res.redirect('/account');
  });

};


/**
 * Expose public functions, classes and methods
 */
exports.route = route;
