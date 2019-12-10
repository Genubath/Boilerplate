const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const FuneralLocation = sequelize.define(
      'FuneralLocation',
      {
        name: DataTypes.STRING,
        address: DataTypes.STRING,
        city: DataTypes.STRING,
        state: DataTypes.STRING,
        gps: DataTypes.STRING,
        county: DataTypes.STRING,
        zip: DataTypes.STRING,
        notes: DataTypes.STRING,
        user_id: Sequelize.INTEGER
      },
      {}
    );
    return FuneralLocation;
  };
  