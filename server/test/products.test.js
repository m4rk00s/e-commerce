/* eslint-disable no-underscore-dangle */
const { describe, after, it } = require('mocha');
const chai = require('chai');
const { readFileSync } = require('fs');
const chaiHttp = require('chai-http');
const app = require('../app');
const deleteAllUsers = require('../helpers/deleteAllUsers');

chai.use(chaiHttp);

const { expect } = chai;

// global variabel for later use
const listUserToken = [];
const listItemId = [];

after(done => deleteAllUsers(done));

describe('INIT ADMIN', function() {
  it('ADMIN CREATE', function(done) {
    chai
      .request(app)
      .post('/users/register')
      .send({ email: 'hedwig@email.com', password: '12345', role: 'admin' })
      .then(res => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.be.equal(
          'User has been successfully created!'
        );
        expect(res.body).to.have.property('token');
        listUserToken.push(res.body.token);
        done();
      })
      .catch(err => done(err));
  });
});

describe('TEST PRODUCT', function() {
  describe('CREATE', function() {
    it('PERFECT WORLD', function(done) {
      const image = readFileSync('./test/asset/06.jpg');
      chai
        .request(app)
        .post('/products')
        .set('token', listUserToken[0])
        .attach('image', image, '06.jpg')
        .field(
          'title',
          'The Year of Less: How I Stopped Shopping, Gave Away My Belongings, and Discovered Life is Worth More Than Anything You Can Buy in a Store'
        )
        .field('price', '130000')
        .field('stock', '21')
        .field(
          'description',
          `In her late twenties, Cait Flanders found herself stuck in the consumerism cycle that grips so many of us: earn more, buy more, want more, rinse, repeat. Even after she worked her way out of nearly $30,000 of consumer debt, her old habits took hold again. When she realized that nothing she was doing or buying was making her happy--only keeping her from meeting her goals--she decided to set herself a challenge: she would not shop for an entire year.\nNow available for the first time in paperback, The Year of Less documents Cait's life for twelve months during which she bought only consumables: groceries, toiletries, gas for her car. Along the way, she challenged herself to consume less of many other things besides shopping. She decluttered her apartment and got rid of 70 percent of her belongings; learned how to fix things rather than throw them away; researched the zero waste movement; and completed a television ban. At every stage, she learned that the less she consumed, the more fulfilled she felt.\nThe challenge became a lifeline when, in the course of the year, Cait found herself in situations that turned her life upside down. In the face of hardship, she realized why she had always turned to shopping, alcohol, and food--and what it had cost her. Unable to reach for any of her usual vices, she changed habits she'd spent years perfecting and discovered what truly mattered to her.\nBlending Cait's compelling story with inspiring insight and practical guidance, The Year of Less will leave you questioning what you're holding on to in your own life--and, quite possibly, lead you to find your own path of less.`
        )
        .then(res => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.be.equal(
            `Product has been successfully created!`
          );
          done();
        })
        .catch(err => done(err));
    });
  });

  describe('READ ALL', function() {
    it('PERFECT WORLD', function(done) {
      chai
        .request(app)
        .get('/products')
        .set('token', listUserToken[0])
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.be.equal(
            'All products are successfully retrieved!'
          );
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.an('array');

          res.body.data.forEach(product => {
            expect(product).to.have.property('_id');
            expect(product._id).to.be.a('string');

            listItemId.push(product._id);
            expect(product).to.have.property('title');
            expect(product.title).to.be.a('string');
            expect(product).to.have.property('price');
            expect(product.price).to.be.a('number');
            expect(product).to.have.property('stock');
            expect(product.stock).to.be.a('number');
            expect(product).to.have.property('description');
            expect(product.description).to.be.a('string');
          });

          done();
        })
        .catch(err => done(err));
    });
  });

  describe('READ ONE', function() {
    it('PERFECT WORLD', function(done) {
      chai
        .request(app)
        .get(`/products/${listItemId[0]}`)
        .set('token', listUserToken[0])
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.be.equal(
            'Product is successfully retrieved!'
          );
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.an('object');

          expect(res.body.data).to.have.property('_id');
          expect(res.body.data._id).to.be.a('string');
          expect(res.body.data).to.have.property('title');
          expect(res.body.data.title).to.be.a('string');
          expect(res.body.data).to.have.property('price');
          expect(res.body.data.price).to.be.a('number');
          expect(res.body.data).to.have.property('stock');
          expect(res.body.data.stock).to.be.a('number');
          expect(res.body.data).to.have.property('description');
          expect(res.body.data.description).to.be.a('string');

          done();
        })
        .catch(err => done(err));
    });
  });

  describe('UPDATE', function() {
    it('PERFECT WORLD', function(done) {
      chai
        .request(app)
        .put(`/products/${listItemId[0]}`)
        .set('token', listUserToken[0])
        .field('price', '150000')
        .field('stock', '10')
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.be.equal(
            'Product is successfully updated!'
          );

          done();
        })
        .catch(err => done(err));
    });
  });

  describe('DELETE', function() {
    it('PERFECT WORLD', function(done) {
      chai
        .request(app)
        .delete(`/products/${listItemId[0]}`)
        .set('token', listUserToken[0])
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.be.equal(
            'Product is successfully removed!'
          );

          done();
        })
        .catch(err => done(err));
    });
  });
});
