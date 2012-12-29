'use strict';


var config = require('../config')
  , mongoose = require('mongoose')
  ;

// ensure the NODE_ENV is set to 'test'
// this is helpful when you would like to change behavior when testing
process.env.NODE_ENV = 'test';



beforeEach(function (done) {

  var clearDB = function() {
    for (var i in mongoose.connection.collections) {
      mongoose.connection.collections[i].remove(function() {});
    }
    return done();
  };

  var reconnect = function() {
    mongoose.connect(config.db.test, function(err) {
      if (err) throw err;
      return clearDB();
    });
  };

  var checkState = function() {
    switch (mongoose.connection.readyState) {
      case 0:
        reconnect();
        break;
      case 1:
        clearDB();
        break;
      default:
        process.nextTick(checkState);
    }
  };

  checkState();
});


afterEach(function (done) {
  mongoose.disconnect();
  return done();
});
