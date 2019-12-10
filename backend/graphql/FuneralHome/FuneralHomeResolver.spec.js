const EasyGraphQLTester = require('easygraphql-tester');
const { expect } = require('chai');
const db = require('../../models/index');
const schema = require('../schema');

const { FuneralHome } = db;

describe('Funeral Home Resolver', () => {
  const testFuneralHome = {
    id: 1,
    name: 'testName',
    address: 'testAddress',
    city: 'testCity',
    state: 'testState',
    county: 'testCounty',
    zip: 'testZip'
  };

  const tester = new EasyGraphQLTester(schema);

  describe('Create Funeral Home', () => {
    const mutation = `
            mutation {
              createFuneralHome(
                name: "${testFuneralHome.name}",
                address: "${testFuneralHome.address}",
                city: "${testFuneralHome.city}",
                state: "${testFuneralHome.state}",
                county: "${testFuneralHome.county}",
                zip: "${testFuneralHome.zip}"
                ){
                  id
                }
            }`;

    it('Valid mutation createFuneralHome', async () => {
      const {
        data: { createFuneralHome }
      } = await tester.graphql(mutation, undefined, {
        user: { role_id: 1 }
      });

      expect(createFuneralHome.id).to.equal(1);
    });

    it('Valid mutation createFuneralHome with wrong user role', async () => {
      const { errors } = await tester.graphql(mutation, undefined, {
        user: { role_id: 2 }
      });

      expect(errors[0].message).to.equal(
        'This role cannot create Funeral Homes.'
      );
    });

    it('Invalid mutation createFuneralHome throws error', async () => {
      const wrongType = 999;

      const invalidMutation = `
            mutation {
                createFuneralHome(
                    name: "${testFuneralHome.name}",
                    address: "${testFuneralHome.address}",
                    city: "${testFuneralHome.city}",
                    state: "${testFuneralHome.state}",
                    county: "${testFuneralHome.county}",
                    zip: ${wrongType}
                ) {
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

  describe('Edit Funeral Home', () => {
    const mutation = `
      mutation {
        editFuneralHome(
          name: "${testFuneralHome.name}",
          id:  ${testFuneralHome.id},
          address: "${testFuneralHome.address}",
          city: "${testFuneralHome.city}",
          state: "${testFuneralHome.state}",
          county: "${testFuneralHome.county}",
          zip: "${testFuneralHome.zip}"
          ){
            id
          }
      }`;

    it('Valid mutation editFuneralHome', async () => {
      const {
        data: { editFuneralHome }
      } = await tester.graphql(mutation, undefined, {
        user: { role_id: 1, id: 54 }
      });

      expect(editFuneralHome.id).to.equal(1);
    });

    it('Valid mutation editFuneralHome with wrong user role', async () => {
      const { errors } = await tester.graphql(mutation, undefined, {
        user: { role_id: 2, id: 54 }
      });

      expect(errors[0].message).to.equal(
        'This role cannot edit Funeral Homes.'
      );
    });

    it('Valid mutation editFuneralHome with wrong user id', async () => {
      const { errors } = await tester.graphql(mutation, undefined, {
        user: { role_id: 1, id: 53 }
      });

      expect(errors[0].message).to.equal(
        'Users can only edit their own Funeral Homes.'
      );
    });

    it('Invalid mutation editFuneralHome throws error', async () => {
      const wrongType = 999;

      const invalidMutation = `
            mutation {
                createFuneralHome(
                    name: "${testFuneralHome.name}",
                    address: "${testFuneralHome.address}",
                    city: "${testFuneralHome.city}",
                    state: "${testFuneralHome.state}",
                    county: "${testFuneralHome.county}",
                    zip: ${wrongType}
                ) {
                    id
                }
            }`;

      const { errors } = await tester.graphql(invalidMutation, undefined, {
        user: { role_id: 1, id: 54 }
      });

      expect(errors[0].message).to.equal(
        `Expected type String, found ${wrongType}.`
      );
    });
  });

  describe('Delete Funeral Home', () => {
    const mutation = `
      mutation {
        deleteFuneralHome(
          id:  ${testFuneralHome.id},
          ){
            id
          }
      }`;

    it('Valid mutation deleteFuneralHome', async () => {
      FuneralHome.$queueResult([
        FuneralHome.build({ id: 1 }),
        FuneralHome.build({ id: 2 })
      ]);

      const {
        data: { deleteFuneralHome }
      } = await tester.graphql(mutation, undefined, {
        user: { role_id: 1, id: 54 }
      });

      expect(deleteFuneralHome.id).to.equal(testFuneralHome.id);
    });

    it('Invalid mutation deleteFuneralHome throws error', async () => {
      const invalidMutation = `
      mutation {
        deleteFuneralHome(
          id:  "${testFuneralHome.id}",
          ){
            id
          }
        }`;

      const { errors } = await tester.graphql(invalidMutation, undefined, {
        user: { role_id: 1, id: 54 }
      });

      expect(errors[0].message).to.equal(
        `Expected type Int, found "${testFuneralHome.id}".`
      );
    });

    it('Valid mutation deleteFuneralHome with wrong user role', async () => {
      const { errors } = await tester.graphql(mutation, undefined, {
        user: { role_id: 2, id: 54 }
      });

      expect(errors[0].message).to.equal(
        'This role cannot delete Funeral Homes.'
      );
    });

    it('Valid mutation deleteFuneralHome not last funeral home', async () => {
      const {
        data: { deleteFuneralHome }
      } = await tester.graphql(mutation, undefined, {
        user: { role_id: 1, id: 54 }
      });

      expect(deleteFuneralHome).to.be.null;
    });
  });
});
