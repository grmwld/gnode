//this will be the bootstrap js for initializing the requirejs config

//global configuration. put the global script paths here
requirejs.config({
  baseUrl : '/js/'
, paths : {
    'jquery' : 'vendor/jquery/jquery.min'
  , 'bootstrap' : 'vendor/bootstrap/bootstrap.min'
  }
, shim : {
    'bootstrap' : ['jquery']
  }
});

//initialize the main router here..
//since this is a require and not define, there is no need to return an object
require(['app'], function(App) {
  App.initialize();
});

