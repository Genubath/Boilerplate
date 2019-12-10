const { GraphQLString, GraphQLList, GraphQLInt } = require('graphql');
const db = require('../../models/index');
const FuneralHomeTypeDef = require('./FuneralHomeTypeDef');

const { FuneralHome } = db;

// Query definition
const userFuneralHomes = {
  type: new GraphQLList(FuneralHomeTypeDef),
  name: 'userFuneralHomes',
  resolve: (req, res, context) => {
    if (context.user.role_id !== 1) {
      throw new Error('This role does not have Funeral Homes.');
    }
    return FuneralHome.findAll({
      where: {
        user_id: context.user.id
      }
    }).then((list) => {
      return list.sort((a, b) => {
        return b.id === context.user.presetFuneralHomeId;
      });
    });
  }
};

// Mutation definition
const createFuneralHome = {
  type: FuneralHomeTypeDef,
  name: 'createFuneralHome',
  args: {
    name: { type: GraphQLString },
    id: { type: GraphQLInt },
    address: { type: GraphQLString },
    city: { type: GraphQLString },
    state: { type: GraphQLString },
    county: { type: GraphQLString },
    zip: { type: GraphQLString }
  },
  resolve: (parentValues, args, context) => {
    if (context.user.role_id !== 1) {
      throw new Error('This role cannot create Funeral Homes.');
    }
    return FuneralHome.build({
      ...args,
      user_id: context.user.id
    })
      .save()
      .then((retHome) => {
        return {
          id: retHome.dataValues.id
        };
      })
      .catch((err) => {
        return err;
      });
  }
};

const editFuneralHome = {
  type: FuneralHomeTypeDef,
  name: 'editFuneralHome',
  args: {
    name: { type: GraphQLString },
    id: { type: GraphQLInt },
    address: { type: GraphQLString },
    city: { type: GraphQLString },
    state: { type: GraphQLString },
    county: { type: GraphQLString },
    zip: { type: GraphQLString }
  },
  resolve: (parentValues, args, context) => {
    if (context.user.role_id !== 1) {
      throw new Error('This role cannot edit Funeral Homes.');
    }
    return FuneralHome.findByPk(args.id).then((funeralHome) => {
      if (context.user.id !== funeralHome.user_id) {
        throw new Error('Users can only edit their own Funeral Homes.');
      }
      return funeralHome
        .update({
          ...args
        })
        .then((retHome) => {
          return {
            id: retHome.dataValues.id
          };
        });
    });
  }
};

const deleteFuneralHome = {
  type: FuneralHomeTypeDef,
  name: 'deleteFuneralHome',
  args: {
    id: { type: GraphQLInt }
  },
  resolve: (parentValues, args, context) => {
    if (context.user.role_id !== 1) {
      throw new Error('This role cannot delete Funeral Homes.');
    }

    return FuneralHome.findAll({
      where: {
        user_id: context.user.id
      }
    })
      .then((homes) => {
        return homes.length > 1 ? homes : [];
      })
      .then(async (homes) => {
        const homeToDelete = homes.find((h) => h.id === args.id);
        if (homeToDelete) {
          return homeToDelete.destroy().then(() => {
            return homeToDelete;
          });
        }
        return null;
      });
  }
};

module.exports = {
  userFuneralHomes,
  createFuneralHome,
  editFuneralHome,
  deleteFuneralHome
};
