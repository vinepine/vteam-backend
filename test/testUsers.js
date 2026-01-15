
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
	describe('GET /v1/users', () => {
		it('should return users array', done => {
			request.execute(app).get('/v1/users')
				.set('x-access-token', jwtToken)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.users.should.be.an('array');
					
					done();
				});
		});
	});
	describe('GET /v1/users/:id', () => {
		describe('when id exists', () => {
			it('should return one users array', done => {
				request.execute(app).get('/v1/users/2')
					.set('x-access-token', jwtToken)
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
			it('should return empty users array', done => {
			request.execute(app)
				.get('/v1/users/999999')
				.set('x-access-token', jwtToken)
				.end((err, res) => {

				res.should.have.status(200);
				res.body.user.should.be.an('array');
				res.body.user.length.should.equal(0);

				done();
				});
			});
		});
	});
	describe('GET /v1/users', () => {
		it('should fail without token', done => {
			request.execute(app).get('/v1/users')
			.end((err, res) => {
				res.status.should.equal(401);
				done();
			});
		});
	});
});
