'use strict';

var expect = require('chai').expect
  , utils = require('../utils')
  , request = require('supertest')
  , User = require('../../models/user').User
  , app = require('../../app')
  ;

  
describe('POST /signup', function() {

  
  describe('a new user', function() {
    
    describe('with a valid form', function() {
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
          .expect(200)
          .end(function(err, res) {
            expect(err).to.not.exist;
            expect(res.body).to.have.property('status', 'success');
            expect(res.body).to.have.property('info');
            expect(res.body).to.have.property('redirect', '/account');
            done();
          });
      });
      it('should create a new User', function(done) {
        request(app)
          .post('/signup')
          .send(form)
          .expect(200)
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

    describe('with an invalid form', function() {
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
        .expect(200)
        .end(function(err, res) {
          expect(err).to.not.exist;
          expect(res.body).to.have.property('status', 'failure');
          expect(res.body['info']).to.deep.equal([
            {level:'error', message:'Invalid email'},
            {level:'error', message:'Passwords do not match'},
            {level:'error', message:'Last name must be composed of letters'}
          ]);
          expect(res.body).to.have.property('redirect', false);
          done();
        });
      });
    });

  });


  describe('a duplicate user', function() {

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

    beforeEach(function(done) {
      User.remove(function(err) {
        User.create(form, function(err, created_user) {
          done(err);
        });
      });
    });

    describe('with unavailable username', function() {
      var user = {
        name: {
          first: 'Alexis',
          last: 'GRIMALDI'
        },
        username: 'agrimaldi-signuptest',
        password: 'secret',
        password_confirm: 'secret',
        email: 'agrimaldi2@gstrider.org'
      };
      it('redirects to /account', function(done) {
        request(app)
          .post('/signup')
          .send(user)
          .expect(200)
          .end(function(err, res) {
            expect(err).to.not.exist;
            expect(res.body).to.have.property('status', 'error');
            expect(res.body['info']).to.deep.equal({level:'error', message:'Unavailable username'});
            expect(res.body).to.have.property('redirect', false);
            done();
          });
      });
    });

    describe('with unavailable email', function() {
      var user = {
        name: {
          first: 'Alexis',
          last: 'GRIMALDI'
        },
        username: 'agrimaldi-2-signuptest',
        password: 'secret',
        password_confirm: 'secret',
        email: 'agrimaldi@gstrider.org'
      };
      it('redirects to /account', function(done) {
        request(app)
          .post('/signup')
          .send(user)
          .expect(200)
          .end(function(err, res) {
            expect(err).to.not.exist;
            expect(res.body).to.have.property('status', 'error');
            expect(res.body['info']).to.deep.equal({level:'error', message:'Unavailable email'});
            expect(res.body).to.have.property('redirect', false);
            done();
          });
      });
    });
  });


});
