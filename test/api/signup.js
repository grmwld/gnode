'use strict';

var expect = require('chai').expect
  , utils = require('../utils')
  , request = require('supertest')
  , User = require('../../models/user').User
  , app = require('../../app')
  ;

  
describe('POST /signup', function() {

  var valid_form = {
    name: {
      first: 'Alexis',
      last: 'GRIMALDI'
    },
    username: 'agrimaldi-signuptest',
    password: 'secret',
    password_confirm: 'secret',
    email: 'agrimaldi@gstrider.org'
  };
  var invalid_form = {
    name: {
      first: 'Alexis',
      last: ''
    },
    username: 'agrimaldi',
    password: 'secret',
    password_confirm: 'terces',
    email: ''
  };


  describe('with valid form', function() {

    it('redirects to /account', function(done) {
      request(app)
        .post('/signup')
        .send(valid_form)
        .expect(302)
        .end(function(err, res) {
          expect(err).to.not.exist;
          expect(res.header.location).to.include('/account');
          done();
        });
    });
    it('should create a new User', function(done) {
      request(app)
        .post('/signup')
        .send(valid_form)
        .expect(302)
        .end(function(err, res) {
          expect(err).to.not.exist;
          User.findByUsername(valid_form.username, function(err, user) {
            expect(err).to.not.exist;
            expect(user).to.have.deep.property('name.first', valid_form.name.first);
            expect(user).to.have.deep.property('name.last', valid_form.name.last);
            expect(user).to.have.property('username', valid_form.username);
            expect(user).to.have.property('email', valid_form.email);
            expect(user).to.have.property('passwordHash');
            done();
          });
        });
    });
    
  });


  describe('with invalid form', function() {
  
    it('should redirect to /signup', function(done) {
      request(app)
        .post('/signup')
        .send(invalid_form)
        .expect(302)
        .end(function(err, res) {
          expect(err).to.not.exist;
          expect(res.header.location).to.include('/signup');
          done();
        });
    });
  
  });


});
