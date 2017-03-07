var chai = require("chai");
var expect = chai.expect;
var apiroutes = require("../../routes/api_routes.js");
var request = require('supertest');
var SPY = require('../../server.js');

describe("Hello", function() {
    it("tests the Testing", function (done) {
        expect("hello").to.eql("hello");
        done();
    });
});

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