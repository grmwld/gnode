'use strict';

var expect = require('chai').expect
  , utils = require('../utils')
  , request = require('supertest')
  , User = require('../../models/user').User
  , app = require('../../app')
  ;

  
describe('POST /signup', function() {

  it('redirects to /dashboard if the form is valid', function(done) {
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
