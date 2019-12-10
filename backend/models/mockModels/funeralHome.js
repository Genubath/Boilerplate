module.exports = (sequelize) => {
  const FuneralHome = sequelize.define(
    'FuneralHome',
    {
      name: 'testName',
      user_id: 54,
      address: 'testAddress',
      city: 'testCity',
      state: 'testState',
      county: 'testCounty',
      zip: 'testZip'
    },
    {}
  );
  FuneralHome.findByPk = FuneralHome.findById;

  return FuneralHome;
};
