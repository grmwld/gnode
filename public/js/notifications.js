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

  var dispatch = function(info) {
    $('#notifications').empty();
    $('#notifications').append(alert(info));
  };

  return {
    initialize: initialize
  , dispatch: dispatch
  };
});
