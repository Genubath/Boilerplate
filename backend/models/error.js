const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Request = sequelize.define(
      'Error',
      {
        user_id:Sequelize.INTEGER,
        errorType_id: DataTypes.INTEGER,
        message: DataTypes.STRING,  
        IP: DataTypes.STRING
      },
      {}
    );
    return Request;
  };
  