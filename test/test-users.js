var expect = require('chai').expect
  , async = require('async')
  , mongoose = require('mongoose')
  , User = require('../models/user').User
  ;


describe('User', function() {
  var connection = mongoose.connect('mongodb://localhost/gstrider_test');
  var userOne = new User({
    username: 'agrimaldi',
    password: 'qwe',
    admin: true,
    email: 'agrimaldi@asd.com'
  });

  beforeEach(function(done) {
    User.collection.remove(function(err) {
      if (err) return done(err);
      userOne.save(function(err) {
        done(err);
      });
    });
  });

  describe('.checkCredentials()', function() {
    it('responds with user if exists and password is correct', function(done) {
      User.checkCredentials('agrimaldi', 'qwe', function(err, user) {
        try {
          expect(err).to.not.exist;
          expect(user).to.be.a('object');
          done(err);
        }
        catch(err) {
          done(err);
        }
      });
    });
    it('responds with error if does not exists', function(done) {
      User.checkCredentials('non-existent', 'qwe', function(err, user) {
        try {
          expect(err).to.be.an.instanceof(Error);
          expect(user).to.be.undefined;
          done();
        }
        catch(err) {
          done(err);
        }
      });
    });
    it('responds with error if password does not match', function(done) {
      User.checkCredentials('agrimaldi', 'qweasd', function(err, user) {
        try {
          expect(err).to.be.an.instanceof(Error);
          expect(user).to.be.undefined;
          done();
        }
        catch(err) {
          done(err);
        }
      });
    });
  });
});
