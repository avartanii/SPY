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

const client1 = {
  firstName: 'John',
  lastName: 'Doe',
  phoneNumber: '123-456-7890',
  email: 'jdoe@email.com'
};
const client2 = {
  firstName: "Alice",
  lastName: "Smith",
  phoneNumber: '123-456-7890',
  email: 'asmith@email.com'
};
const user1 = { username: 'testusername', password: 'hereisapassword' };
const user2 = { username: 'anothertestusername', password: 'hereisanotherpassword' };

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
      .send(client1)
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
      .send(client2)
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
      .send(client1)
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
    return Promise.all([
      postRequest('/api/dropins', { date: new Date() }).expect(201),
      postRequest('/api/dropins', { date: new Date() }).expect(201)
    ]).then(() => {

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
    return Promise.all([
      postRequest('/api/clients', client1).expect(201),
      postRequest('/api/clients', client2).expect(201),
      postRequest('/api/dropins', { date: new Date() }).expect(201)
    ]).then(() => {
      return request(SPY.listener)
        .post('/api/dropins/1/checkin')
        .send({ clients: [1, 2] })
        .expect(201)
        .then((response) => {
          console.log(response.body);
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
    return Promise.all([
      postRequest('/api/users', user1).expect(201),
      postRequest('/api/users', user2).expect(201)
    ]).then(() => {

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
    return Promise.all([
      postRequest('/api/roles', { name: 'intern' }).expect(201),
      postRequest('/api/roles', { name: 'volunteer' }).expect(201)
    ]).then(() => {

    });
  });

  it('retrieves all roles', () => {
    return request(SPY.listener)
      .get('/api/roles')
      .expect(200)
      .then((response) => {
        console.log(response.body);
        expect(response.body.result.length).to.equal(2);
      });
  });

  it('assigns roles to users', () => {
    return Promise.all([
      postRequest('/api/users', user1).expect(201),
      postRequest('/api/users', user2).expect(201)
    ]).then(() => {
      return Promise.all([
        postRequest('/api/users/1/roles', { roleId: 1 }).expect(201),
        postRequest('/api/users/2/roles', { roleId: 2 }).expect(201)
      ]).then(() => {

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

  it("creates new Case Notes", () => {
    let casenote1 = {
      clientID: 1,
      caseManagerID: 1,
      date: new Date(),
      category: "CM",
      note: "This is a case note.",
      followUpNeeded: true
    };
    let casenote2 = {
      clientID: 1,
      caseManagerID: 1,
      date: new Date(),
      category: "CM",
      note: "This is a case note.",
      followUpNeeded: true
    };
    let casenote3 = {
      clientID: 2,
      caseManagerID: 2,
      date: new Date(),
      category: "CM",
      note: "This is a case note.",
      followUpNeeded: true
    };
    let casenote4 = {
      clientID: 2,
      caseManagerID: 2,
      date: new Date(),
      category: "CM",
      note: "This is a case note.",
      followUpNeeded: true
    };
    return Promise.all([
      postRequest('/api/clients', client1).expect(201),
      postRequest('/api/clients', client2).expect(201),
      postRequest('/api/users', user1).expect(201),
      postRequest('/api/users', user2).expect(201)
    ]).then((response) => {
      return Promise.all([
        postRequest('/api/case_notes', casenote1).expect(201),
        postRequest('/api/case_notes', casenote2).expect(201),
        postRequest('/api/case_notes', casenote3).expect(201),
        postRequest('/api/case_notes', casenote4).expect(201)
      ]).then(() => {

      });
    });
  });

  it("retrieves all Case Notes for a client by clientID", () => {
    return request(SPY.listener)
      .get('/api/case_notes/1')
      .expect(200)
      .then((response) => {
        expect(response.body.result.length).to.equal(2);
        expect(response.body.result[0].clientID).to.equal(1);
        expect(response.body.result[0].caseManagerID).to.equal(1);
        expect(response.body.result[0].category).to.equal("CM");
        expect(response.body.result[0].note).to.equal("This is a case note.");
        expect(response.body.result[0].followUpNeeded).to.equal(true);
      });
  });

  it("retrieves a single Case Note by caseNoteID", () => {
    return request(SPY.listener)
      .get('/api/case_notes/notes/4')
      .expect(200)
      .then((response) => {
        expect(response.body.result.length).to.equal(2);
        expect(response.body.result[0].clientID).to.equal(2);
        expect(response.body.result[0].caseManagerID).to.equal(1);
        expect(response.body.result[0].category).to.equal("CM");
        expect(response.body.result[0].note).to.equal("This is a case note.");
        expect(response.body.result[0].followUpNeeded).to.equal(true);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  it("edits Case Notes by caseNoteID", () => {
    return request(SPY.listener)
      .put('/api/case_notes/2')
      .send({
        clientID: 1,
        caseManagerID: 2,
        date: new Date(),
        note: "This is a case note.",
        category: "CM",
        followUpNeeded: true
      })
      .expect(200)
      .then(() => {

      });
  });


});


describe('Notifications', () => {

  it('creates a Notification by userId', () => {

  });

  it('retrieves all notifications for a user by userId', () => {

  });

  it('retrieves a specifica notification by notificationId', () => {

  });
});

// or Hapi's native inject() function
// describe("View Routes", () => {
//     it("retrieve the main page", (done) => {
//         let options = {
//             method: "GET",
//             url: '/'
//         };
//         SPY.inject(options, (response) => {
//             expect(response.statusCode).to.eql(200);
//             done();
//         });
//     });
//
//     it("retrieve the front desk page", (done) => {
//         let options = {
//             method: "GET",
//             url: '/login'
//         };
//         SPY.inject(options, (response) => {
//             expect(response.statusCode).to.eql(200);
//             done();
//         });
//     });
//
//     it("retrieve the front desk page", (done) => {
//         let options = {
//             method: "GET",
//             url: '/frontdesk'
//         };
//         SPY.inject(options, (response) => {
//             expect(response.statusCode).to.eql(200);
//             done();
//         });
//     });
// });
