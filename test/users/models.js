'use strict';

var expect = require('chai').expect
  , utils = require('../utils')
  , User = require('../../models/user').User
  ;




describe('User', function() {

  var new_user = {
    name: {
      first: 'Alexis',
      last: 'GRIMALDI'
    },
    username: 'agrimaldi-model',
    password: 'secret',
    admin: true,
    email: 'agrimaldi@asd.com'
  };


  describe('.create()', function() {
    
    it('should create a new user in the database', function(done) {
      User.create(new_user, function(err, created_user) {
        expect(err).to.not.exist;
        expect(created_user).to.have.deep.property('name.first', new_user.name.first);
        expect(created_user).to.have.deep.property('name.last', new_user.name.last);
        expect(created_user).to.have.property('username', new_user.username);
        expect(created_user).to.have.property('email', new_user.email);
        expect(created_user).to.have.property('password', '');
        expect(created_user).to.have.property('passwordHash');
        expect(created_user.passwordHash).to.not.equal(new_user.password);
        done();
      });
    });

  });


  describe('.checkCredentials()', function() {

    var credentials = {
      valid: {
        username: new_user.username,
        password: new_user.password
      },
      invalid: {
        username: new_user.username,
        password: 'hackpass'
      },
      nonexist: {
        username: 'does_not_exist',
        password: new_user.password
      }
    };

    beforeEach(function(done) {
      User.remove(function(err) {
        User.create(new_user, function(err, created_user) {
          done(err);
        });
      });
    });

    it('responds with user if exists and password is correct', function(done) {
      User.checkCredentials(
            credentials.valid.username,
            credentials.valid.password, function(err, user) {
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
      User.checkCredentials(
            credentials.nonexist.username,
            credentials.nonexist.password, function(err, user) {
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
      User.checkCredentials(
            credentials.invalid.username,
            credentials.invalid.password, function(err, user) {
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

  
  describe('.hashPassword()', function() {
    
    it('should return a hashed password asynchronously', function(done) {
      var password = 'secret';
      User.hashPassword(password, function(err, passwordHash) {
        expect(err).to.not.exist;
        expect(passwordHash).to.exist;
        done();
      });
    });

  });


  describe('.checkPassword()', function() {

    beforeEach(function(done) {
      User.remove(function(err) {
        User.create(new_user, function(err, created_user) {
          done(err);
        });
      });
    });

    it('should return true if password is valid', function(done) {
      User.findByUsername(new_user.username, function(err, user) {
        expect(err).to.not.exist;
        user.checkPassword(new_user.password, function(err, isMatch) {
          expect(err).to.not.exist;
          expect(isMatch).to.be.true;
          done();
        });
      });
    });
    it('should return false if password is invalid', function(done) {
      var fakepassword = 'hackpass';
      User.findByUsername(new_user.username, function(err, user) {
        expect(err).to.not.exist;
        user.checkPassword(fakepassword, function(err, isMatch) {
          expect(err).to.not.exist;
          expect(isMatch).to.be.false;
          done();
        });
      });
    });

  });


});
