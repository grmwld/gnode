/**
 * Login module
 */

define([ 'jquery', 'notifications' ], function($, Notifications) {

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

      if (username && password) {
        $.ajax({
          type: 'POST',
          url: '/login',
          data: login_form,
          dataType: 'json',
          success: function(result) {
            Notifications.dispatch(result.info);

            if (result['redirect']) {
              setTimeout(function() {
                window.location.href = result['redirect'];
              }, 1500);
            }
          },
          error: function(jqXHR) {
            var result = $.parseJSON(jqXHR['responseText']);
            Notifications.dispatch(result.info);
          }
        }); 
      }

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
