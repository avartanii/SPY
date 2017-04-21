var Joi = require('joi');

var schema = {

    newUser: Joi.object().keys({
        username: Joi.string().required().trim(),
        password: Joi.string().required().min(8).trim()
    }).unknown(false),

    /*
      This is saying that for the request that uses this validation function 'newUser',
      the payload provided by the ajax call must be an object that contains
      the properties 'username' and 'password' with the restrictions specified
      by Joi.

      Ex: username: Joi.string().required().trim()
      says property 'username' must be a string, and the property is required
      then it trims the leading and trailing whitespaces

      {
          method: 'POST',
          path: '/users',
          config: {
              validate: {
                  payload: Schema.newUser
              }
          },
          handler: Api.createUser
      }
    */

    login: Joi.object().keys({
        username: Joi.string().required().trim(),
        password: Joi.string().required().trim()
    }).unknown(false),

    changeCurrentUserPassword: Joi.object().keys({
        password: Joi.string().required().trim(),
        newPassword: Joi.string().required().min(8).trim()
    }).unknown(false),

    notification: Joi.object().keys({
        type: Joi.string().trim(),
        comment: Joi.string().required().trim(),
        link: Joi.string().trim(),
        checked: Joi.boolean()
    }).unknown(false),

    updateNotification: Joi.object().keys({
        type: Joi.string().trim(),
        comment: Joi.string().trim(),
        link: Joi.string().trim(),
        checked: Joi.boolean()
    }).unknown(false),

    createDropIn: Joi.object().keys({
        date: Joi.string().isoDate().required()
    }).unknown(false),

    addActivitiesToDropIn: Joi.object().keys({
        activities: Joi.array().items(Joi.object().keys({
            id: Joi.number().integer().required(),
            room: Joi.string(),
            comments: Joi.string(),
            startTime: Joi.string(),
            endTime: Joi.string()
        }).required()).required()
    }).unknown(false),

    removeActivitiesFromDropin: Joi.object().keys({
        activities: Joi.array().items(Joi.number().integer().required()).required()
    }).unknown(false),

    addCheckinForDropin: Joi.object().keys({
        clients: Joi.array().items(Joi.number().integer().required()).required()
    }).unknown(false),

    addEnrollmentToDropinActivity: Joi.object().keys({
        clients: Joi.array().items(Joi.number().integer().required()).required()
    }).unknown(false),

    removeCheckinForDropin: Joi.object().keys({
        clients: Joi.array().items(Joi.number().integer().required()).required()
    }).unknown(false),

    removeEnrollmentToDropinActivity: Joi.object().keys({
        clients: Joi.array().items(Joi.number().integer().required()).required()
    }).unknown(false)
};

module.exports = schema;
