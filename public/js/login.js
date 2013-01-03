/**
 * Login module
 */

define([ 'jquery' ], function($) {

  var initialize = function() {

    $('#loginForm').submit(function(event) {
      
      event.preventDefault();

      var username = $('#username').val()
        , password = $('#password').val()
      ;

      var form = {};
      $(this).find('input, textarea, select').each(function(i, field) {
        form[field.name] = field.value;
      });

      var login_form = {
        username: form['username'],
        password: form['password']
      };

      $.ajax({
        type: 'POST',
        url: '/login',
        data: login_form,
        dataType: 'json',
        success: function(result) {
          console.log('success', result);

          if (result['redirect']) {
            window.location.href = result['redirect'];
          }
        },
        error: function(result) {
          console.log('error', result);
          if (result['redirect']) {
            window.location.href = result['redirect'];
          }
        }
        
      }); 

      ////
      ///
      //
      //if(username && password) {
        //$.post('/login', $(this).serialize(), function(response) {
          //if(response.retStatus === 'success') {
            //$('#signup-btn').hide();
            //$(location).attr('href', '/admin');
          //}
          //else if(response.retStatus === 'failure') {
            //$('#signup-error-modal').modal('show');
          //}
        //});
      //}
      
    });
   
    $('#logout-btn').click(function() {
      $.get('/logout', function(response) {});
    });

  };

  return {
    initialize: initialize
  };
});
