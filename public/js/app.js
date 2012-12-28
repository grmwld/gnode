//this is the main file which will be instantiated upon js load in browser
//require the basic libraries here
//require('jquery');

//define a module here that will initialize main page widgets
define([
    'jquery'
  , 'login'
   //, 'javascripts/signup'
   //, 'admin'
], function($, Login) {
  var initialize = function() {
    Login.initialize();
  }
  return {
    initialize: initialize
  };
});
