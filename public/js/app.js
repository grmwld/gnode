//this is the main file which will be instantiated upon js load in browser
//require the basic libraries here
//require('jquery');

//define a module here that will initialize main page widgets
define([
    'jquery'
  , 'login'
  , 'signup'
   //, 'admin'
], function($, Login, Signup) {
  var initialize = function() {
    Login.initialize();
    Signup.initialize();
  }
  return {
    initialize: initialize
  };
});
