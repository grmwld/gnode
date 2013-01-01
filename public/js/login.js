/**
 * Login module
 */

define([ 'jquery' ], function($) {

  var initialize = function() {
    $('#loginForm').submit(function(event) {
      
      event.preventDefault();

      var username = $('#username').val()
        , password = $('#password').val();

      /*
       * Do this check because the form submits even on Sign Up
       * button click
       */
      if(username && password) {
        $.post('/login', $(this).serialize(), function(response) {
          if(response.retStatus === 'success') {
            $('#loginForm').hide();
            $('#signup-btn').hide();
            $(location).attr('href', '/admin');
          }
          else if(response.retStatus === 'failure') {
            $('#signup-error-modal').modal('show');
          }
        });
      }
    });
   
    $('#logout-btn').click(function() {
      $.get('/logout', function(response) {});
    });
  };

  return {
    initialize: initialize
  };
});
