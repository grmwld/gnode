/**
 * Module dependencies.
 */
var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')
  , http = require('http')
  , path = require('path');


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
  app.use(express.session());
  app.use(app.router);
  app.use(stylus.middleware({
    src: __dirname + '/public',
    compile: function(str, path){
      return stylus(str)
        .set('filename', path)
        .set('compress', true)
        .use(nib());
    }              
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
 * Sub-applications
 */
var home = require('./mods/home');
var login = require('./mods/login');
var signup = require('./mods/signup');

app.use(home);
app.use(login);


/**
 * Top level error handling
 */


/**
 * Startup the app
 */
http.createServer(app).listen(app.get('port'), function(){
  console.log("gstrider listening on port " + app.get('port'));
});
