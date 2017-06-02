module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('Client', [
      {
        firstName: 'John',
        lastName: 'Doe',
        nickname: '',
        birthdate: new Date('2222-01-01'),
        email: 'jdoe@email.com',
        phone: '555-555-5555',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: 'Steven',
        lastName: 'Brown',
        nickname: '',
        birthdate: new Date('2222-01-01'),
        email: 'sbrown@email.com',
        phoneNumber: '555-555-5555',
        casePlan: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: 'Carlie',
        lastName: 'Smith',
        nickname: '',
        birthdate: new Date('2222-01-01'),
        email: 'csmith@email.com',
        phoneNumber: '555-555-5555',
        casePlan: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: 'Trevor',
        lastName: 'Woods',
        nickname: '',
        birthdate: new Date('2222-01-01'),
        email: 'twoods@email.com',
        phoneNumber: '555-555-5555',
        casePlan: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete('Client', null, {});
  }
};
