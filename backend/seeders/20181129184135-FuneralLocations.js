module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(
      'FuneralLocations',
      [
        {
          name: 'funeral location 1',
          address: '111 CommonStreetName st',
          city: 'Belleville',
          state: 'Illinois',
          gps: '1n 2e',
          county: 'Belleville',
          zip: '11111',
          user_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          notes: 'this is a location'
        }
      ],
      {}
    );
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('FuneralLocations', null, {});
  }
};
