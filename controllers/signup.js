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
    var new_user = null
      , errors = null
    ;
    req.check('email', 'Invalid email').isEmail();
    req.check('password', 'Password must be between 4 and 34 characters').len(4, 34);
    req.check('password_confirm', 'Passwords do not match').equals(req.body.password);
    req.check('username', 'Username must be at least 3 character long').len(3);
    req.check('username', 'Valid characters for Username include alphanumeric characters, dash (-) and underscore (_) ').is(/[A-Za-z\-_]+/);
    req.check('name.first', 'First name must be composed of letters').isAlpha();
    req.check('name.last', 'Last name must be composed of letters').isAlpha();
    
    errors = req.validationErrors();
    if (errors) {
      return res.redirect('/signup');
    }

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
      if (err) {
        return res.send({
          error: err,
          redirect: false
        });
      };
      return res.send({
        error: null,
        redirect: '/account'
      });
    });
  });

};


/**
 * Expose public functions, classes and methods
 */
exports.route = route;
