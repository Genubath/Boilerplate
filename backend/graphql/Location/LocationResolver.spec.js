const EasyGraphQLTester = require('easygraphql-tester');
const { expect } = require('chai');
const schema = require('../schema');

describe('Funeral Location Resolver', () => {
  const testFuneralLocation = {
    name: 'testName',
    address: 'testAddress',
    city: 'testCity',
    state: 'testState',
    gps: 'testGps',
    county: 'testCounty',
    zip: 'testZip',
    notes: '',
    user_id: 54,
    id: 1
  };

  const tester = new EasyGraphQLTester(schema);

  describe('Create Funeral Location', () => {
    const mutation = `
      mutation {
        createLocation(
            name: "${testFuneralLocation.name}",
            address: "${testFuneralLocation.address}",
            city: "${testFuneralLocation.city}",
            state: "${testFuneralLocation.state}",
            county: "${testFuneralLocation.county}",
            zip: "${testFuneralLocation.zip}"
            gps: "${testFuneralLocation.gps}",
            notes: "${testFuneralLocation.notes}",
            ){
              id
            }
      }`;

    it('Valid mutation createLocation', async () => {
      const {
        data: { createLocation }
      } = await tester.graphql(mutation, undefined, {
        user: { role_id: 1 }
      });

      expect(createLocation.id).to.equal(3);
    });

    it('Valid mutation createLocation with wrong user role', async () => {
      const { errors } = await tester.graphql(mutation, undefined, {
        user: { role_id: 2 }
      });

      expect(errors[0].message).to.equal(
        'This role cannot create Funeral Locations.'
      );
    });

    it('Invalid mutation createLocation throws error', async () => {
      const wrongType = 999;

      const invalidMutation = `
        mutation {
          createLocation(
              name: "${testFuneralLocation.name}",
              address: "${testFuneralLocation.address}",
              city: "${testFuneralLocation.city}",
              state: "${testFuneralLocation.state}",
              county: "${testFuneralLocation.county}",
              zip: "${testFuneralLocation.zip}"
              gps: "${testFuneralLocation.gps}",
              notes: ${wrongType},
              ){
                id
              }
        }`;

      const { errors } = await tester.graphql(invalidMutation, undefined, {
        user: { role_id: 1 }
      });

      expect(errors[0].message).to.equal(
        `Expected type String, found ${wrongType}.`
      );
    });
  });

  describe('Edit Funeral Location', () => {
    const mutation = `
      mutation {
        editLocation(
            name: "${testFuneralLocation.name}",
            address: "${testFuneralLocation.address}",
            city: "${testFuneralLocation.city}",
            state: "${testFuneralLocation.state}",
            county: "${testFuneralLocation.county}",
            zip: "${testFuneralLocation.zip}"
            gps: "${testFuneralLocation.gps}",
            notes: "${testFuneralLocation.notes}",
            ){
              id
            }
      }`;

    it('Valid mutation editLocation', async () => {
      const {
        data: { editLocation }
      } = await tester.graphql(mutation, undefined, {
        user: { role_id: 1, id: 54 }
      });

      expect(editLocation.id).to.equal(4);
    });

    it('Valid mutation editLocation with wrong user role', async () => {
      const { errors } = await tester.graphql(mutation, undefined, {
        user: { role_id: 2, id: 54 }
      });

      expect(errors[0].message).to.equal(
        'This role cannot edit Funeral Locations.'
      );
    });

    it('Invalid mutation editLocation throws error', async () => {
      const wrongType = 999;

      const invalidMutation = `
        mutation {
            editLocation(
              name: "${testFuneralLocation.name}",
              address: "${testFuneralLocation.address}",
              city: "${testFuneralLocation.city}",
              state: "${testFuneralLocation.state}",
              county: "${testFuneralLocation.county}",
              zip: "${testFuneralLocation.zip}"
              gps: "${testFuneralLocation.gps}",
              notes: ${wrongType},
              ){
                id
              }
        }`;
      const { errors } = await tester.graphql(invalidMutation, undefined, {
        user: { role_id: 1 }
      });

      expect(errors[0].message).to.equal(
        `Expected type String, found ${wrongType}.`
      );
    });
  });

  describe('Delete Funeral Location', () => {
    const mutation = `
    mutation {
        deleteLocation(
          id: ${testFuneralLocation.id},
          ){
            id
          }
    }`;

    it('Valid mutation deleteLocation', async () => {
      const {
        data: { deleteLocation }
      } = await tester.graphql(mutation, undefined, {
        user: { role_id: 1, id: 54 }
      });

      expect(deleteLocation).to.be.null;
    });

    it('Valid mutation deleteLocation with wrong user role', async () => {
      const { errors } = await tester.graphql(mutation, undefined, {
        user: { role_id: 2 }
      });

      expect(errors[0].message).to.equal(
        'This role cannot delete Funeral Locations.'
      );
    });

    it('Invalid mutation deleteLocation throws error', async () => {
      const invalidMutation = `
      mutation {
        deleteLocation(
            id: "${testFuneralLocation.id}",
            ){
              id
            }
      }`;
      const { errors } = await tester.graphql(invalidMutation, undefined, {
        user: { role_id: 1 }
      });

      expect(errors[0].message).to.equal(
        `Expected type Int, found "${testFuneralLocation.id}".`
      );
    });
  });
});
