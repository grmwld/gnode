/**
 * Module dependencies.
 */
var express = require('express')
  , less = require('less-middleware')
  , passport = require('passport')
  , http = require('http')
  , path = require('path')
  , flash = require('connect-flash')
  ;


/**
 * Passport configuration
 */
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, next) {
  next(null, user);
});

passport.deserializeUser(function(id, next){
  next(null, id);
});

passport.use(new LocalStrategy(function(username, password, next) {
  // asynchronous verification, for effect...
  process.nextTick(function () {
    User.findOne({username: username}, function(err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(null, false, {
          message: 'Unknown user ' + username
        });
      }
      if (!user.validPassword(password)) {
        return next(null, false, {message: 'Invalid password'});
      }
      return next(null, user);
    })
  });
}));


/**
 * Create the main app
 */
var app = express();


/**
 * express configuration
 */
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session({
    cookie: {maxAge: 60000},
    secret: 'live long and prosper'
  }));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
  });
  app.use(app.router);
  app.use(less({
    src: __dirname + '/public',
  }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
  console.log('Application started in development mode.');
});

app.configure('production', function() {
  console.log('Application started in production mode.');
});


/**
 * Controllers and routing
 */
var home = require('./controllers/home');
var login = require('./controllers/login');
var signup = require('./controllers/signup');

home.route(app);
login.route(app);
signup.route(app);


/**
 * Top level error handling
 */


/**
 * Startup the app
 */
http.createServer(app).listen(app.get('port'), function(){
  console.log("gstrider listening on port " + app.get('port'));
});
