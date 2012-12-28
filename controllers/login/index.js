var User = require('../../models/user.js')
  ;


/**
 * Dummy data
 */
var userOne = new User({
  username: 'agirmaldi',
  password: 'qwe',
  admin: true,
  email: 'agrimali@asd.com'
});
var userTwo = new User({
  username: 'akaras',
  password: 'asd',
  admin: false,
  email: 'akaras@asd.com'
});
userOne.save(function(err) {
  if (err) return 'sd';
});
userTwo.save(function(err) {
  if (err) return 'sd';
});



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
    var username = req.body.user;
    var password = req.body.password;
    User.checkCredentials(username, password, function(err, user) {
      if (err && !user) {
        res.json({ retStatus: 'failure' });
      }
      else {
        console.log(user);
        req.session.user = user;
        res.json({
          retStatus: 'success',
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
