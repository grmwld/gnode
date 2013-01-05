var ensureAuthenticated = require('../lib/middlewares').ensureAuthenticated
;


/**
 * Function used to handle the routing associated to
 * the homepage '/'
 *
 * @param {Object} application
 */
var route = function(app) {
  
  /**
   * Route to homepage
   *
   * @handle {Route#GET} /
   */
  app.get('/account', ensureAuthenticated, function(req, res) {
    res.render('account', {
      title: 'GStrider : Account'
    });
  });

};


/**
 * Expose public functions, classes and methods
 */
exports.route = route;
