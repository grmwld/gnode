/**
 * Signup module
 */

define([ 'jquery', 'notifications' ], function($, Notifications) {

  var initialize = function() {

    $('#signupForm').submit(function(event) {
      
      event.preventDefault();

      var form = {};
      $(this).find('input, textarea, select').each(function(i, field) {
        form[field.name] = field.value;
      });

      var signup_form = {
        name: {
          first: form['firstname'],
          last: form['lastname']
        },
        username: form['username'],
        password: form['password'],
        password_confirm: form['password_confirm'],
        email: form['email']
      };

      $.ajax({
        type: 'POST',
        url: '/signup',
        data: signup_form,
        datatype: 'json',
        success: function(result) {
          Notifications.dispatch(result.info)
          if (result['redirect']) {
            setTimeout(function() {
              window.location.href = result['redirect'];
            }, 1500);
          }
        }
      }); 
    });
  };

  return {
    initialize: initialize
  };
});
