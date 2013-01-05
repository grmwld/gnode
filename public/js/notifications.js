/**
 * Notifications
 */

define([ 'jquery', 'lodash' ], function($, _) {

  var alert = _.template([
    '<div class="alert alert-<%= level %> fade in">',
    '    <button type="button" class="close" data-dismiss="alert">&times;</button>',
    '    <%= message %>',
    '</div>'].join('\n')
  );
    
  var initialize = function() {};

  /**
   * Clean the notification area
   */
  var clean = function() {
    $('#notifications').empty();
  };

  /**
   * Add a flash message to the notification area
   */
  var add = function(info) {
    $('#notifications').append(alert(info));
  };

  /**
   * Dispatch all messages in info after cleaning the notifications area
   */
  var dispatch = function(info) {
    clean();
    if (info instanceof Array) {
      info.forEach(function(msg) {
        add(msg);
      });
    }
    else {
      add(info);
    }
  };

  return {
    initialize: initialize
  , dispatch: dispatch
  };
});
