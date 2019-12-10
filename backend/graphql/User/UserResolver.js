/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
const {
  GraphQLString,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLList
} = require('graphql');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const nodemailer = require('nodemailer');
const UserTypeDef = require('./UserTypeDef');
const db = require('../../models/index');
const { saveError, saveLog } = require('../../utilities/logger');
const { schedulerEventTypes } = require('../../../utilities/RequestFlow');

const isUnitTest = process.env.LOADED_MOCHA_OPTS;

const { User, FuneralHome, RequestEvent, Request } = db;

const currentUser = {
  type: UserTypeDef,
  name: 'currentUser',
  resolve: (req, res, context) =>
    User.findByPk(context.user.id).then((current) => {
      const _current = current;
      _current.password = '';
      return _current;
    })
};

// Mutation definition
const createUser = {
  type: UserTypeDef,
  name: 'createUser',
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    funeralName: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    faxNumber: { type: GraphQLString },
    password: { type: GraphQLString },
    address: { type: GraphQLString },
    city: { type: GraphQLString },
    state: { type: GraphQLString },
    county: { type: GraphQLString },
    zipCode: { type: GraphQLString }
  },
  resolve: (parentValues, args, context) => {
    const hash = bcrypt.hashSync(args.password, 12);
    let retUser;
    const createdUser = User.build({
      ...args,
      role_id: 1,
      password: hash
    });

    return createdUser
      .save()
      .then((res) => {
        delete res.dataValues.password;
        retUser = {
          ...res.dataValues
        };
        saveLog(retUser.id, null, 2, `User ${retUser.email} created`);
        return retUser;
      })
      .then((res) => {
        return FuneralHome.build({
          name: args.funeralName,
          user_id: res.id,
          address: args.address,
          city: args.city,
          state: args.state,
          county: args.county,
          zip: args.zipCode
        })
          .save()
          .then((fhome) => {
            console.log('funeral home made');
            return fhome;
          });
      })
      .then((fhome) => {
        return User.update(
          { presetFuneralHomeId: parseInt(fhome.id, 10) },
          { where: { id: fhome.user_id } }
        ).then((updatedUser) => {
          return { id: updatedUser[0] };
        });
      })
      .catch((err) => {
        console.log('USER CREATION ERROR: ', err);
        if (err.name === 'SequelizeUniqueConstraintError') {
          saveError(
            null,
            context.reqIP,
            4,
            `Account ${args.email} already exists, can't create`
          );
          throw new Error(
            'An account with that email address has already been created.'
          );
        }
        throw new Error(
          'An error has occured in the account creation process.'
        );
      });
  }
};

const createScheduler = {
  type: UserTypeDef,
  name: 'createScheduler',
  args: {
    rank: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: new GraphQLNonNull(GraphQLString) },
    phoneNumber: { type: GraphQLString },
    unit: { type: GraphQLString }
  },
  resolve: (parentValues, args, context) => {
    if (context.user.role_id !== 3) {
      saveError(
        context.user.id,
        context.reqIP,
        2,
        'Only NCOICs can create Schedulers'
      );
      throw new Error('This role does not have permission to view schedulers.');
    }
    const randomstring = Array(12)
      .fill(
        '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*'
      )
      .map((x) => {
        return x[Math.floor(Math.random() * x.length)];
      })
      .join('');

    const hash = bcrypt.hashSync(randomstring, 12);
    const createdScheduler = User.build({
      ...args,
      role_id: 2,
      password: hash,
      isPasswordResetNeeded: true
    });

    return createdScheduler
      .save()
      .then((res) => {
        saveLog(
          res.dataValues.id,
          context.reqIP,
          2,
          `Scheduler ${res.dataValues.email} created`
        );

        const smtpTransport = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true, // use TLS
          auth: {
            user: 'Mercury.App.Mail@gmail.com',
            pass: process.env.EMAIL_PASSWORD
          }
        });
        console.log('going to try to send mail');
        smtpTransport.sendMail(
          {
            from: 'sender@example.com',
            to: res.dataValues.email,
            subject: 'New Mercury Account Created',
            text: `A Mercury account has been created for you. 
            Log in at www.mercury.app.cloud.gov using your 
            Email address and the provided temporary password. 
            Your Temporary Password is : "${randomstring}"`
          },
          (err, info) => {
            if (err) {
              console.log(err);
            } else {
              console.log(info.envelope);
              console.log(info.messageId);
            }
          }
        );

        console.log('scheduler created');
        return { id: res.dataValues.id };
      })
      .catch((err) => {
        console.log('SCHEDULER CREATION ERROR: ', err.name);
        if (err.name === 'SequelizeUniqueConstraintError') {
          saveError(
            null,
            context.reqIP,
            4,
            `Account ${args.email} already exists, can't create`
          );
          throw new Error(
            'An account with that email address has already been created.'
          );
        }
        throw new Error(
          'An error has occured in the account creation process.'
        );
      });
  }
};

const getUsers = {
  type: new GraphQLList(UserTypeDef),
  name: 'getUsers',
  resolve: async (parentValues, args, context) => {
    if (context.user.role_id !== 3) {
      saveError(
        context.user.id,
        context.reqIP,
        2,
        'Only NCOICs can view Schedulers'
      );
      throw new Error('This role does not have permission to view schedulers.');
    }
    const users = await User.findAll({
      where: {
        role_id: {
          [Op.or]: [1, 2]
        },
        isActive: true
      }
    });

    return users;
  }
};

const updateUser = {
  type: UserTypeDef,
  name: 'updateUser',
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    funeralName: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    faxNumber: { type: GraphQLString },
    unit: { type: GraphQLString },
    rank: { type: GraphQLString },
    presetFuneralHomeId: { type: GraphQLInt },
    presetLocationId: { type: GraphQLInt }
  },
  resolve: async (parentValues, args, context) => {
    await User.update(args, {
      where: { id: context.user.id }
    });
    const updatedUser = await User.findByPk(context.user.id);
    return updatedUser;
  }
};

const deactivateUser = {
  type: UserTypeDef,
  name: 'deactivateUser',
  args: {
    id: { type: GraphQLInt }
  },
  resolve: async (parentValues, args, context) => {
    if (context.user.role_id !== 3) {
      saveError(
        context.user.id,
        context.reqIP,
        2,
        'Only NCOICs can deactivate users'
      );
      throw new Error(
        'This role does not have permission to deactivate users.'
      );
    }
    await User.update(
      {
        isActive: false
      },
      { where: { id: args.id } }
    );

    const updatedUser = await User.findByPk(args.id);

    saveLog(
      context.user.id,
      context.reqIP,
      3,
      `User with id: ${args.id} deactivated`
    );
    console.log(`user ${args.id} deactivated`);

    const userRequests = await Request.findAll({
      where: { requestor_id: args.id }
    });
    const requestIds = userRequests.map((theReq) => theReq.id);
    const respondRequestEvents = await RequestEvent.findAll({
      where: { request_id: requestIds, eventType: schedulerEventTypes }
    });

    const requestIDsToKeep = respondRequestEvents.map((re) => {
      return re.request_id;
    });

    const requestIDsToDestroy = userRequests.reduce(
      (accumulator, currentValue) => {
        if (!requestIDsToKeep.includes(currentValue.id)) {
          return accumulator.concat(currentValue.id);
        }
        return accumulator;
      },
      []
    );

    await Request.destroy({
      where: { id: requestIDsToDestroy }
    });
    return updatedUser;
  }
};

const changePassword = {
  type: UserTypeDef,
  name: 'changePassword',
  args: {
    oldPassword: { type: new GraphQLNonNull(GraphQLString) },
    newPassword: { type: new GraphQLNonNull(GraphQLString) },
    confirmPassword: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: (parentValues, args, context) => {
    if (args.confirmPassword !== args.newPassword) {
      saveError(
        context.user.id,
        context.reqIP,
        3,
        'New password and confirmation password mismatch'
      );
      throw new Error('New password and confirmation do not match');
    }
    return User.findByPk(context.user.id)
      .then((foundUser) => {
        const pwTestResult = isUnitTest
          ? args.oldPassword === foundUser.password
          : bcrypt.compareSync(args.oldPassword, foundUser.password);

        if (!pwTestResult) {
          saveError(
            context.user.id,
            context.reqIP,
            3,
            'Old Password was incorrect'
          );
          throw new Error('The entered current password was incorrect');
        }

        return User.update(
          { password: bcrypt.hashSync(args.newPassword, 12) },
          { returning: true, where: { id: context.user.id } }
        ).then(([err, res]) => {
          return { err, rows: res };
        });
        /*
        return User.update(
          { password: bcrypt.hashSync(args.newPassword, 12) },
          { returning: true, where: { id: context.user.id } }
        ).then(([changedRows, [updatedUser]]) => {
          // saveLog(context.user.id, context.reqIP, 3, 'User changed password');
          return { ...updatedUser.dataValues, changedRows };
        });
        */
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
  }
};

module.exports = {
  currentUser,
  createUser,
  createScheduler,
  updateUser,
  deactivateUser,
  changePassword,
  getUsers
};
