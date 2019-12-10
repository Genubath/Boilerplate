const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Request = sequelize.define(
      'Log',
      {
        user_id:Sequelize.INTEGER,
        logType_id: DataTypes.INTEGER,
        message: DataTypes.STRING,
        IP: DataTypes.STRING
      },
      {}
    );
    return Request;
  };
  