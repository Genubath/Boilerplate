const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const UploadKey = sequelize.define(
    'UploadKey',
    {
      request_id: Sequelize.INTEGER,
      fileKey: DataTypes.STRING
    },
    {}
  );
  return UploadKey;
};
