const { describe, after, it } = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const deleteAllUsers = require('../helpers/deleteAllUsers');

chai.use(chaiHttp);

const { expect } = chai;

describe('User Register & Login', function() {
  describe('POST /users/register', function() {
    it('bikin user untuk pertama kalinya', function(done) {
      chai
        .request(app)
        .post('/users/register')
        .send({ email: 'mark@email.com', password: '12345' })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.be.equal(
            'User has been successfully created!'
          );
          expect(res.body).to.have.property('token');

          done();
        });
    });

    it('email ga boleh double', function(done) {
      chai
        .request(app)
        .post('/users/register')
        .send({ email: 'mark@email.com', password: '12345' })
        .end((err, res) => {
          console.log(err);
          expect(res).to.have.status(406);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.be.equal('Email is already registered!');

          done();
        });
    });

    after(function(done) {
      deleteAllUsers();
      done();
    });
  });
});