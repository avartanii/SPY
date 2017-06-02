'use strict';
module.exports = function(sequelize, DataTypes) {
  var user.js = sequelize.define('user.js', {
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return user.js;
};