module.exports = (sequelize, DataTypes) => {
  const FuneralHome = sequelize.define(
    'FuneralHome',
    {
      name: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
      address: DataTypes.STRING,
      city: DataTypes.STRING,
      state: DataTypes.STRING,
      county: DataTypes.STRING,
      zip: DataTypes.STRING
    },
    {}
  );
  // FuneralHome.associate = (models) =>{
  //   // associations can be defined here
  // };
  return FuneralHome;
};
