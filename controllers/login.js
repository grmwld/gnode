var User = require('../models/user').User
;

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
  app.post('/login', function(req, res) {
    var username = req.body.username
      , password = req.body.password
    ;
    User.checkCredentials(username, password, function(err, user) {
      if (err && !user) {
        res.send({ status: 'failure' });
      }
      else {
        req.session.user = user;
        res.send({
          status: 'success',
          user: user
        });
      }
    }); 
  });

};


/**
 * Expose public functions, classes and methods
 */
exports.route = route;
