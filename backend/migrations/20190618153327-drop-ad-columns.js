module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Requests', 'isPreformingDignifiedArrival'),
      queryInterface.removeColumn('Requests', 'DignifiedArrivalPreformer'),
      queryInterface.removeColumn('Requests', 'isFamilyAttending'),
      queryInterface.removeColumn('Requests', 'numberOfFamilyAttending'),
      queryInterface.removeColumn('Requests', 'destinationAirport'),
      queryInterface.removeColumn('Requests', 'flightNumber'),
      queryInterface.removeColumn('Requests', 'flightDate'),
      queryInterface.removeColumn('Requests', 'baseRequestingHonors'),
      queryInterface.removeColumn('Requests', 'formOfContact'),
      queryInterface.removeColumn('Requests', 'MortuaryOfficer'),
      queryInterface.removeColumn('Requests', 'entitledFlagRecipients'),
      queryInterface.removeColumn('Requests', 'hardwoodCasesPresented'),
      queryInterface.removeColumn('Requests', 'providingMortuaryOffice'),
      queryInterface.removeColumn('Requests', 'isCasket')
    ]);
  },
  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Requests', 'isPreformingDignifiedArrival', {
        type: Sequelize.BOOLEAN
      }),
      queryInterface.addColumn('Requests', 'DignifiedArrivalPreformer', {
        type: Sequelize.STRING
      }),
      queryInterface.addColumn('Requests', 'isFamilyAttending', {
        type: Sequelize.BOOLEAN
      }),
      queryInterface.addColumn('Requests', 'numberOfFamilyAttending', {
        type: Sequelize.INTEGER
      }),
      queryInterface.addColumn('Requests', 'destinationAirport', {
        type: Sequelize.STRING
      }),
      queryInterface.addColumn('Requests', 'flightNumber', {
        type: Sequelize.STRING
      }),
      queryInterface.addColumn('Requests', 'flightDate', {
        type: Sequelize.DATE
      }),
      queryInterface.addColumn('Requests', 'baseRequestingHonors', {
        type: Sequelize.STRING
      }),
      queryInterface.addColumn('Requests', 'formOfContact', {
        type: Sequelize.STRING
      }),
      queryInterface.addColumn('Requests', 'MortuaryOfficer', {
        type: Sequelize.STRING
      }),
      queryInterface.addColumn('Requests', 'entitledFlagRecipients', {
        type: Sequelize.INTEGER
      }),
      queryInterface.addColumn('Requests', 'hardwoodCasesPresented', {
        type: Sequelize.INTEGER
      }),
      queryInterface.addColumn('Requests', 'providingMortuaryOffice', {
        type: Sequelize.STRING
      }),
      queryInterface.addColumn('Requests', 'isCasket', {
        type: Sequelize.BOOLEAN
      })
    ]);
  }
};
