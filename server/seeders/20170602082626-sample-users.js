'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('User', [
      {
        username: 'test',
        password: '$2a$10$6Sb3QDKlIg9.L6LcQacAqOYZ2K5EfB1FTzdLrmtUQbBxy4Igg0XoW',
        firstname: null,
        lastname: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'jew@spy.org',
        password: '$2a$10$6Sb3QDKlIg9.L6LcQacAqOYZ2K5EfB1FTzdLrmtUQbBxy4Igg0XoW',
        firstname: 'Jeanine',
        lastname: 'E-W',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'bp@spy.org',
        password: '$2a$10$6Sb3QDKlIg9.L6LcQacAqOYZ2K5EfB1FTzdLrmtUQbBxy4Igg0XoW',
        firstname: 'Ben',
        lastname: 'P',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'rh@spy.org',
        password: '$2a$10$6Sb3QDKlIg9.L6LcQacAqOYZ2K5EfB1FTzdLrmtUQbBxy4Igg0XoW',
        firstname: 'Rob',
        lastname: 'H',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete('User', null, {});
  }
};
