const { GraphQLObjectType, GraphQLString, GraphQLInt } = require('graphql');
const db = require('../../models/index');
const UserTypeDef = require('../User/UserTypeDef');

const { User } = db;

const RequestEventTypeDef = new GraphQLObjectType({
  name: 'RequestEvent',
  description: 'Request Event',
  fields: () => ({
    id: { type: GraphQLInt },
    request_id: { type: GraphQLInt },
    creator_id: { type: GraphQLInt },
    creator: {
      type: UserTypeDef,
      name: 'creator',
      resolve(parentValues) {
        return User.findByPk(parentValues.creator_id);
      }
    },
    eventType: { type: GraphQLString },
    comment: { type: GraphQLString },
    createdAt: { type: GraphQLString }
  })
});

module.exports = RequestEventTypeDef;
