
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
	describe('GET /v1/stations', () => {
		it('should return stations array', done => {
			request.execute(app).get('/v1/stations')
				.set('x-access-token', jwtToken)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.stations.should.be.an('array');
					
					done();
				});
		});
	});
	describe('GET /v1/stations/:id', () => {
		describe('when id exists', () => {
			it('should return one bike array', done => {
				request.execute(app).get('/v1/stations/4')
					.set('x-access-token', jwtToken)
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
			it('should return empty stations array', done => {
				request.execute(app)
					.get('/v1/stations/999999')
					.set('x-access-token', jwtToken)
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
