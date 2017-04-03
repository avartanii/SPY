// comment to test commenting

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
    it("tests the server", function (done) {
        request(SPY.listener).get('/').expect(200, done);
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
