const { GraphQLObjectType, GraphQLString, GraphQLInt } = require('graphql');
// const db = require('../../models/index');

const FuneralHomeTypeDef = new GraphQLObjectType({
  name: 'FuneralHome',
  description: 'Funeral Home',
  fields: () => ({
    name: { type: GraphQLString },
    id: { type: GraphQLInt },
    address: { type: GraphQLString },
    city: { type: GraphQLString },
    state: { type: GraphQLString },
    county: { type: GraphQLString },
    zip: { type: GraphQLString }
  })
});

module.exports = FuneralHomeTypeDef;
