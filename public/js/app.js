//this is the main file which will be instantiated upon js load in browser
//require the basic libraries here
//require('jquery');

//define a module here that will initialize main page widgets
define(
  [ 'jquery', 'lodash', 'notifications', 'login', 'signup', 'account', 'bootstrap'],
  function($, _, Notifications, Login, Signup, Account) {

  var initialize = function() {

    Notifications.initialize();
    Login.initialize();
    Signup.initialize();
    Account.initialize();

  };
  
  return {
    initialize: initialize
  };
});
