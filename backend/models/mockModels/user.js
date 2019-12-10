module.exports = (sequelize) => {
  const User = sequelize.define(
    'User',
    {
      id: 10,
      rank: 5,
      presetFuneralHomeId: 1,
      presetLocationId: 1,
      role_id: 1,
      isActive: true,
      password: 'password',
      unit: 'G Unit',
      email: 'test@test.com',
      firstName: 'John',
      lastName: 'Smith',
      funeralName: 'Jefferson Barracks',
      phoneNumber: '(757)666-7777',
      faxNumber: '7777777',
      address: '123 Funeral Road',
      city: 'Scott AFB',
      state: 'Illinois',
      county: 'County',
      zipCode: '12345'
    },
    {}
  );
  User.findByPk = User.findById;

  return User;
};
