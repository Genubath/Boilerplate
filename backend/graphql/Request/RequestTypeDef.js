const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean
} = require('graphql');
const db = require('../../models/index');
const LocationTypeDef = require('../Location/LocationTypeDef');
const RequestEventTypeDef = require('../RequestEvent/RequestEventTypeDef');
const uploadKeyTypeDef = require('../UploadKey/UploadKeyTypeDef');

const { FuneralLocation, RequestEvent, UploadKey } = db;

const RequestTypeDef = new GraphQLObjectType({
  name: 'Request',
  description: 'Individual Mercury User',
  fields: () => ({
    id: {
      type: GraphQLInt
    },
    honorsAddress: { type: GraphQLString },
    honorsCity: { type: GraphQLString },
    honorsState: { type: GraphQLString },
    honorsCounty: { type: GraphQLString },
    honorsZip: { type: GraphQLString },
    honorsGps: { type: GraphQLString },
    locationNotes: { type: GraphQLString },
    requestorFaxNumber: { type: GraphQLString },
    requestorPhoneNumber: { type: GraphQLString },
    requestorEmail: { type: GraphQLString },
    requestorName: { type: GraphQLString },
    relationship: { type: GraphQLString },

    funeralHome_id: { type: GraphQLInt },
    funeralHomeName: { type: GraphQLString },
    funeralHomeZipcode: { type: GraphQLString },
    funeralHomeCounty: { type: GraphQLString },
    funeralHomeState: { type: GraphQLString },
    funeralHomeCity: { type: GraphQLString },
    funeralHomeAddress: { type: GraphQLString },
    deceasedFirstName: { type: GraphQLString },
    deceasedLastName: { type: GraphQLString },
    deceasedSSN: { type: GraphQLString },
    honorsRank: { type: GraphQLString },
    branchOfService: { type: GraphQLString },
    memberStatus: { type: GraphQLString },
    location_id: { type: GraphQLInt },
    requestor_id: { type: GraphQLInt },
    serviceDateTime: { type: GraphQLString },
    serviceTimeZone: { type: GraphQLString },
    serviceType: { type: GraphQLString },
    serviceLocationName: { type: GraphQLString },
    isFlagFamilyProvided: { type: GraphQLBoolean },
    isVSOOrgInvolved: { type: GraphQLBoolean },
    VSODetails: { type: GraphQLString },
    comments: { type: GraphQLString },
    NPBRank: { type: GraphQLString },
    NPBName: { type: GraphQLString },
    NPBPhone: { type: GraphQLString },
    isEligible: { type: GraphQLBoolean },
    flagsPresented: { type: GraphQLInt },
    is1946Complete: { type: GraphQLBoolean },
    isSchedulerCreated: { type: GraphQLBoolean },
    requestType: { type: GraphQLString },
    guardUnit: { type: GraphQLString },
    pocName: { type: GraphQLString },
    pocNumber: { type: GraphQLString },
    location: {
      type: LocationTypeDef,
      name: 'location',
      resolve(parentValues) {
        return FuneralLocation.findByPk(parentValues.dataValues.location_id);
      }
    },
    uploadKeys: {
      type: new GraphQLList(uploadKeyTypeDef),
      name: 'uploadKeys',
      resolve(parentValues) {
        return UploadKey.findAll({
          where: {
            request_id: parentValues.dataValues.id
          }
        });
      }
    },
    requestEvents: {
      type: new GraphQLList(RequestEventTypeDef),
      description: 'Related request events',
      resolve(parent) {
        return RequestEvent.findAll({
          where: {
            request_id: parent.dataValues.id
          },
          order: [['createdAt', 'ASC']]
        });
      }
    },
    affectedRows: { type: GraphQLInt }
  })
});

module.exports = RequestTypeDef;
