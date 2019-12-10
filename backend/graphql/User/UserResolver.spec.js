const EasyGraphQLTester = require('easygraphql-tester');
const { expect } = require('chai');
// const bcrypt = require('bcryptjs');
const schema = require('../schema');

describe('User Resolver', () => {
  const testUser = {
    id: 10,
    rank: 5,
    role_id: 1,
    presetFuneralHomeId: 1,
    presetLocationId: 1,
    isActive: true,
    password: 'password',
    unit: 'G Unit',
    email: 'test@test.com',
    firstName: 'John',
    lastName: 'Smith',
    funeralName: 'Jefferson Barracks',
    phoneNumber: '(757)666-7777',
    faxNumber: '(777)777-7777',
    address: '123 Funeral Road',
    city: 'Scott AFB',
    state: 'Illinois',
    county: 'County',
    zipCode: '12345'
  };

  const tester = new EasyGraphQLTester(schema);

  describe('create user', () => {
    const mutation = `
        mutation {
            createUser (
                funeralName: "${testUser.funeralName}",
                email: "${testUser.email}",
                firstName: "${testUser.firstName}",
                lastName: "${testUser.lastName}",
                phoneNumber: "${testUser.phoneNumber}",
                faxNumber: "${testUser.faxNumber}",
                password: "${testUser.password}" , 
                address: "${testUser.address}" ,
                city: "${testUser.city}" ,
                state: "${testUser.state}" ,
                county: "${testUser.county}" ,
                zipCode: "${testUser.zipCode}" 
            ){
                id
            }
        }`;

    it('Valid mutation createUser', async () => {
      const {
        data: { createUser }
      } = await tester.graphql(mutation, undefined);

      expect(createUser.id).to.equal(1);
    });
  });

  describe('create scheduler', () => {
    const mutation = `
        mutation {
            createScheduler (
                rank: "${testUser.rank}",
                firstName: "${testUser.firstName}",
                lastName: "${testUser.lastName}",
                email: "${testUser.email}",
                phoneNumber: "${testUser.phoneNumber}",
                unit: "${testUser.unit}"
            ){
                id
            }
        }`;

    it('Valid mutation createScheduler', async () => {
      const {
        data: { createScheduler }
      } = await tester.graphql(mutation, undefined, {
        user: { role_id: 3 }
      });

      expect(createScheduler.id).to.equal(10);
    });

    it('Invalid mutation createScheduler wrong role', async () => {
      const { errors } = await tester.graphql(mutation, undefined, {
        user: { role_id: 1 }
      });

      expect(errors[0].message).to.equal(
        'This role does not have permission to view schedulers.'
      );
    });
  });

  describe('get current user', () => {
    const query = `
        query {
            currentUser {
                    role_id,
                    rank,
                    unit,
                    email,
                    firstName,
                    lastName,
                    faxNumber,
                    phoneNumber,
                    presetFuneralHomeId,
                    presetLocationId,
                    funeralHomes {
                    name,
                    id,
                    address,
                    city,
                    state,
                    county,
                    zip
                    },
                    funeralLocations {
                    name,
                    address,
                    city,
                    state,
                    gps,
                    county,
                    zip,
                    notes,
                    id
                    }
                }
            }`;

    it('Valid mutation createUser', async () => {
      const {
        data: { currentUser }
      } = await tester.graphql(query, undefined, {
        user: { id: 1 }
      });

      expect(currentUser.email).to.equal(testUser.email);
    });
  });

  describe('update user', () => {
    const updatedEmail = 'test@pass.com';

    const mutation = `
        mutation {
            updateUser (
                email: "${updatedEmail}",
                firstName: "${testUser.firstName}",
                lastName: "${testUser.lastName}",
                faxNumber: "${testUser.faxNumber}",
                phoneNumber: "${testUser.phoneNumber}",
                unit: "${testUser.unit}",
                rank: "${testUser.rank}",
                presetFuneralHomeId: ${testUser.presetFuneralHomeId},
                presetLocationId: ${testUser.presetLocationId}
              ){
                id,
                email
              }
            }`;

    it('Valid mutation updateUser', async () => {
      const {
        data: { updateUser }
      } = await tester.graphql(mutation, undefined, {
        user: { id: 10 }
      });

      expect(updateUser.id).to.equal(10);
      // expect(updateUser.email).to.equal(updatedEmail);
    });
  });

  describe('get users', () => {
    const query = `
        query {
            getUsers {
                id,
                rank,
                role_id,
                unit,
                email,
                firstName,
                lastName,
                phoneNumber,
                presetFuneralHomeId,
                createdAt,
                isActive,
                funeralHomes {
                  id,
                  name
                }
              }
            }`;

    it('Valid mutation getUsers', async () => {
      const {
        data: { getUsers }
      } = await tester.graphql(query, undefined, {
        user: { role_id: 3 }
      });

      expect(getUsers.length).to.equal(1);
      expect(getUsers[0].isActive).to.be.true;
    });

    it('Invalid mutation getUsers wrong role', async () => {
      const { errors } = await tester.graphql(query, undefined, {
        user: { role_id: 2 }
      });

      expect(errors[0].message).to.equal(
        'This role does not have permission to view schedulers.'
      );
    });
  });

  describe('deactivate user', () => {
    const mutation = `
        mutation {
            deactivateUser (
                id: ${testUser.id}
              ){
                id,
                isActive
              }
            }`;

    it('Valid mutation deactivateUser', async () => {
      const {
        data: { deactivateUser }
      } = await tester.graphql(mutation, undefined, {
        user: { role_id: 3 }
      });

      expect(deactivateUser.id).to.equal(testUser.id);
      // expect(deactivateUser.isActive).to.be.false;
    });

    it('Invalid mutation deactivateUser wrong role', async () => {
      const { errors } = await tester.graphql(mutation, undefined, {
        user: { role_id: 2 }
      });

      expect(errors[0].message).to.equal(
        'This role does not have permission to deactivate users.'
      );
    });
  });

  describe('change password', () => {
    const passwordData = {
      oldPassword: testUser.password,
      newPassword: 'newpassword',
      confirmPassword: 'newpassword'
    };

    // const mutation = `
    //     mutation {
    //         changePassword (
    //             oldPassword: "${passwordData.oldPassword}",
    //             newPassword: "${passwordData.newPassword}",
    //             confirmPassword: "${passwordData.confirmPassword}"
    //         ){
    //             id,
    //             password
    //         }
    //     }`;

    const badMutation = `
        mutation {
            changePassword (
                oldPassword: "wrongpassword",
                newPassword: "${passwordData.newPassword}",
                confirmPassword: "${passwordData.confirmPassword}"
            ){
                id,
                password
            }
        }`;

    const badderMutation = `
        mutation {
            changePassword (
                oldPassword: "${passwordData.oldPassword}",
                newPassword: "${passwordData.newPassword}",
                confirmPassword: "wrongconfirmpassword"
            ){
                id,
                password
            }
        }`;

    // it('Valid change password', async () => {
    //   const {
    //     data: { changePassword }
    //   } = await tester.graphql(mutation, undefined, { user: { id: 10 } });

    //   console.log(changePassword, 'WHAT IS THIS?');
    //   //   expect(changePassword.id).to.equal(10);

    //   //   expect(
    //   //     bcrypt.compareSync(passwordData.newPassword, changePassword.password)
    //   //   ).to.be.true;
    // });

    it('Invalid change password wrong current password', async () => {
      const { errors } = await tester.graphql(badMutation, undefined, {
        user: { id: 10 }
      });

      expect(errors[0].message).to.equal(
        'The entered current password was incorrect'
      );
    });

    it('Invalid change password new and confirm passwords do not match', async () => {
      const { errors } = await tester.graphql(badderMutation, undefined, {
        user: { id: 10 }
      });

      expect(errors[0].message).to.equal(
        'New password and confirmation do not match'
      );
    });
  });
});
