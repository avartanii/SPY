const User = require('../models').User; // this comes from models/index.js

module.exports = {
    // User.create() builds an instance (a row) in the User table
    // and saves it
    create (request, response) {
      return User
      .create({
        firstname: request.body.firstname,
        lastname: request.body.lastname,
        username: request.body.username,
        password: request.body.password // use bcrypt at this level and then send the hash to the model
      })
      .then((user) => response.status(200).send(user))
      .catch((error) => response.status(400).send(error));
      // on success, the callback passed into the promise
      // that returns from .then() will receive the instance
      // just created
      // or Sequelize will return an error
      // Sequelize.ValidationError
    },

    list(request, response) {
      return User
        .findAll({})
        .then((users) => response.status(200).send(users))
        .catch((error) => response.status(400).send(error));
    },
};
