module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(
      'FuneralHomes',
      [
        {
          name: 'funeral home 1',
          user_id: 1,
          address: '123 Street Rd',
          city: 'Shilo',
          state: 'Illinois',
          county: 'thisOne',
          zip: '11111',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'funeral home 2',
          user_id: 1,
          address: '1820 N. Elm St',
          city: 'Shilo',
          state: 'Missouri',
          county: 'thatOne',
          zip: '22222',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'funeral home 3',
          user_id: 2,
          address: '840 River Rd',
          city: 'Chicago',
          state: 'Illinois',
          county: 'newOne',
          zip: '33333',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('FuneralHomes', null, {});
  }
};
