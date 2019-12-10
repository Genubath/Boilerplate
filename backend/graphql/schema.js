const { GraphQLObjectType, GraphQLSchema } = require('graphql');
const {
  currentUser,
  createUser,
  createScheduler,
  updateUser,
  deactivateUser,
  changePassword,
  getUsers
} = require('./User/UserResolver');
const {
  userLocations,
  createLocation,
  editLocation,
  deleteLocation
} = require('./Location/LocationResolver');
const {
  userFuneralHomes,
  createFuneralHome,
  editFuneralHome,
  deleteFuneralHome
} = require('./FuneralHome/FuneralHomeResolver');
const {
  userRequests,
  createRequest,
  editNPBFields,
  editGuardFields,
  getRequests,
  dateFilteredRequests,
  getRequest,
  editRequest,
  respondToRequest,
  completeRequests,
  confirmRequest,
  cancelRequest,
  deleteRequest
} = require('./Request/RequestResolver');

const Schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      currentUser,
      userLocations,
      userRequests,
      getRequests,
      dateFilteredRequests,
      userFuneralHomes,
      getRequest,
      getUsers
    }
  }),
  mutation: new GraphQLObjectType({
    name: 'RootMutation',
    fields: {
      createUser,
      createScheduler,
      updateUser,
      deactivateUser,
      createLocation,
      createRequest,
      editLocation,
      deleteLocation,
      createFuneralHome,
      editFuneralHome,
      deleteFuneralHome,
      editNPBFields,
      editGuardFields,
      changePassword,
      editRequest,
      respondToRequest,
      completeRequests,
      confirmRequest,
      cancelRequest,
      deleteRequest
    }
  })
});

module.exports = Schema;
