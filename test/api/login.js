'use strict';

var expect = require('chai').expect
  , utils = require('../utils')
  , request = require('supertest')
  , User = require('../../models/user').User
  , app = require('../../app')
  ;

  
beforeEach(function(done) {
  var userOne = new User({
    username: 'agrimaldi',
    password: 'qwe',
    admin: true,
    email: 'agrimaldi@asd.com'
  });
  userOne.save(done);
});


describe('POST /login', function() {

  describe('with valid credentials', function() {
    it('reponds favorabily to login attempt', function(done) {
      request(app)
        .post('/login')
        .send({
          username: 'agrimaldi',
          password: 'qwe'
        })
        .expect(200)
        .end(function(err, res) {
          expect(err).to.not.exist;
          expect(res.body).to.have.property('retStatus', 'success');
          expect(res.body).to.have.property('user');
          expect(res.body.user).to.have.keys(['__v', 'bookmarks',
            'username', 'password', 'admin', 'email', '_id'
          ]);
          done();
        });
    });
  });

  describe('with invalid credentials', function() {
    it('reponds infavorabily to login attempt', function(done) {
      request(app)
        .post('/login')
        .send({
          username: 'agrimaldi',
          password: 'qweasda'
        })
        .expect({
          retStatus: 'failure',
        }, done);
    });
  });

  describe('with non-existent user', function() {
    it('reponds infavorabily to login attempt', function(done) {
      request(app)
        .post('/login')
        .send({
          username: 'non-existent',
          password: 'qwe'
        })
        .expect({
          retStatus: 'failure',
        }, done);
    });
  });

});
