
const {request, app} = require('./setup');
const db = require('../src/db/database');

let jwtToken;
let originalQuery;

const testUser = 'test@gmail.com';
const testPassword = 'test';
const userData = {
	email: testUser,
	password: testPassword,
};
describe('Payment route', () => {
	before(() => {
		originalQuery = db.query;
	});

	after(() => {
		db.query = originalQuery;
	});
	describe('POST /v1/register', () => {
		beforeEach(() => {
			db.query = (sql, callback) => {
				if (sql.includes('INSERT INTO users')) {
					callback(null, {insertId: 1});
				}
			};
		});

		it('should register a user', done => {
			request.execute(app).post('/v1/register')
				.send(userData)
				.end((err, res) => {
					res.should.have.status(200);
					done();
				});
		});
	});
	describe('GET /v1/payment', () => {
		beforeEach(() => {
			db.query = (sql, callback) => {
				callback(null, [
					{
						payment_id: 1, user_id: 1, amount: 50, status: 'complete',
					},
					{
						payment_id: 2, user_id: 2, amount: 29, status: 'complete',
					},
				]);
			};
		});

		it('should return payment array', done => {
			request.execute(app).get('/v1/payment')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.payments.should.be.an('array');

					done();
				});
		});
	});
	describe('GET /v1/payment/:id', () => {
		describe('when id exists', () => {
			it('should return one payment array', done => {
				request.execute(app).get('/v1/payment/2')
					.end((err, res) => {
						res.should.have.status(200);
						res.body.payment.should.be.an('array');
						res.body.payment.length.should.equal(1);
						res.body.payment[0].payment_id.should.equal(2);

						done();
					});
			});
		});
		describe('when id does not exist', () => {
			it('should return empty payment array', done => {
				request.execute(app)
					.get('/v1/payment/999999')
					.end((err, res) => {
						res.should.have.status(200);
						res.body.payment.should.be.an('array');
						res.body.payment.length.should.equal(0);

						done();
					});
			});
		});
	});

	describe('GET /v1/payment/user/:id', () => {
		describe('when id does exists', () => {
			it('should return one payment array', done => {
				request.execute(app).get('/v1/payment/user/2')
					.end((err, res) => {
						res.should.have.status(200);
						res.body.user.should.be.an('array');
						res.body.user.length.should.equal(1);

						done();
					});
			});
		});
		describe('when id does not exist', () => {
			it('should return empty payment array', done => {
				request.execute(app)
					.get('/v1/payment/user/999999')
					.end((err, res) => {
						res.should.have.status(200);
						res.body.user.should.be.an('array');
						res.body.user.length.should.equal(0);

						done();
					});
			});
		});
	});
	describe('GET /v1/payment/amount/:amount', () => {
		it('should return payment array', done => {
			request.execute(app).get('/v1/payment/amount/29')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.result.should.be.an('array');
					res.body.result.length.should.equal(1);
					res.body.result[0].status.should.equal('complete');
					res.body.result[0].amount.should.equal(29);

					done();
				});
		});
		it('should return payment array', done => {
			request.execute(app).get('/v1/payment/amount/0')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.result.should.be.an('array');
					res.body.result.length.should.equal(1);
					res.body.result[0].status.should.equal('pending');
					res.body.result[0].amount.should.equal(0);

					done();
				});
		});
	});
	describe('GET /v1/payment/amount/:amount', () => {
		it('should return payment array', done => {
			request.execute(app).get('/v1/payment/amount/29')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.result.should.be.an('array');
					res.body.result.length.should.equal(1);
					res.body.result[0].status.should.equal('complete');

					done();
				});
		});
	});
});
