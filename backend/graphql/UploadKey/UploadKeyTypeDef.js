const { GraphQLObjectType, GraphQLString, GraphQLInt } = require('graphql');

const UploadKeyEventTypeDef = new GraphQLObjectType({
  name: 'UploadKey',
  description: 'UploadKey',
  fields: () => ({
    id: { type: GraphQLInt },
    request_id: { type: GraphQLInt },
    fileKey: { type: GraphQLString },
    comment: { type: GraphQLString },
    createdAt: { type: GraphQLString }
  })
});

module.exports = UploadKeyEventTypeDef;
