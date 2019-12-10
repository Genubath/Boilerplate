module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Requests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      deceasedFirstName: {
        type: Sequelize.STRING
      },
      deceasedLastName: {
        type: Sequelize.STRING
      },
      deceasedSSN: { type: Sequelize.STRING },
      branchOfService: {
        type: Sequelize.ENUM(
          'US Air Force',
          'US Army Air Corps',
          'US Army Air Force'
        )
      },
      memberStatus: {
        type: Sequelize.ENUM(
          'Retired',
          'Veteran',
          'Active Duty',
          'Repatriated Remains'
        )
      },
      location_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'FuneralLocations',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      requestor_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      serviceDateTime: { type: Sequelize.DATE },
      serviceTimeZone: { type: Sequelize.ENUM('Central Time', 'Eastern Time') },
      serviceType: {
        type: Sequelize.ENUM(
          'Casket',
          'Cremation',
          'Memorial',
          'Internment',
          'Inurnment',
          'Entombment',
          'Vault Lid',
          'Chapel',
          'Other'
        )
      },
      isFlagFamilyProvided: { type: Sequelize.BOOLEAN, defaultValue: false },
      isVSOOrgInvolved: { type: Sequelize.BOOLEAN },
      VSODetails: { type: Sequelize.STRING },
      comments: { type: Sequelize.STRING },
      funeralHome_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'FuneralHomes',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      honorsAddress: { type: Sequelize.STRING },
      honorsCity: { type: Sequelize.STRING },
      honorsState: { type: Sequelize.STRING },
      honorsCounty: { type: Sequelize.STRING },
      honorsZip: { type: Sequelize.STRING },
      honorsGps: { type: Sequelize.STRING },
      NPBRank: { type: Sequelize.STRING },
      NPBName: { type: Sequelize.STRING },
      NPBPhone: { type: Sequelize.STRING },
      serviceLocationName: { type: Sequelize.STRING },
      funeralHomeAddress: { type: Sequelize.STRING },
      funeralHomeCity: { type: Sequelize.STRING },
      funeralHomeState: { type: Sequelize.STRING },
      funeralHomeCounty: { type: Sequelize.STRING },
      funeralHomeZipcode: { type: Sequelize.STRING },
      requestorName: { type: Sequelize.STRING },
      requestorEmail: { type: Sequelize.STRING },
      requestorPhoneNumber: { type: Sequelize.STRING },
      requestorFaxNumber: { type: Sequelize.STRING },
      locationNotes: { type: Sequelize.STRING },
      funeralHomeName: { type: Sequelize.STRING },
      honorsRank: { type: Sequelize.STRING },
      relationship: { type: Sequelize.STRING },
      isEligible: { type: Sequelize.BOOLEAN },
      isPreformingDignifiedArrival: { type: Sequelize.BOOLEAN },
      DignifiedArrivalPreformer: { type: Sequelize.STRING },
      isFamilyAttending: { type: Sequelize.BOOLEAN },
      numberOfFamilyAttending: { type: Sequelize.INTEGER },
      destinationAirport: { type: Sequelize.STRING },
      flightNumber: { type: Sequelize.STRING },
      flightDate: { type: Sequelize.DATE },
      baseRequestingHonors: { type: Sequelize.STRING },
      formOfContact: { type: Sequelize.STRING },
      MortuaryOfficer: { type: Sequelize.STRING },
      entitledFlagRecipients: { type: Sequelize.INTEGER },
      flagsPresented: { type: Sequelize.INTEGER },
      hardwoodCasesPresented: { type: Sequelize.INTEGER },
      providingMortuaryOffice: { type: Sequelize.STRING },
      isCasket: { type: Sequelize.BOOLEAN },
      is1946Complete: { type: Sequelize.BOOLEAN },
      isSchedulerCreated: { type: Sequelize.BOOLEAN, defaultValue: false },
      requestType: {
        type: Sequelize.ENUM('FUNERAL_DIRECTOR', 'FAMILY', 'ACTIVE_DUTY')
      },
      guardUnit: { type: Sequelize.STRING },
      pocName: { type: Sequelize.STRING },
      pocNumber: { type: Sequelize.STRING },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.dropTable('Requests')]);
  }
};
