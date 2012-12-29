'use strict';

var expect = require('chai').expect
  , utils = require('../utils')
  , User = require('../../models/user').User
  ;


beforeEach(function(done) {
  var userOne = new User({
    username: 'agrimaldi',
    password: 'qwe',
    admin: true,
    email: 'agrimaldi@asd.com'
  });
  User.remove(function(err) {
    userOne.save(function(err) {
      done(err);
    });
  });
});


describe('User', function() {

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
          expect(err.message).to.equal('AuthFailed : Username does not exist');
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
          expect(err.message).to.equal('AuthFailed : Invalid Password');
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
