const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    role_id: DataTypes.INTEGER,
    isActive: DataTypes.BOOLEAN,
    rank: {
      type: Sequelize.ENUM,
      values: [
        'AB',
        'Amn',
        'A1C',
        'SrA',
        'SSgt',
        'TSgt',
        'MSgt',
        'SMSgt',
        'CMSgt',
        '2d Lt',
        '1st Lt',
        'Capt',
        'Maj',
        'Lt Col',
        'Col',
        'Brig Gen',
        'Maj Gen',
        'Lt Gen',
        'Gen'
      ]
    },
    email: { type: DataTypes.STRING, unique: true },
    presetFuneralHomeId: DataTypes.INTEGER,
    presetLocationId: DataTypes.INTEGER,
    isPasswordResetNeeded: DataTypes.BOOLEAN,
    password: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    faxNumber: DataTypes.STRING,
    unit: DataTypes.STRING,
    TwoFactorSecret: DataTypes.STRING
  });
  return User;
};
