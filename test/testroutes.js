import * as chai from "chai";

import {default as chaiHttp, request} from "chai-http";
import app from "../index.js";

chai.use(chaiHttp);
chai.should()


describe("Routes",  () => {

    describe('GET /v1/city', () => {
        it("should return cities", (done) => {
            request.execute(app).get('/v1/city')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.cities.should.be.an('array');

                    done();
                });
        });
    });

    describe('GET /v1/city/:id', () => {
        it("should return one city", (done) => {
            request.execute(app).get('/v1/city/1')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.city.length.should.equal(1);

                done();
            });
        });
    });

    describe('GET /v1/city/bike/:id', () => {
        it("should return bikes in city", (done) => {
            request.execute(app).get('/v1/city/bike/1')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.result[0].city_name.should.equal('Malmö')
                    done();
                });
        });
    });
});