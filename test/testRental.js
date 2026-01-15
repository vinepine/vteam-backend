
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
	describe('GET /v1/rental', () => {
		it('should return cities array', done => {
			request.execute(app).get('/v1/rental')
				.set('x-access-token', jwtToken)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.rentals.should.be.an('array');

					done();
				});
		});
	});

	describe('GET /v1/rental/:id', () => {
		describe('when id exists', () => {
			it('should return one rental array', done => {
				request.execute(app).get('/v1/rental/1')
					.set('x-access-token', jwtToken)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.rental.length.should.equal(1);
						res.body.rental[0].rental_id.should.equal(1);

						done();
					});
			});
		});
		describe('when id does not exists', () => {
			it('should return one rental array', done => {
				request.execute(app).get('/v1/rental/99')
					.set('x-access-token', jwtToken)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.rental.should.be.an('array');
						res.body.rental.length.should.equal(0);

						done();
					});
			});
		});
	});
	describe('GET /v1/rental/', () => {
		it('should fail without token', done => {
			request.execute(app).get('/v1/rental')
			.end((err, res) => {
				res.should.exist;
				res.status.should.equal(401);
				done();
			});
		});
	});
});
