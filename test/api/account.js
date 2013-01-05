'use strict';

var expect = require('chai').expect
  , utils = require('../utils')
  , request = require('supertest')
  , User = require('../../models/user').User
  , app = require('../../app')
  ;

  
var new_user = {
  name: {
    first: 'Alexis',
    last: 'GRIMALDI'
  },
  username: 'agrimaldi',
  password: 'secret',
  admin: true,
  email: 'agrimaldi@gstrider.org'
};



describe('GET /account', function() {

  beforeEach(function(done) {
    User.remove(function(err) {
      User.create(new_user, function(err, created_user) {
        done(err);
      });
    });
  });


  describe('when authenticated', function() {

    var cookie = null;
    var valid_credentials = {
      username: new_user.username,
      password: new_user.password
    };

    beforeEach(function(done) {
      request(app)
        .post('/login')
        .send(valid_credentials)
        .expect(200)
        .end(function(err, res) {
          cookie = res.headers['set-cookie'];
          done();
        });
    });

    it('responds with 200: OK', function(done) {
      request(app)
        .get('/account')
        .set('cookie', cookie)
        .expect(200, done);
    });

  });


  describe('when not authenticated', function() {

    it('reponds with 401: Unauthorized', function(done) {
      request(app)
        .get('/account')
        .expect(401, done);
    });
    it('Redirects to /', function(done) {
      request(app)
        .get('/account')
        .expect(401)
        .end(function(err, res) {
          expect(err).to.not.exist;
          done();
        });
    });

  });


});
