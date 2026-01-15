
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
describe('City route', () => {
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
	describe('GET /v1/city', () => {
		beforeEach(() => {
			db.query = (sql, callback) => {
				callback(null, [
					{city_id: 1, city_name: 'Malmö'},
					{city_id: 2, city_name: 'Stockholm'},
				]);
			};
		});

		it('should return cities array', done => {
			request.execute(app).get('/v1/city')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.cities.should.be.an('array');

					done();
				});
		});
	});

	describe('GET /v1/city/:id', () => {
		describe('when id exists', () => {
			beforeEach(() => {
				db.query = (sql, callback) => {
					callback(null, [
						{city_id: 1, city_name: 'Malmö'},
					]);
				};
			});

			it('should return one city array', done => {
				request.execute(app).get('/v1/city/1')
					.end((err, res) => {
						res.should.have.status(200);
						res.body.city.length.should.equal(1);
						res.body.city[0].city_id.should.equal(1);

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

			it('should return empty city array', done => {
				request.execute(app).get('/v1/city/99')
					.end((err, res) => {
						res.should.have.status(200);
						res.body.city.should.be.an('array');
						res.body.city.length.should.equal(0);

						done();
					});
			});
		});
	});

	describe('GET /v1/city/bike/:id', () => {
		beforeEach(() => {
			db.query = (sql, callback) => {
				callback(null, [
					{
						city_id: 1, city_name: 'Malmö', scooter_id: 1, battery: 100,
					},
				]);
			};
		});

		it('should return bikes in city array', done => {
			request.execute(app).get('/v1/city/bike/1')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.result.should.be.an('array');
					res.body.result[0].city_name.should.equal('Malmö');

					done();
				});
		});
	});
});
