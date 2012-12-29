
/**
 * Function used to handle the routing associated to
 * the signup page '/signup'
 *
 * @param {Object} application
 */
var route = function(app) {
  
  /**
   * Route to homepage
   *
   * @handle {Route#GET} /signup
   */
  app.get('/signup', function(req, res) {
    res.render('signup', {
      title: 'GStrider signup'
    });
  });

};


/**
 * Expose public functions, classes and methods
 */
exports.route = route;
