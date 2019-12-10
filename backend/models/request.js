const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define(
    'Request',
    {
      honorsAddress: DataTypes.STRING,
      honorsCity: DataTypes.STRING,
      honorsState: DataTypes.STRING,
      honorsCounty: DataTypes.STRING,
      honorsZip: DataTypes.STRING,
      honorsGps: DataTypes.STRING,
      locationNotes: DataTypes.STRING,
      deceasedFirstName: DataTypes.STRING,
      deceasedLastName: DataTypes.STRING,
      deceasedSSN: DataTypes.STRING,
      honorsRank: {
        type: Sequelize.ENUM,
        values: [
          'E-1: Airman Basic',
          'E-2: Airman',
          'E-3: Airman First Class',
          'E-4: Senior Airman',
          'E-5: Staff Sergeant',
          'E-6: Technical Sergeant',
          'E-7: Master Sergeant',
          'E-8: Senior Master Sergeant',
          'E-9: Chief Master Sergeant',
          'O-1: 2nd Lieutenant',
          'O-2: 1st Lieutenant',
          'O-3: Captain',
          'O-4: Major',
          'O-5: Lieutenant Colonel',
          'O-6: Colonel',
          'O-7: Brigadier General',
          'O-8: Major General',
          'O-9: Lieutenant General',
          'O-10: General'
        ]
      },
      branchOfService: {
        type: Sequelize.ENUM,
        values: ['US Air Force', 'US Army Air Corps', 'US Army Air Force']
      },
      memberStatus: {
        type: Sequelize.ENUM,
        values: ['Retired', 'Veteran', 'Active Duty', 'Repatriated Remains']
      },
      // location_id: Sequelize.INTEGER,
      funeralHome_id: Sequelize.INTEGER,
      funeralHomeAddress: DataTypes.STRING,
      funeralHomeCity: DataTypes.STRING,
      funeralHomeState: DataTypes.STRING,
      funeralHomeCounty: DataTypes.STRING,
      funeralHomeZipcode: DataTypes.STRING,
      funeralHomeName: DataTypes.STRING,
      requestor_id: Sequelize.INTEGER,
      requestorName: DataTypes.STRING,
      requestorEmail: DataTypes.STRING,
      requestorPhoneNumber: DataTypes.STRING,
      requestorFaxNumber: DataTypes.STRING,
      relationship: DataTypes.STRING,
      serviceDateTime: Sequelize.DATE,
      serviceTimeZone: {
        type: Sequelize.ENUM,
        values: ['Central Time', 'Eastern Time']
      },
      serviceType: {
        type: Sequelize.ENUM,
        values: [
          'Casket',
          'Cremation',
          'Memorial',
          'Internment',
          'Inurnment',
          'Entombment',
          'Vault Lid',
          'Chapel',
          'Other'
        ]
      },
      serviceLocationName: DataTypes.STRING,
      isFlagFamilyProvided: Sequelize.BOOLEAN,
      isVSOOrgInvolved: Sequelize.BOOLEAN,
      VSODetails: DataTypes.STRING,
      comments: DataTypes.STRING,
      NPBRank: DataTypes.STRING,
      NPBName: DataTypes.STRING,
      NPBPhone: DataTypes.STRING,
      isEligible: DataTypes.BOOLEAN,
      flagsPresented: DataTypes.INTEGER,
      is1946Complete: DataTypes.BOOLEAN,
      isSchedulerCreated: DataTypes.BOOLEAN,
      guardUnit: DataTypes.STRING,
      pocName: DataTypes.STRING,
      pocNumber: DataTypes.STRING,
      requestType: {
        type: Sequelize.ENUM,
        values: ['FUNERAL_DIRECTOR', 'FAMILY', 'ACTIVE_DUTY']
      }
    },
    {}
  );
  return Request;
};
