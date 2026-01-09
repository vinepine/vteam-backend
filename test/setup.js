const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const request = {
  execute: app => chai.request(app)
};
const app = require('../index');

chai.should();

module.exports = {
  chai,
  request,
  app
};
