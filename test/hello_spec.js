// require('dotenv').config();
var chai = require("chai");
var expect = chai.expect;
// var apiroutes = require("../routes/api_routes.js");
var request = require('supertest');
var SPY = require('../server.js');

/*
  db configurations are in the postgres pool _factory object
    SPY.postgres.pool._factory => { user, password, host, port, database, . . . }
*/

describe("Hello", function() {
    it("tests the Testing", function (done) {
        expect("hello").to.eql("hello");
        done();
    });
});

describe("API Routes", function() {
    // in the future, will use model functions or API endpoint
    // for deleting all rows in all tables so the testing code
    // doesn't have to rely on postgres specifically
    // for now though, we will use postgres directly in the tests
    beforeEach(function (done) {
        SPY.postgres.connect(function (error, client, release) {
            if (error) {
                release(error);
                return done(error);
            }
            console.log("**** outside ****");  // vvv needs quotes, otherwise, interprets it as column name
            client.query(`SELECT truncate_tables(\'${SPY.postgres.pool._factory.user}\');`, function (error, result) {
                if (error) {
                    release();
                    return done(error);
                }
                release();
                console.log("======================");
                console.log(result);
                done();
            });
        });
    });

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

    // ****** These other tests rely on the /api/sessions test to get the token!!!!
    // need to find different implementation
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
