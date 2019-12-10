const EasyGraphQLTester = require('easygraphql-tester');
const moment = require('moment');
const { expect } = require('chai');
const schema = require('../schema');

describe('Request Resolver', () => {
  const testRequest = {
    id: 54,
    honorsAddress: 'testAddress',
    honorsCity: 'testCity',
    honorsState: 'testState',
    honorsCounty: 'testCounty',
    honorsZip: '12345',
    honorsGps: '',
    locationNotes: 'testNote',
    deceasedFirstName: 'testDecFirst',
    deceasedLastName: 'testDecLast',
    deceasedSSN: '123456789',
    honorsRank: 'testRank',
    branchOfService: 'US Army Air Force',
    memberStatus: 'Veteran',
    funeralHome_id: 54,
    funeralHomeAddress: 'testAddress',
    funeralHomeCity: 'testCity',
    funeralHomeState: 'testState',
    funeralHomeCounty: 'testCounty',
    funeralHomeZipcode: '12345',
    funeralHomeName: 'testName',
    requestor_id: 1,
    requestorName: 'testName',
    requestorEmail: 'testEmail',
    requestorPhoneNumber: '12345647890',
    requestorFaxNumber: '',
    relationship: 'testRelation',
    serviceDateTime: new Date(),
    serviceTimeZone: 'Eastern Time',
    serviceType: 'Memorial',
    serviceLocationName: 'testName',
    isFlagFamilyProvided: true,
    isVSOOrgInvolved: true,
    willSaveLocation: 'false',
    VSODetails: '',
    comments: '',
    uploadKeys: '%5B%5D',
    NPBRank: 'testRank',
    NPBName: 'testName',
    NPBPhone: '1234567890',
    // AD Request Fields
    isEligible: true,
    isPreformingDignifiedArrival: true,
    DignifiedArrivalPreformer: 'testDigPreformer',
    isFamilyAttending: true,
    numberOfFamilyAttending: 3,
    destinationAirport: 'testAirport',
    flightNumber: 'testFlightNum',
    flightDate: new Date(),
    baseRequestingHonors: 'testBaseReq',
    formOfContact: 'testContact',
    MortuaryOfficer: 'testMortOff',
    entitledFlagRecipients: 3,
    flagsPresented: 3,
    hardwoodCasesPresented: 3,
    providingMortuaryOffice: 'testMortOff',
    isCasket: true,
    is1946Complete: true,
    isSchedulerCreated: false,
    guardUnit: 'testGuardUnit',
    pocName: 'testPocName',
    pocNumber: 'testPocNum',
    requestType: 'FUNERAL_DIRECTOR'
  };

  const tester = new EasyGraphQLTester(schema);

  describe('Get User Requests', () => {
    const query = `
    query {
        userRequests {
          id,
          deceasedFirstName,
          deceasedLastName,
          serviceDateTime,
          serviceTimeZone,
          memberStatus,
          honorsAddress,
          honorsCity,
          honorsState,
          honorsCounty,
          honorsZip,
          honorsGps,
          NPBName,
          NPBRank,
          NPBPhone,
          guardUnit,
          pocName,
          pocNumber,
          requestEvents {
            id,
            createdAt,
            eventType,
            comment,
            creator{
              firstName,
              lastName,
              rank
            }
          }
        }
      }`;

    it('Valid query userRequests', async () => {
      const {
        data: { userRequests }
      } = await tester.graphql(query, undefined, {
        user: { role_id: 1, id: 1 }
      });
      expect(userRequests[0].deceasedFirstName).to.equal(
        testRequest.deceasedFirstName
      );
      expect(userRequests[0].deceasedLastName).to.equal(
        testRequest.deceasedLastName
      );
    });

    it('Valid query userRequests wrong role', async () => {
      const { errors } = await tester.graphql(query, undefined, {
        user: { role_id: 2, id: 1 }
      });

      expect(errors[0].message).to.equal('This role does not have requests.');
    });
  });

  describe('Get Request', () => {
    const query = `
      query {
        getRequest (
            id: ${testRequest.id}
            )
          {
            id, 
            honorsAddress,
            honorsCity,
            honorsState,
            honorsCounty,
            honorsZip,
            honorsGps,
            deceasedFirstName,
            deceasedLastName,
            deceasedSSN, 
            honorsRank,
            branchOfService,
            memberStatus, 
            location_id,
            requestor_id,
            serviceDateTime,
            serviceTimeZone,
            serviceType,
            serviceLocationName,
            isFlagFamilyProvided,
            isVSOOrgInvolved,
            VSODetails,
            comments,   
            locationNotes,
            requestorFaxNumber,
            requestorPhoneNumber,
            requestorEmail,
            requestorName,
            relationship,
            funeralHome_id,
            funeralHomeName,
            funeralHomeZipcode,
            funeralHomeCounty,
            funeralHomeState,
            funeralHomeCity,
            funeralHomeAddress,
            isEligible,
            flagsPresented,
            is1946Complete,
            isSchedulerCreated,
            guardUnit,
            pocName,
            pocNumber,
            uploadKeys{
              fileKey,
              id
            },
            location {
              name,
              address,
              city,
              state,
              county,
              zip,
              notes,
              gps
            },
            requestEvents {
              id
              request_id,
              creator_id,
              eventType,
              comment,
              createdAt
            }
          }
      }`;

    it('Valid query getRequest', async () => {
      const {
        data: { getRequest }
      } = await tester.graphql(query, undefined, {
        user: { role_id: 1, id: 1 }
      });

      expect(getRequest.requestor_id).to.equal(testRequest.requestor_id);
      expect(getRequest.isSchedulerCreated).to.equal(
        testRequest.isSchedulerCreated
      );
    });

    it('Valid query getRequest wrong role', async () => {
      const { errors } = await tester.graphql(query, undefined, {
        user: { role_id: 4, id: 1 }
      });

      expect(errors[0].message).to.equal('This role cannot view requests.');
    });

    it('Valid query getRequest funeral director only gets own requests', async () => {
      const { errors } = await tester.graphql(query, undefined, {
        user: { role_id: 1, id: 3 }
      });

      expect(errors[0].message).to.equal('User cannot access this request');
    });

    it('Invalid query getRequest', async () => {
      const invalidQuery = `
      query {
        getRequest (
            id: "${testRequest.id}"
            )
          {
            id
          }
      }`;

      const { errors } = await tester.graphql(invalidQuery, undefined, {
        user: { role_id: 1, id: 1 }
      });

      expect(errors[0].message).to.equal(
        `Expected type Int, found "${testRequest.id}".`
      );
    });
  });

  describe('Get Requests', () => {
    const query = `
    query {
      getRequests(
        isUpcoming: ${true}
      ) {
        id,
        deceasedFirstName,
        deceasedLastName,
        serviceDateTime,
        serviceTimeZone,
        NPBName,
        NPBRank,
        NPBPhone,
        memberStatus,
        honorsCity,
        honorsState,
        serviceLocationName,
        isSchedulerCreated,
        requestEvents {
          id,
          createdAt,
          eventType,
          comment,
          creator{
            firstName,
            lastName,
            rank
          }
        }
      }
    }`;

    it('Valid query getRequests', async () => {
      const {
        data: { getRequests }
      } = await tester.graphql(query, undefined, {
        user: { role_id: 2, id: 1 }
      });

      expect(getRequests[0].id).to.equal(testRequest.id);
    });

    it('Valid query getRequests wrong role', async () => {
      const { errors } = await tester.graphql(query, undefined, {
        user: { role_id: 1, id: 1 }
      });

      expect(errors[0].message).to.equal(
        'This role does not have permission to view all requests.'
      );
    });
  });

  describe('Create Request', () => {
    const mutation = `
      mutation {
        createRequest(
            honorsAddress: "${testRequest.honorsAddress}",
            honorsCity: "${testRequest.honorsCity}",
            honorsState: "${testRequest.honorsState}",
            honorsCounty: "${testRequest.honorsCounty}",
            honorsZip: "${testRequest.honorsZip}",
            honorsGps: "${testRequest.honorsGps}",
            locationNotes: "${testRequest.locationNotes}",
            requestorFaxNumber: "${testRequest.requestorFaxNumber}",
            requestorPhoneNumber: "${testRequest.requestorPhoneNumber}",
            requestorEmail: "${testRequest.requestorEmail}",
            requestorName: "${testRequest.requestorName}",
            relationship: "${testRequest.relationship}",
            funeralHomeName: "${testRequest.funeralHomeName}",
            funeralHomeZipcode: "${testRequest.funeralHomeZipcode}",
            funeralHomeCounty: "${testRequest.funeralHomeCounty}",
            funeralHomeState: "${testRequest.funeralHomeState}",
            funeralHomeCity: "${testRequest.funeralHomeCity}",
            funeralHomeAddress: "${testRequest.funeralHomeAddress}",
            deceasedFirstName: "${testRequest.deceasedFirstName}",
            deceasedLastName: "${testRequest.deceasedLastName}",
            deceasedSSN: "${testRequest.deceasedSSN}",
            honorsRank: "${testRequest.honorsRank}",
            branchOfService: "${testRequest.branchOfService}",
            memberStatus: "${testRequest.memberStatus}",
            funeralHome_id: ${testRequest.funeralHome_id},
            serviceDateTime: "${testRequest.serviceDateTime}",
            serviceTimeZone: "${testRequest.serviceTimeZone}",
            serviceLocationName: "${testRequest.serviceLocationName}",
            serviceType: "${testRequest.serviceType}",
            isFlagFamilyProvided: "${testRequest.isFlagFamilyProvided}",
            isVSOOrgInvolved: "${testRequest.isVSOOrgInvolved}",
            VSODetails: "${testRequest.VSODetails}",
            comments: "${testRequest.comments}",
            uploadKeys: "${testRequest.uploadKeys}",
            isEligible: ${testRequest.isEligible},
            flagsPresented: ${testRequest.flagsPresented},
            is1946Complete: ${testRequest.is1946Complete},
            requestType: "${testRequest.requestType}"
            ){
              id
            }
      }`;

    it('Valid mutation createRequest', async () => {
      const {
        data: { createRequest }
      } = await tester.graphql(mutation, undefined, {
        user: { role_id: 1, id: 1 }
      });
      console.log(createRequest)
      expect(createRequest.id).to.equal(testRequest.id);
    });
  });

  describe('Edit Request', () => {
    const mutation = `
      mutation {
        editRequest(
            id: ${testRequest.id},
            honorsAddress: "${testRequest.honorsAddress}",
            honorsCity: "${testRequest.honorsCity}",
            honorsState: "${testRequest.honorsState}",
            honorsCounty: "${testRequest.honorsCounty}",
            honorsZip: "${testRequest.honorsZip}",
            honorsGps: "${testRequest.honorsGps}",
            locationNotes: "${testRequest.locationNotes}",
            requestorFaxNumber: "${testRequest.requestorFaxNumber}",
            requestorPhoneNumber: "${testRequest.requestorPhoneNumber}",
            requestorEmail: "${testRequest.requestorEmail}",
            requestorName: "${testRequest.requestorName}",
            relationship: "${testRequest.relationship}",
            funeralHomeName: "${testRequest.funeralHomeName}",
            funeralHomeZipcode: "${testRequest.funeralHomeZipcode}",
            funeralHomeCounty: "${testRequest.funeralHomeCounty}",
            funeralHomeState: "${testRequest.funeralHomeState}",
            funeralHomeCity: "${testRequest.funeralHomeCity}",
            funeralHomeAddress: "${testRequest.funeralHomeAddress}",
            deceasedFirstName: "${testRequest.deceasedFirstName}",
            deceasedLastName: "${testRequest.deceasedLastName}",
            deceasedSSN: "${testRequest.deceasedSSN}",
            honorsRank: "${testRequest.honorsRank}",
            branchOfService: "${testRequest.branchOfService}",
            memberStatus: "${testRequest.memberStatus}",
            funeralHome_id: ${testRequest.funeralHome_id},
            serviceDateTime: "${testRequest.serviceDateTime}",
            serviceTimeZone: "${testRequest.serviceTimeZone}",
            serviceLocationName: "${testRequest.serviceLocationName}",
            serviceType: "${testRequest.serviceType}",
            isFlagFamilyProvided: "${testRequest.isFlagFamilyProvided}",
            isVSOOrgInvolved: "${testRequest.isVSOOrgInvolved}",
            VSODetails: "${testRequest.VSODetails}",
            uploadKeys: "${testRequest.uploadKeys}",
            comments: "${testRequest.comments}",
            isEligible: ${testRequest.isEligible},
            flagsPresented: ${testRequest.flagsPresented},
            is1946Complete: ${testRequest.is1946Complete}
            ){
              id
            }
      }`;

    it('Valid mutation editRequest', async () => {
      const {
        data: { editRequest }
      } = await tester.graphql(mutation, undefined, {
        user: { role_id: 1, id: 1 }
      });
console.log(editRequest)
      expect(editRequest.id).to.equal(54);
    });

    it('Valid mutation editRequest wrong user', async () => {
      const { errors } = await tester.graphql(mutation, undefined, {
        user: { role_id: 1, id: 2 }
      });

      expect(errors[0].message).to.equal(
        'Users can only edit their own requests.'
      );
    });

    it('Valid mutation editRequest wrong role', async () => {
      const { errors } = await tester.graphql(mutation, undefined, {
        user: { role_id: 2, id: 1 }
      });

      expect(errors[0].message).to.equal(
        'NCOs/SCH cannot edit FD made requests'
      );
    });
  });

  describe('Date Filtered Requests', () => {
    const queryInput = {
      startDate: moment()
        .startOf('day')
        .toDate(),
      endDate: moment()
        .add(15, 'days')
        .startOf('day')
        .toDate(),
      searchText: {
        first: testRequest.deceasedFirstName,
        last: testRequest.deceasedLastName
      },
      isArchiveSearch: false
    };

    const query = `
    query {
      dateFilteredRequests (
        startDate: "${queryInput.startDate}",
        endDate: "${queryInput.endDate}",
        searchText: "",
        isArchiveSearch: ${queryInput.isArchiveSearch}
        ) { 
          id
          }
        }`;

    it('Valid date query', async () => {
      const {
        data: { dateFilteredRequests }
      } = await tester.graphql(query, undefined, {
        user: { role_id: 2, id: 1 }
      });

      expect(dateFilteredRequests[0].id).to.equal(testRequest.id);
    });

    it('Valid search by first name', async () => {
      const searchQuery = `
      query {
        dateFilteredRequests (
          startDate: "",
          endDate: "",
          searchText: "${queryInput.searchText.first}",
          isArchiveSearch: ${true}
          ) { 
            id
            }
          }`;

      const {
        data: { dateFilteredRequests }
      } = await tester.graphql(searchQuery, undefined, {
        user: { role_id: 2, id: 1 }
      });

      expect(dateFilteredRequests[0].id).to.equal(testRequest.id);
    });

    it('Valid search by last name', async () => {
      const searchQuery = `
      query {
        dateFilteredRequests (
          startDate: "",
          endDate: "",
          searchText: "${queryInput.searchText.last}",
          isArchiveSearch: ${true}
          ) { 
            id
            }
          }`;

      const {
        data: { dateFilteredRequests }
      } = await tester.graphql(searchQuery, undefined, {
        user: { role_id: 2, id: 1 }
      });

      expect(dateFilteredRequests[0].id).to.equal(testRequest.id);
    });

    it('Valid query, wrong role errors', async () => {
      const { errors } = await tester.graphql(query, undefined, {
        user: { role_id: 1, id: 1 }
      });

      expect(errors[0].message).to.equal(
        'This role does not have permission to view all requests.'
      );
    });
  });

  describe('Edit NPB Fields', () => {
    const mutation = `
      mutation {
        editNPBFields(
            NPBName: "${testRequest.NPBName}",
            NPBPhone: "${testRequest.NPBPhone}",
            NPBRank: "${testRequest.NPBRank}"
            ){
              affectedRows
            }
      }`;

    it('Valid mutation editNPBFields', async () => {
      const {
        data: { editNPBFields }
      } = await tester.graphql(mutation, undefined, {
        user: { role_id: 2, id: 1 }
      });

      expect(editNPBFields.affectedRows).to.equal(1);
    });

    it('Valid mutation editNPBFields wrong role', async () => {
      const { errors } = await tester.graphql(mutation, undefined, {
        user: { role_id: 1, id: 2 }
      });

      expect(errors[0].message).to.equal('This role cannot edit NPB info.');
    });
  });

  describe('Edit Guard Fields', () => {
    const mutation = `
      mutation {
        editGuardFields(
            guardUnit: "${testRequest.guardUnit}",
            pocName: "${testRequest.pocName}",
            pocNumber: "${testRequest.pocNumber}"
            ){
              affectedRows
            }
      }`;

    it('Valid mutation editGuardFields', async () => {
      const {
        data: { editGuardFields }
      } = await tester.graphql(mutation, undefined, {
        user: { role_id: 2, id: 1 }
      });

      expect(editGuardFields.affectedRows).to.equal(1);
    });

    it('Valid mutation editGuardFields wrong role', async () => {
      const { errors } = await tester.graphql(mutation, undefined, {
        user: { role_id: 1, id: 2 }
      });

      expect(errors[0].message).to.equal('This role cannot edit Guard info.');
    });
  });

  describe('Confirm Request', () => {
    const mutation = `
    mutation {
      confirmRequest(
          action: "${'Notice'}",
          isEligible: ${testRequest.isEligible},
          flagsPresented: ${testRequest.flagsPresented},
          is1946Complete: ${testRequest.is1946Complete},
          comment: "${testRequest.comments}"
          ){
            affectedRows
          }
    }`;

    it('Valid mutation confirmRequest', async () => {
      const {
        data: { confirmRequest }
      } = await tester.graphql(mutation, undefined, {
        user: { role_id: 2, id: 1 }
      });

      expect(confirmRequest.affectedRows).to.equal(1);
    });

    it('Valid mutation editGuardFields wrong role', async () => {
      const { errors } = await tester.graphql(mutation, undefined, {
        user: { role_id: 1, id: 2 }
      });

      expect(errors[0].message).to.equal('This role cannot confirm requests.');
    });
  });
});
