'use strict';

var expect = require('chai').expect
  , utils = require('../utils')
  , request = require('supertest')
  , User = require('../../models/user').User
  , app = require('../../app')
  ;

  
describe('POST /signup', function() {


  describe('with valid form', function() {

    var form = {
      name: {
        first: 'Alexis',
        last: 'GRIMALDI'
      },
      username: 'agrimaldi-signuptest',
      password: 'secret',
      password_confirm: 'secret',
      email: 'agrimaldi@gstrider.org'
    };

    it('redirects to /account', function(done) {
      request(app)
        .post('/signup')
        .send(form)
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
        .send(form)
        .expect(302)
        .end(function(err, res) {
          expect(err).to.not.exist;
          User.findByUsername(form.username, function(err, user) {
            expect(err).to.not.exist;
            expect(user).to.have.deep.property('name.first', form.name.first);
            expect(user).to.have.deep.property('name.last', form.name.last);
            expect(user).to.have.property('username', form.username);
            expect(user).to.have.property('email', form.email);
            expect(user).to.have.property('password', '');
            expect(user).to.have.property('passwordHash');
            done();
          });
        });
    });
    
  });


  describe('with invalid form', function() {
  
    var form = {
      name: {
        first: 'Alexis',
        last: ''
      },
      username: 'agrimaldi',
      password: 'secret',
      password_confirm: 'terces',
      email: ''
    };

    it('should redirect to /signup', function(done) {
      request(app)
        .post('/signup')
        .send(form)
        .expect(302)
        .end(function(err, res) {
          expect(err).to.not.exist;
          expect(res.header.location).to.include('/signup');
          done();
        });
    });
  
  });


});
