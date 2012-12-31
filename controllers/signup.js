
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
    res.redirect('/account')
  });

};


/**
 * Expose public functions, classes and methods
 */
exports.route = route;
