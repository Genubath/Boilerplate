module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('UserRoles', [
      {
        name: 'funeralDirector',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'scheduler',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'ncoic',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },
  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.bulkDelete('UserRoles', null, {})]);
  }
};
