const Client = require('../models').Client;

module.exports = {
  create(request, response) {
    return Client
      .create({
        firstname: request.body.firstname,
        lastname: request.body.lastname,
        nickname: request.body.nickname,
        birthdate: request.body.birthdate,
        email: request.body.email,
        phone: request.body.phone
      })
      .then((client) => response.status(201).send(client))
      .catch((error) => {
        response.status(400).send(error);
      });
  },

  list(request, response) {
    return Client
      .findAll({})
      .then((clients) => response.status(200).send(clients))
      .catch((error) => response.status(400).send(error));
  }
};