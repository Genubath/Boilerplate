/* eslint-disable camelcase */
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean
} = require('graphql');
const FuneralHomeTypeDef = require('../FuneralHome/FuneralHomeTypeDef');
const LocationTypeDef = require('../Location/LocationTypeDef');

const db = require('../../models/index');

const { FuneralHome, FuneralLocation } = db;

const UserTypeDef = new GraphQLObjectType({
  name: 'User',
  description: 'Individual Mercury User',
  fields: () => ({
    id: {
      type: GraphQLInt,
      description: 'The Id'
    },
    role_id: {
      type: GraphQLInt,
      description: 'The role Id'
    },
    isActive: {
      type: GraphQLBoolean
    },
    firstName: {
      type: GraphQLString,
      description: 'First name of the User'
    },
    lastName: {
      type: GraphQLString,
      description: 'Last Name of the User'
    },
    rank: {
      type: GraphQLString,
      description: 'Rank of the User'
    },
    unit: {
      type: GraphQLString,
      description: 'Unit of the User'
    },
    email: {
      type: GraphQLString,
      description: 'User email address'
    },
    presetFuneralHomeId: {
      type: GraphQLInt,
      description: 'Preset Funeral Home Id'
    },
    presetLocationId: {
      type: GraphQLInt,
      description: 'Preset Location Id'
    },
    password: {
      type: GraphQLString,
      description: 'User password'
    },
    phoneNumber: {
      type: GraphQLString,
      description: 'User phone number'
    },
    faxNumber: {
      type: GraphQLString,
      description: 'User fax number'
    },
    createdAt: {
      type: GraphQLString
    },
    funeralHomes: {
      type: new GraphQLList(FuneralHomeTypeDef),
      description: 'User funeral home',
      resolve(parent, args, context) {        
        if (parent.dataValues.role_id === 1) {
          return FuneralHome.findAll({
            where: {
              user_id: parent.dataValues.id
            }
          }).then((list) => {
            return list.sort((a, b) => {
              return b.id === context.user.presetFuneralHomeId;
            });
          });
        }
        return [];
      }
    },
    funeralLocations: {
      type: new GraphQLList(LocationTypeDef),
      description: 'User funeral locations',
      resolve: (parent, args, context) => {
        if (parent.dataValues.role_id === 1) {
          return FuneralLocation.findAll({
            where: {
              user_id: parent.dataValues.id
            }
          }).then((list) => {
            return list.sort((a, b) => {
              return b.id === context.user.presetLocationId;
            });
          });
        }
        return [];
      }
    },
    pendingArchiveCount: {
      type: GraphQLInt,
      description: 'Number of requests that are pending for Scheduler',
      resolve: async (parent, args, context) => {
        const { user } = context;
        const { role_id } = user;
        if (role_id === 2 || role_id === 3) {
          const theCount = await db.sequelize.query(
            `Select Count(r.id) as Count 
              FROM Requests AS r 
              JOIN RequestEvents AS e 
              ON e.id = (SELECT ei.id 
                FROM RequestEvents AS ei 
                WHERE ei.request_id = r.id 
                ORDER BY ei.createdAt Desc LIMIT 1) 
              WHERE e.eventType IN ('Confirmed', 'Acknowledged', 'Guard')
              AND (CURDATE() - DATE(r.serviceDateTime) > 0);`,
            {
              raw: true
            }
          );
          return theCount[0][0].Count;
        }
        return 0;
      }
    },
    alertRequestCount: {
      type: GraphQLInt,
      description: 'Number of requests that are alert for Scheduler',
      resolve: async (parent, args, context) => {
        const { user } = context;
        const { role_id } = user;
        if (role_id === 2 || role_id === 3) {
          const sentLast = await db.sequelize.query(
            `Select r.id 
            FROM Requests AS r 
            JOIN RequestEvents AS e 
            ON e.id = (SELECT ei.id 
              FROM RequestEvents AS ei 
              WHERE ei.request_id = r.id 
              ORDER BY ei.createdAt Desc LIMIT 1) 
            WHERE e.eventType = 'Sent'
            AND (CURDATE() - DATE(r.serviceDateTime) <= 0);
            `,
            {
              raw: true
            }
          );
          const lastIds = sentLast[0].map((sl) => sl.id);
          const countByIds = await db.sequelize.query(
            `Select r.id, Count(*) as Count 
            FROM Requests AS r 
            JOIN RequestEvents AS e 
            ON r.id = e.request_id
            WHERE (CURDATE() - DATE(r.serviceDateTime) <= 0)
            GROUP BY e.request_id;
            `,
            {
              raw: true
            }
          );
          const countObjects = countByIds[0].filter((retObj) => {
            return retObj.Count > 1;
          });

          const alertCount = countObjects.reduce((accumulator, idAndCount) => {
            if (lastIds.includes(idAndCount.id)) {
              return accumulator + 1;
            }
            return accumulator;
          }, 0);

          return alertCount
        }
        return 0;
      }
    }
  })
});

module.exports = UserTypeDef;
