module.exports = (sequelize, DataTypes) => {
  const Uploads = sequelize.define(
    'Uploads',
    {
      request_id: DataTypes.INTEGER
    },
    {}
  );
  // Uploads.associate = (models) => {
  //   // associations can be defined here
  // };
  return Uploads;
};
