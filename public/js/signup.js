/**
 * Signup module
 */

define([ 'jquery' ], function($) {

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
        datatype: 'json'
      }); 
    });
  };

  return {
    initialize: initialize
  };
});
