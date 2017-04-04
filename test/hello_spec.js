// require('dotenv').config();
var chai = require("chai");
var expect = chai.expect;
// var apiroutes = require("../routes/api_routes.js");
var request = require('supertest');
var SPY = require('../server.js');

describe("Hello", function() {
    it("tests the Testing", function (done) {
        expect("hello").to.eql("hello");
        done();
    });
});

// can use supertest
describe("Server", function() {
    var localStorage = {};

    it("tests the server", function (done) {
        request(SPY.listener).get('/').expect(200, done);
    });

    // for api tests, need to login first to get a token for a session
    it("logs in successfully", function (done) {
        request(SPY.listener)
            .post('/api/sessions')
            .send({ username: process.env.TEST_USERNAME, password: process.env.TEST_PASSWORD })
            .expect(200)
            .end(function (error, response) {
                if (error) {
                    done(error);
                }
                localStorage.authorization = response.headers.authorization;
                done();
            });
    });

    it("uses session token for authentication", function (done) {
        request(SPY.listener)
            .get('/api/hello')
            .set('Authorization', localStorage.authorization)
            .expect(200)
            .end(function (error, response) {
              if (error) {
                done(error);
              }
              console.log(response.body);
              done();
            });
    });

    /*
      When the server contains exactly one connection,
      listener is the node HTTP server object of the sole connection.
      When the server contains more than one connection,
      each server.connections array member provides its own connection.listener.
    */
});

// or Hapi's native inject() function
describe("View Routes", function () {
    it("retrieve the main page", function (done) {
        var options = {
            method: "GET",
            url: '/'
        };
        SPY.inject(options, function (response) {
            expect(response.statusCode).to.eql(200);
            done();
        });
    });

    it("retrieve the front desk page", function (done) {
        var options = {
            method: "GET",
            url: '/login'
        };
        SPY.inject(options, function (response) {
            expect(response.statusCode).to.eql(200);
            done();
        });
    });

    it("retrieve the front desk page", function (done) {
        var options = {
            method: "GET",
            url: '/frontdesk'
        };
        SPY.inject(options, function (response) {
            expect(response.statusCode).to.eql(200);
            done();
        });
    });
});

// describe("API Routes", function () {
//     it("gets all casemanagers", function (done) {
//         var options = {
//             method: "GET",
//             url: "api/casemanagers"
//         };
//         SPY.inject(options, function (response) {
//             expect(response.statusCode).to.eql(200);
//             done();
//         });
//     });
// });
