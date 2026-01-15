
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

describe('Bike route', () => {
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

	describe('GET /v1/bike', () => {
		beforeEach(() => {
			db.query = (sql, callback) => {
				callback(null, [
					{
						scooter_id: 1, city_id: 1, available: 1, battery: 100, lat: 59.3293, lon: 18.0686,
					},
				]);
			};
		});

		it('should return bike array', done => {
			request.execute(app).get('/v1/bike')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.scooters.should.be.an('array');
					res.body.scooters.length.should.equal(50);
					done();
				});
		});
	});

	describe('GET /v1/bike/:id', () => {
		describe('when id exists', () => {
			beforeEach(() => {
				db.query = (sql, callback) => {
					callback(null, [
						{
							scooter_id: 1, city_id: 1, available: 1, battery: 100, lat: 59.3293, lon: 18.0686,
						},
					]);
				};
			});

			it('should return one bike array', done => {
				request.execute(app).get('/v1/bike/1')
					.end((err, res) => {
						res.should.have.status(200);
						res.body.scooter.should.be.an('array');
						res.body.scooter.length.should.equal(1);
						res.body.scooter[0].scooter_id.should.equal(1);
						done();
					});
			});
		});

		describe('when id does not exist', () => {
			beforeEach(() => {
				db.query = (sql, callback) => {
					callback(null, []);
				};
			});

			it('should return empty scooter array', done => {
				request.execute(app)
					.get('/v1/bike/999999')
					.end((err, res) => {
						res.should.have.status(200);
						res.body.scooter.should.be.an('array');
						res.body.scooter.length.should.equal(0);
						done();
					});
			});
		});
	});

	describe('GET /v1/available/bike', () => {
		beforeEach(() => {
			db.query = (sql, callback) => {
				callback(null, [
					{
						scooter_id: 1, city_id: 1, available: 1, battery: 100, lat: 59.3293, lon: 18.0686,
					},
					{
						scooter_id: 2, city_id: 1, available: 1, battery: 85, lat: 59.3293, lon: 18.0686,
					},
				]);
			};
		});

		it('should return available bikes array', done => {
			request.execute(app).get('/v1/available/bike')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.available.should.be.an('array');
					res.body.available.forEach(bike => {
						bike.available.should.equal(1);
					});
					done();
				});
		});
	});
});
