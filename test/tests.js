// require('dotenv').config();
const chai = require("chai");
const expect = chai.expect;
// const apiroutes = require("../routes/api_routes.js");
const request = require('supertest');
const SPY = require('../server.js');

/*
  db configurations are in the postgres pool _factory object
    SPY.postgres.pool._factory => { user, password, host, port, database, . . . }
*/

describe("Hello", () => {
    it("tests the Testing", (done) => {
        expect("hello").to.eql("hello");
        done();
    });
});

describe("API Routes", () => {
    // in the future, will use model functions or API endpoint
    // for deleting all rows in all tables so the testing code
    // doesn't have to rely on postgres specifically
    // for now though, we will use postgres directly in the tests
    beforeEach((done) => {
        SPY.postgres.connect((error, client, release) => {
            if (error) {
                release(error);
                return done(error);
            }                                  // getting the user from the client connection
                                              // vvv needs quotes, otherwise, interprets it as column name
            client.query(`SELECT truncate_tables(\'${SPY.postgres.pool._factory.user}\');`, (error, result) => {
                if (error) {
                    release();
                    return done(error);
                }
                release();
                done();
            });
        });
    });

    // let localStorage = {};

    it("tests the server", (done) => {
        request(SPY.listener).get('/').expect(200, done);
    });

    // authentication disabled for testing
    // it("logs in successfully", (done) => {
    //     request(SPY.listener)
    //         .post('/api/sessions')
    //         .send({ username: process.env.TEST_USERNAME, password: process.env.TEST_PASSWORD })
    //         .expect(200)
    //         .end(function (error, response) {
    //             if (error) {
    //                 done(error);
    //             }
    //             localStorage.authorization = response.headers.authorization;
    //             done();
    //         });
    // });

    // ****** These other tests rely on the /api/sessions test to get the token!!!!
    // need to find different implementation
    it("initial api endpoint", (done) => {
        request(SPY.listener)
            .get('/api/hello')
            // .set('Authorization', localStorage.authorization)
            .expect(200)
            .end((error, response) => {
                if (error) {
                    return done(error);
                }
                return done();
            });
    });

    /*
      When the server contains exactly one connection,
      listener is the node HTTP server object of the sole connection.
      When the server contains more than one connection,
      each server.connections array member provides its own connection.listener.
    */
});

describe("Client profiles", () => {
  before((done) => {
    SPY.postgres.connect((error, client, release) => {
      if (error) {
        release(error);
        return done(error);
      }
      client.query(`SELECT truncate_tables(\'${SPY.postgres.pool._factory.user}\');`, function (error, result) {
        if (error) {
          release();
          return done(error);
        }
        release();
        done();
      });
    });
  });

  // Don't need done() when using Promises!!!
  it("adds client profiles", () => {
    return request(SPY.listener)
      .post('/api/clients')
      .send({
          expression: JSON.stringify({
              firstname: "John",
              lastname: "Doe"
          })
      })
      .expect(201)
      .then((response) => {
        console.log(response.body);
      });
      // error-handling, such as catches
      // are taken care of by superagent-as-promised
      // that comes with supertest
  });

  it("retrieves client profiles", () => {
    return request(SPY.listener)
      .get('/api/clients')
      .expect(200)
      .then((response) => {
        console.log(response.body);
      });
  });

  it("retrieves client profiles by ID", () => {
    return request(SPY.listener)
      .post('/api/clients')
      .send({
        expression: JSON.stringify({
          firstname: "Alice",
          lastname: "Smith"
        })
      })
      .expect(201)
      .then((response) => {
        return request(SPY.listener)
          .get('/api/clients/2')
          .expect(200)
          .then((response) => {
            expect(response.body.result.length).to.equal(1);
            expect(response.body.result[0].firstname).to.equal('Alice');
            expect(response.body.result[0].lastname).to.equal('Smith');
          });
      });
  });

  it("edits client profiles", (done) => {
    request(SPY.listener)
      .put('/api/clients/1')
      .send({
          firstname: 'John',
          lastname: 'Doe',
          phonenumber: '123-456-7890',
          email: 'jdoe@email.com',
      })
      .expect(200)
      .end((error, response) => {
        if (error) {
          return done(error);
        }
        return done();
      });
  });
});

describe('Dropins', () => {
  before((done) => {
    SPY.postgres.connect((error, client, release) => {
      if (error) {
        release(error);
        return done(error);
      }
      client.query(`SELECT truncate_tables(\'${SPY.postgres.pool._factory.user}\');`, function (error, result) {
        if (error) {
          release();
          return done(error);
        }
        release();
        done();
      });
    });
  });

  it('creates a new dropin session', () => {
    return request(SPY.listener)
      .post('/api/dropins')
      .send({
        date: new Date()
      })
      .expect(201)
      .then((response) => {
        return request(SPY.listener)
          .post('/api/dropins')
          .send({
            date: new Date()
          })
          .expect(201)
          .then((response) => {

          });
      });
  });

  it('retrieves all dropin sessions', () => {
    return request(SPY.listener)
      .get('/api/dropins')
      .expect(200)
      .then((response) => {
        expect(response.body.length).to.equal(2);
      });
  });

  it('retrieves a dropin session by ID', () => {
    return request(SPY.listener)
      .get('/api/dropins/2')
      .expect(200)
      .then((response) => {
        expect(response.body.length).to.equal(1);
      });
  });
});

// or Hapi's native inject() function
describe("View Routes", () => {
    it("retrieve the main page", (done) => {
        let options = {
            method: "GET",
            url: '/'
        };
        SPY.inject(options, (response) => {
            expect(response.statusCode).to.eql(200);
            done();
        });
    });

    it("retrieve the front desk page", (done) => {
        let options = {
            method: "GET",
            url: '/login'
        };
        SPY.inject(options, (response) => {
            expect(response.statusCode).to.eql(200);
            done();
        });
    });

    it("retrieve the front desk page", (done) => {
        let options = {
            method: "GET",
            url: '/frontdesk'
        };
        SPY.inject(options, (response) => {
            expect(response.statusCode).to.eql(200);
            done();
        });
    });
});
