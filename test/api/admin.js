'use strict';

var expect = require('chai').expect
  , utils = require('../utils')
  , request = require('supertest')
  , User = require('../../models/user').User
  , app = require('../../app')
  ;

  
var admin_user = {
      name: {
        first: 'Alexis',
        last: 'GRIMALDI'
      },
      username: 'agrimaldi-admin',
      password: 'secret',
      privileges: ['admin'],
      email: 'agrimaldi-admin@gstrider.org'
    }
  , std_user = {
      name: {
        first: 'Alexis',
        last: 'GRIMALDI'
      },
      username: 'agrimaldi',
      password: 'secret',
      privileges: [],
      email: 'agrimaldi@gstrider.org'
    }
;



describe('GET /admin', function() {

  beforeEach(function(done) {
    User.remove(function(err) {
      User.create(admin_user, function(err, created_user) {
        User.create(std_user, function(err, created_user) {
          done(err);
        });
      });
    });
  });


  describe('when user has privilege', function() {

    var cookie = null;
    var credentials = {
      username: admin_user.username,
      password: admin_user.password
    };

    beforeEach(function(done) {
      request(app)
        .post('/login')
        .send(credentials)
        .expect(200)
        .end(function(err, res) {
          cookie = res.headers['set-cookie'];
          done();
        });
    });

    it('responds with 200: OK', function(done) {
      request(app)
        .get('/admin')
        .set('cookie', cookie)
        .expect(200, done);
    });

  });


  describe('when user has no privilege', function() {

    var cookie = null;
    var credentials = {
      username: std_user.username,
      password: std_user.password
    };

    beforeEach(function(done) {
      request(app)
        .post('/login')
        .send(credentials)
        .expect(200)
        .end(function(err, res) {
          cookie = res.headers['set-cookie'];
          done();
        });
    });

    it('reponds with 403: Forbidden', function(done) {
      request(app)
        .get('/admin')
        .set('cookie', cookie)
        .expect(403, done);
    });
    it('Redirects to /', function(done) {
      request(app)
        .get('/admin')
        .set('cookie', cookie)
        .expect(403)
        .end(function(err, res) {
          expect(err).to.not.exist;
          expect(res['header']['location']).to.equal('/');
          done();
        });
    });

  });


  describe('when user is not logged in', function() {
    
    it('responds with 401: Unauthorized', function(done) {
      request(app)
        .get('/admin')
        .expect(401, done);
    });
    it('Redirects to /', function(done) {
      request(app)
        .get('/admin')
        .expect(401)
        .end(function(err, res) {
          expect(err).to.not.exist;
          expect(res['header']['location']).to.equal('/');
          done();
        });
    });

  });


});
