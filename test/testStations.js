
const { request, app } = require('./setup');
const db = require('../src/db/database');

let jwtToken;
let originalQuery;

const testUser = "test@gmail.com"
const testPassword = "test"
const userData = {
	email: testUser,
	password: testPassword
}
describe('Station route', () => {

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
					callback(null, { insertId: 1 });
				}
			};
		});

		it('should register a user', done => {
			request.execute(app).post('/v1/register')
				.send(userData)
				.end((err, res) => {
					res.should.have.status(200);
					done();
				})
		})
	});
	describe('GET /v1/stations', () => {
		beforeEach(() => {
			db.query = (sql, callback) => {
				callback(null, [
					{ id: 1, city_id: 1, station_name: 'Station 1', capacity: 10 },
					{ id: 4, city_id: 1, station_name: 'Station 4', capacity: 15 }
				]);
			};
		});

		it('should return stations array', done => {
			request.execute(app).get('/v1/stations')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.stations.should.be.an('array');
					
					done();
				});
		});
	});
	describe('GET /v1/stations/:id', () => {
		describe('when id exists', () => {
			beforeEach(() => {
				db.query = (sql, callback) => {
					callback(null, [
						{ id: 4, city_id: 1, station_name: 'Station 4', capacity: 15 }
					]);
				};
			});

			it('should return one station array', done => {
				request.execute(app).get('/v1/stations/4')
					.end((err, res) => {
					res.should.have.status(200);
					res.body.station.should.be.an('array');
					res.body.station.length.should.equal(1);
					res.body.station[0].id.should.equal(4);

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

			it('should return empty stations array', done => {
				request.execute(app)
					.get('/v1/stations/999999')
					.end((err, res) => {

					res.should.have.status(200);
					res.body.station.should.be.an('array');
					res.body.station.length.should.equal(0);

					done();
				});
			});
		});
	});
});
