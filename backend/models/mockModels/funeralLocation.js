module.exports = (sequelize) => {
  const FuneralLocation = sequelize.define(
    'FuneralLocation',
    {
      name: 'testName',
      address: 'testAddress',
      city: 'testCity',
      state: 'testState',
      gps: 'testGps',
      county: 'testCounty',
      zip: 'testZip',
      note: '',
      user_id: 54
    },
    {}
  );
  FuneralLocation.findByPk = FuneralLocation.findById;
  return FuneralLocation;
};
