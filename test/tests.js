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

let postRequest = function (url, payload) {
  return request(SPY.listener).post(url).send(payload);
};

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
    before((done) => {
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
                return done();
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

  it("edits client profiles", () => {
    request(SPY.listener)
      .put('/api/clients/1')
      .send({
        expression: JSON.stringify({
          firstname: 'John',
          lastname: 'Doe',
          phonenumber: '123-456-7890',
          email: 'jdoe@email.com'
        })
      })
      .expect(200)
      .then((response) => {

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
        return done();
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
            // console.log(response);
          });
      });
  });

  it('retrieves all dropin sessions', () => {
    return request(SPY.listener)
      .get('/api/dropins')
      .expect(200)
      .then((response) => {
        expect(response.body.result.length).to.equal(2);
      });
  });

  it('retrieves a dropin session by ID', () => {
    return request(SPY.listener)
      .get('/api/dropins/2')
      .expect(200)
      .then((response) => {
        expect(response.body.result.id).to.equal(2);
        expect(response.body.result).to.have.property('date');
      });
  });
});

describe("Client Checkin", () => {
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
        return done();
      });
    });
  });

  it("checks clients into dropin", () => {
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
        request(SPY.listener)
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
              .post('/api/dropins')
              .send({
                date: new Date()
              })
              .expect(201)
              .then((response) => {
                return request(SPY.listener)
                  .post('/dropins/1/checkin')
                  .set('contentType', 'application/json')
                  .set('dataType', 'json')
                  .send(JSON.stringify({ clients: [1, 2] }))
                  .expect(201)
                  .then((response) => {
                    console.log(response.body);
                  });
              });
          });
      });
  });
});

describe('Activities', () => {
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
        // a sample program for activities to reference
        client.query('INSERT INTO program (program_name) VALUES (\'Legal\');', function (error, result) {
          if (error) {
            release();
            return done(error);
          }
          release();
          return done();
        });
      });
    });
  });

  it('creates new activities', () => {
    return request(SPY.listener)
      .post('/api/activity')
      .send({
        activityname: 'Orientation',
        programID: 1
      })
      .expect(201)
      .then((response) => {

      });
  });

  // it('edits an activity', () => {
  //   return request(SPY.listener)
  //     .put('/editactivity')
  //     .send({
  //       id: 1,
  //       activityname: 'Orientation',
  //       ongoing: false
  //     })
  //     .expect(200)
  //     .then((response) => {
  //
  //     });
  // });
});

describe('Users', () => {
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
        return done();
      });
    });
  });


  it('creates new users', () => {
    return request(SPY.listener)
      .post('/api/users')
      .send({
        username: 'testusername',
        password: 'hereisapassword'
      })
      .expect(201)
      .then((response) => {
        return request(SPY.listener)
          .post('/api/users')
          .send({
            username: 'anothertestusername',
            password: 'hereisanotherpassword'
          })
          .expect(201)
          .then((response) => {

          });
      });
  });

  it('retrieves users', () => {
    return request(SPY.listener)
      .get('/api/users')
      .expect(200)
      .then((response) => {
        expect(response.body.result.length).to.equal(2);
      });
  });

});

describe('Roles', () => {
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
        return done();
      });
    });
  });

  it('creates roles', () => {
    return request(SPY.listener)
      .post('/api/roles')
      .send({
        name: 'intern'
      })
      .expect(201)
      .then((response) => {
        console.log(response.body);
        return request(SPY.listener)
          .post('/api/roles')
          .send({
            name: 'volunteer'
          })
          .expect(201)
          .then((response) => {

          });
      });
  });

  it('retrieves all roles', () => {
    return request(SPY.listener)
      .get('/api/roles')
      .expect(200)
      .then((response) => {
        expect(response.body.result.length).to.equal(2);
      });
  });

  it('assigns roles to users', () => {
    // postRequest('/api/users', { username: 'testusername', password: 'hereisapassword' }).expect(201)
    //   .then(() => postRequest('/api/users', { username: 'anothertestusername', password: 'hereisanotherpassword' }).expect(201))
    //   .then(() => postRequest('/api/users/1/roles', { roleid: 5 }).expect(201))
    //   .then(() => postRequest('/api/users/2/roles', { roleid: 6 }).expect(201))
    //   .then((response) => {
    //
    //   });
    return request(SPY.listener)
      .post('/api/users')
      .send({
        username: 'testusername',
        password: 'hereisapassword'
      })
      .expect(201)
      .then((response) => {
        return request(SPY.listener)
          .post('/api/users')
          .send({
            username: 'anothertestusername',
            password: 'hereisanotherpassword'
          })
          .expect(201)
          .then((response) => {
            return request(SPY.listener)
              .post('/api/users/1/roles')
              .send({
                roleId: 1
              })
              .expect(201)
              .then((response) => {
                return request(SPY.listener)
                  .post('/api/users/2/roles')
                  .send({
                    roleId: 2
                  })
                  .expect(201)
                  .then((response) => {

                  });
              });
          });
      });
  });

  it('retrieves roles by user ID', () => {
    return request(SPY.listener)
      .get('/api/users/1/roles')
      .expect(200)
      .then((response) => {
        expect(response.body.result.length).to.equal(1);
        expect(response.body.result[0]).to.equal('intern');
        return request(SPY.listener)
          .get('/api/users/2/roles')
          .expect(200)
          .then((response) => {
            expect(response.body.result.length).to.equal(1);
            expect(response.body.result[0]).to.equal('volunteer');
          });
      });
  });

});

describe('Case Notes', () => {
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
        return done();
      });
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