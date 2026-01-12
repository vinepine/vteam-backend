
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
	describe('GET /v1/payment', () => {
		it('should return payment array', done => {
			request.execute(app).get('/v1/payment')
				.set('x-access-token', jwtToken)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.payments.should.be.an('array');
					
					done();
				});
		});
	});
	describe('GET /v1/payment/:id', () => {
		describe('when id exists', () => {
			it('should return one payment array', done => {
				request.execute(app).get('/v1/payment/2')
					.set('x-access-token', jwtToken)
					.end((err, res) => {
					res.should.have.status(200);
					res.body.payment.should.be.an('array');
					res.body.payment.length.should.equal(1);
					res.body.payment[0].payment_id.should.equal(2);

						done();
				});
			});
		});
		describe('when id does not exist', () => {
			it('should return empty payment array', done => {
			request.execute(app)
				.get('/v1/payment/999999')
				.set('x-access-token', jwtToken)
				.end((err, res) => {

				res.should.have.status(200);
				res.body.payment.should.be.an('array');
				res.body.payment.length.should.equal(0);

				done();
				});
			});
		});
	});
	
    describe('GET /v1/payment/user/:id', () => {
		describe('when id does exists', () => {
            it('should return one payment array', done => {
                request.execute(app).get('/v1/payment/user/2')
                    .set('x-access-token', jwtToken)
                    .end((err, res) => {
                    res.should.have.status(200);
                    res.body.user.should.be.an('array');
                    res.body.user.length.should.equal(1);
                    

                    done();
                });
            });
        });
		describe('when id does not exist', () => {
			it('should return empty payment array', done => {
			request.execute(app)
				.get('/v1/payment/user/999999')
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
    describe('GET /v1/payment/amount/:amount', () => {
		it('should return payment array', done => {
			request.execute(app).get('/v1/payment/amount/29')
				.set('x-access-token', jwtToken)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.result.should.be.an('array');
				    res.body.result.length.should.equal(1);
				    res.body.result[0].status.should.equal('complete');
				    res.body.result[0].amount.should.equal(29);
					
					done();
				});
		});
        it('should return payment array', done => {
			request.execute(app).get('/v1/payment/amount/0')
				.set('x-access-token', jwtToken)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.result.should.be.an('array');
				    res.body.result.length.should.equal(1);
				    res.body.result[0].status.should.equal('pending');
				    res.body.result[0].amount.should.equal(0);
					
					done();
				});
		});
	});
    describe('GET /v1/payment/amount/:amount', () => {
		it('should return payment array', done => {
			request.execute(app).get('/v1/payment/amount/29')
				.set('x-access-token', jwtToken)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.result.should.be.an('array');
				    res.body.result.length.should.equal(1);
				    res.body.result[0].status.should.equal('complete');
					
					done();
				});
		});
	});
	describe('GET /v1/payment', () => {
		it('should fail without token', done => {
			request.execute(app).get('/v1/payment')
			.end((err, res) => {
				res.status.should.equal(401);
				done();
			});
		});
	});
});
