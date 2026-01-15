
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
describe('User route', () => {
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

	describe('GET /v1/users', () => {
		beforeEach(() => {
			db.query = (sql, callback) => {
				callback(null, [
					{user_id: 1, email: 'user1@gmail.com', first_name: 'John'},
					{user_id: 2, email: 'user2@gmail.com', first_name: 'Sven'},
				]);
			};
		});

		it('should return users array', done => {
			request.execute(app).get('/v1/users')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.users.should.be.an('array');

					done();
				});
		});
	});
	describe('GET /v1/users/:id', () => {
		describe('when id exists', () => {
			beforeEach(() => {
				db.query = (sql, callback) => {
					callback(null, [
						{user_id: 2, email: 'user2@gmail.com', first_name: 'John'},
					]);
				};
			});

			it('should return one user', done => {
				request.execute(app).get('/v1/users/2')
					.end((err, res) => {
						res.should.have.status(200);
						res.body.user.should.be.an('array');
						res.body.user.length.should.equal(1);
						res.body.user[0].user_id.should.equal(2);

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

			it('should return empty users array', done => {
				request.execute(app)
					.get('/v1/users/999999')
					.end((err, res) => {
						res.should.have.status(200);
						res.body.user.should.be.an('array');
						res.body.user.length.should.equal(0);

						done();
					});
			});
		});
	});
});
