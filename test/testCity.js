
const { request, app } = require('./setup');

let jwtToken;
const testUser = "test@gmail.com"
const testPassword = "test"
const userData = {
	email: testUser,
	password: testPassword
}
describe('Routes', () => {
	describe('POST /v1/register', () => {
		it('should register a user', done => {
			request.execute(app).post('/v1/register')
				.send(userData)
				.end((err, res) => {
					console.log(res.body)
					res.should.have.status(200);
					done();
				})
		})
	});

	describe('POST /v1/login', () => {
		it('should login user', done => {
			request.execute(app).post('/v1/login')
				.send(userData)
				.end((err, res) => {
					jwtToken = res.body.token;

					done();
				})
		})
	})
	describe('GET /v1/city', () => {
		it('should return cities array', done => {
			request.execute(app).get('/v1/city')
				.set('x-access-token', jwtToken)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.cities.should.be.an('array');

					done();
				});
		});
	});

	describe('GET /v1/city/:id', () => {
		describe('when id exists', () => {
			it('should return one city array', done => {
				request.execute(app).get('/v1/city/1')
					.set('x-access-token', jwtToken)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.city.length.should.equal(1);
						res.body.city[0].city_id.should.equal(1);

						done();
					});
			});
		});
		describe('when id does not exists', () => {
			it('should return one city array', done => {
				request.execute(app).get('/v1/city/99')
					.set('x-access-token', jwtToken)
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
		it('should return bikes in city array', done => {
			request.execute(app).get('/v1/city/bike/1')
				.set('x-access-token', jwtToken)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.result.should.be.an('array');
					res.body.result[0].city_name.should.equal('Malmö');

					done();
				});
		});
	});
	describe('GET /v1/city/', () => {
		it('should fail without token', done => {
			request.execute(app).get('/v1/city')
			.end((err, res) => {
				res.should.exist;
				res.status.should.equal(401);
				done();
			});
		});
	});
});
