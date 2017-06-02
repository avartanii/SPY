'use strict';
module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define('client', {
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    nickname: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    birthdate: DataTypes.DATE
  }, {
    classMethods: {
      associate: (models) => {
        // associations can be defined here
      }
    },
    freezeTableName: true,
    underscored: false
  });
  return Client;
};