const { GraphQLString, GraphQLList, GraphQLInt } = require('graphql');
const db = require('../../models/index');
const LocationTypeDef = require('./LocationTypeDef');

const { FuneralLocation } = db;

// Query definition
const userLocations = {
  type: new GraphQLList(LocationTypeDef),
  name: 'userLocations',
  resolve: (req, res, context) => {
    if (context.user.role_id !== 1) {
      throw new Error('This role does not have Funeral Locations.');
    }
    return FuneralLocation.findAll({
      where: {
        user_id: context.user.id
      }
    }).then((list) => {
      return list.sort((a, b) => {
        return b.id === context.user.presetLocationId;
      });
    });
  }
};

// Mutation definition
const createLocation = {
  type: LocationTypeDef,
  name: 'createLocation',
  args: {
    name: { type: GraphQLString },
    address: { type: GraphQLString },
    city: { type: GraphQLString },
    state: { type: GraphQLString },
    county: { type: GraphQLString },
    zip: { type: GraphQLString },
    notes: { type: GraphQLString },
    gps: { type: GraphQLString }
  },
  resolve: (parentValues, args, context) => {
    if (context.user.role_id !== 1) {
      throw new Error('This role cannot create Funeral Locations.');
    }
    return FuneralLocation.build({
      ...args,
      user_id: context.user.id
    })
      .save()
      .then((retLoc) => {
        return {
          ...retLoc.dataValues
        };
      });
  }
};

const editLocation = {
  type: LocationTypeDef,
  name: 'editLocation',
  args: {
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    address: { type: GraphQLString },
    city: { type: GraphQLString },
    state: { type: GraphQLString },
    county: { type: GraphQLString },
    notes: { type: GraphQLString },
    zip: { type: GraphQLString },
    gps: { type: GraphQLString }
  },
  resolve: (parentValues, args, context) => {
    if (context.user.role_id !== 1) {
      throw new Error('This role cannot edit Funeral Locations.');
    }
    return FuneralLocation.findByPk(args.id).then((location) => {
      if (context.user.id !== location.user_id) {
        throw new Error('Users can only edit their own locations.');
      }
      return location
        .update({
          ...args
        })
        .then((retLoc) => {
          return {
            ...retLoc.dataValues
          };
        });
    });
  }
};

const deleteLocation = {
  type: LocationTypeDef,
  name: 'deleteLocation',
  args: {
    id: { type: GraphQLInt }
  },
  resolve: (parentValues, args, context) => {
    if (context.user.role_id !== 1) {
      throw new Error('This role cannot delete Funeral Locations.');
    }
    return FuneralLocation.findByPk(args.id).then((location) => {
      if (context.user.id !== location.user_id) {
        throw new Error('Users can only delete their own locations.');
      }
      return location.destroy().then((res) => {
        return {
          id: res.dataValues.id
        };
      });
    });
  }
};

module.exports = {
  userLocations,
  createLocation,
  editLocation,
  deleteLocation
};
