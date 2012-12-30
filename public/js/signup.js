//Filename: boilerplate.js

define([ 'jquery' ], function($) {

  var initialize = function() {
    $('#signupForm').submit(function(event) {
      
      event.preventDefault();

      var username = $('#username').val()
        , password = $('#password').val();

      /*
       * Do this check because the form submits even on Sign Up
       * button click
       */
  };

  return {
    initialize: initialize
  };
});
