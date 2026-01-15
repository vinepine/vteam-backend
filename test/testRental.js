
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
describe('Rental route', () => {
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
	describe('GET /v1/rental', () => {
		beforeEach(() => {
			db.query = (sql, callback) => {
				callback(null, [
					{
						rental_id: 1, user_id: 1, scooter_id: 1, start_time: '2024-01-01',
					},
					{
						rental_id: 2, user_id: 2, scooter_id: 2, start_time: '2024-01-02',
					},
				]);
			};
		});

		it('should return rentals array', done => {
			request.execute(app).get('/v1/rental')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.rentals.should.be.an('array');

					done();
				});
		});
	});

	describe('GET /v1/rental/:id', () => {
		describe('when id exists', () => {
			beforeEach(() => {
				db.query = (sql, callback) => {
					callback(null, [
						{
							rental_id: 1, user_id: 1, scooter_id: 1, start_time: '2024-01-01',
						},
					]);
				};
			});

			it('should return one rental array', done => {
				request.execute(app).get('/v1/rental/1')
					.end((err, res) => {
						res.should.have.status(200);
						res.body.rental.length.should.equal(1);
						res.body.rental[0].rental_id.should.equal(1);

						done();
					});
			});
		});
		describe('when id does not exists', () => {
			beforeEach(() => {
				db.query = (sql, callback) => {
					callback(null, []);
				};
			});

			it('should return empty rental array', done => {
				request.execute(app).get('/v1/rental/99')
					.end((err, res) => {
						res.should.have.status(200);
						res.body.rental.should.be.an('array');
						res.body.rental.length.should.equal(0);

						done();
					});
			});
		});
	});
});
