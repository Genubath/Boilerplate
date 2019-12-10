const { GraphQLObjectType, GraphQLString, GraphQLInt } = require('graphql');

const LocationTypeDef = new GraphQLObjectType({
  name: 'Location',
  description: 'Funeral Location',
  fields: () => ({
    id: {
      type: GraphQLInt
    },
    name: { type: GraphQLString },
    address: { type: GraphQLString },
    city: { type: GraphQLString },
    state: { type: GraphQLString },
    county: { type: GraphQLString },
    zip: { type: GraphQLString },
    notes: { type: GraphQLString },
    gps: { type: GraphQLString }
  })
});

module.exports = LocationTypeDef;
