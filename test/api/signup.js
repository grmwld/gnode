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
    username: 'agrimaldi',
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

    it('redirects to /dashboard', function(done) {
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
    it('should create a new User', function(done) {
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
            expect(user).to.have.deep.property('name.first', 'Alexis');
            expect(user).to.have.deep.property('name.last', 'GRIMALDI');
            expect(user).to.have.property('username', 'agrimaldi');
            expect(user).to.have.property('email', 'agrimaldi@gstrider.org');
            expect(user).to.have.property('passwordHash');
            done();
          });
        });
    });
    
  });


});
