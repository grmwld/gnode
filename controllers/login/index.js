
/**
 * Function used to handle the routing associated to
 * the login page '/login'
 *
 * @param {Object} application
 */
var route = function(app) {
  
  /**
   * Route to homepage
   *
   * @handle {Route#GET} /login
   */
  app.get('/login', function(req, res) {
    res.render('login', {
      title: 'GStrider login'
    });
  });

};


/**
 * Expose public functions, classes and methods
 */
exports.route = route;
