const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const VerificationToken = sequelize.define(
    'VerificationToken',
    {
      user_id: Sequelize.INTEGER,
      token: DataTypes.STRING
    },
    {}
  );
  return VerificationToken;
};
