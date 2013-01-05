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



describe('POST /login', function() {

  beforeEach(function(done) {
    User.remove(function(err) {
      User.create(new_user, function(err, created_user) {
        done(err);
      });
    });
  });


  describe('with valid credentials', function() {

    var valid_credentials = {
      username: new_user.username,
      password: new_user.password
    };

    it('reponds favorabily to login attempt', function(done) {
      request(app)
        .post('/login')
        .send(valid_credentials)
        .expect(200)
        .end(function(err, res) {
          expect(err).to.not.exist;
          expect(res.body).to.have.property('status', 'success');
          expect(res.body).to.have.property('user');
          expect(res.body.user).to.have.keys([ 'name', 'username', 'email' ]);
          expect(res.body.user).to.have.deep.property('username', new_user.username);
          expect(res.body.user).to.have.deep.property('name.first', new_user.name.first);
          expect(res.body.user).to.have.deep.property('name.last', new_user.name.last);
          done();
        });
    });

  });


  describe('with invalid credentials', function() {

    var invalid_password = 'hackpass';

    it('reponds infavorabily to login attempt', function(done) {
      request(app)
        .post('/login')
        .send({
          username: new_user.username,
          password: invalid_password
        })
        .expect({
          status: 'failure',
          info: {
            'level': 'error',
            'message': 'AuthFailed : Invalid Password'
          },
          user: null
        }, done);
    });

  });


  describe('with non-existent user', function() {
    
    var non_existent_user = 'non-existent';

    it('reponds infavorabily to login attempt', function(done) {
      request(app)
        .post('/login')
        .send({
          username: non_existent_user,
          password: new_user.password
        })
        .expect({
          status: 'failure',
          info: {
            'level': 'error',
            'message': 'AuthFailed : Username does not exist'
          },
          user: null
        }, done);
    });

  });


});
