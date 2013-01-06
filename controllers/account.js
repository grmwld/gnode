var ensureAuthenticated = require('../lib/middlewares').ensureAuthenticated
;


/**
 * Function used to handle the routing associated to
 * the account page '/account'
 *
 * @param {Object} application
 */
var route = function(app) {
  
  /**
   * Route to account
   *
   * @handle {Route#GET} /account
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
