/**
 * Module dependencies.
 */
var express = require('express')
  , less = require('less-middleware')
  , passport = require('passport')
  , mongoose = require('mongoose')
  , http = require('http')
  , path = require('path')
  , flash = require('connect-flash')
  , validator = require('express-validator')
  , config = require('./config')
  ;


/**
 * Create the main app
 */
var app = module.exports = express();


/**
 * express configuration
 */
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('dbUrl', config.db[app.settings.env]);
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
  app.use(validator);
  app.use(app.router);
  app.use(less({
    src: __dirname + '/public',
  }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('test', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
  console.log('Application started in test mode.');
});

app.configure('development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
  console.log('Application started in development mode.');
});

app.configure('production', function() {
  console.log('Application started in production mode.');
});


/**
 * MongoDB connection
 */
mongoose.connect(app.get('dbUrl'));


/**
 * Controllers and routing
 */
var home = require('./controllers/home');
var login = require('./controllers/login');
var about = require('./controllers/about');
var contact = require('./controllers/contact');
var documentation = require('./controllers/documentation');
var account = require('./controllers/account');
var signup = require('./controllers/signup');

home.route(app);
login.route(app);
about.route(app);
contact.route(app);
documentation.route(app);
account.route(app);
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
