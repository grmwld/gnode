'use strict';

var expect = require('chai').expect
  , utils = require('../utils')
  , request = require('supertest')
  , User = require('../../models/user').User
  , app = require('../../app')
  ;

  
describe('POST /signup', function() {

  var valid_form = {
    username: 'agrimaldi',
    password: 'qwe',
    password_confirm: 'qwe',
    email: 'agrimaldi@gstrider.org'
  };
  var invalid_form = {
    username: 'agrimaldi',
    password: 'qwe',
    password_confirm: 'lskd',
    email: ''
  };


  describe('with valid form', function() {

    it('redirects to /dashboard if the form is valid', function(done) {
      request(app)
        .post('/signup')
        .send(valid_form)
        .expect(302)
        .end(function(err, res) {
          expect(err).to.not.exist;
          expect(res.header.location).to.include('/dashboard');
          done();
        });
    });
    it('should create a new User', function() {
      request(app)
        .post('/signup')
        .send(valid_form)
        .expect(302)
        .end(function(err, res) {
          expect(err).to.not.exist;
          User.find(function(err, users) {
            expect(err).to.not.exist;
            expect(users).to.have.length(1);
            var user = users[0];
            expect(user).to.have.property('username', 'agrimaldi');
            expect(user).to.have.property('email', 'agrimaldi@gstrider.org');
            expect(user).to.have.property('passwordHash');
            done();
          });
        });
    });
    
  });


});
