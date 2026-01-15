const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const request = {
	execute: app => chai.request(app),
};
const {jwtMiddleware} = require('../src/middleware/jwt-middleware');
require('../src/middleware/jwt-middleware').jwtMiddleware = (req, res, next) => {
	req.user = {user_id: 1, email: 'test@gmail.com'};
	next();
};

const app = require('../index');

chai.should();

module.exports = {
	chai,
	request,
	app,
};
