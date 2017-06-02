module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING
  },
  { // options
    classMethods: {
      associate: (models) => {
        // associations can be defined here
      }
      /*
        associations determine the form of the setters and getters that are returned
        along with the object that is a result of a query, such as a SELECT query

        let user = User.findOne({ where: { username: 'test1' }})
        // user is a Promise!

        user.then((result) => {
          console.log(result);
          result.getRoles();
        });

        result not only has the data asked for, it has other functions
        such as getters and setters as well
        getRoles() is defined by the belongsToMany() association
        hasOne, hasMany, belongsToOne all determine the form of the
        getters and setters

        but if you don't use setters and getters, then don't need to set
        associations
      */
    },
    // by default, sequelize replaces table names with plural form
    freezeTableName: true,
    underscored: false
  });
  return User;
};