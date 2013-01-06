/**
 * Module dependencies
 */
var ensureAdmin = require('../lib/middlewares').ensureAdmin
var ensureAuthenticated = require('../lib/middlewares').ensureAuthenticated
;


/**
 * Function used to handle the routing associated to
 * the admin page '/admin'
 *
 * @param {Object} application
 */
var route = function(app) {
  
  /**
   * Route to admin page
   *
   * @handle {Route#GET} /admin
   */
  app.get('/admin', ensureAuthenticated, ensureAdmin, function(req, res) {
    res.render('admin', {
      title: 'GStrider : Admin'
    });
  });

};


/**
 * Expose public functions, classes and methods
 */
exports.route = route;
