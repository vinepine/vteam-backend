
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
	describe('GET /v1/bike', () => {
		it('should return bike array', done => {
			request.execute(app).get('/v1/bike')
				.set('x-access-token', jwtToken)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.scooters.should.be.an('array');
					
					done();
				});
		});
	});
	describe('GET /v1/bike/:id', () => {
		describe('when id exists', () => {
			it('should return one bike array', done => {
				request.execute(app).get('/v1/bike/1')
					.set('x-access-token', jwtToken)
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
			it('should return empty scooter array', done => {
			request.execute(app)
				.get('/v1/bike/999999')
				.set('x-access-token', jwtToken)
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
		it('should return one bike array', done => {
			request.execute(app).get('/v1/available/bike')
				.set('x-access-token', jwtToken)
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
	describe('GET /v1/available/bike', () => {
		it('should fail without token', done => {
			request.execute(app).get('/v1/bike')
			.end((err, res) => {
				res.should.exist;
				res.status.should.equal(401);
				done();
			});
		});
	});
});
