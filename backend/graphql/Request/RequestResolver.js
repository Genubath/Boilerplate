const {
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean
} = require('graphql');
const moment = require('moment-timezone');
const { Op, Sequelize } = require('sequelize');
const AWS = require('aws-sdk');
const bluebird = require('bluebird');
const crypto = require('crypto');
const db = require('../../models/index');
const { isRequestEventAllowed } = require('../../../utilities/RequestFlow');
const RequestTypeDef = require('./RequestTypeDef');
const { saveError, saveLog } = require('../../utilities/logger');
const RequestHelpers = require('./RequestHelpers');

const { Request, RequestEvent, UploadKey } = db;

const userRequests = {
  name: 'userRequests',
  type: new GraphQLList(RequestTypeDef),
  resolve: async (parentValues, args, context) => {
    if (context.user.role_id !== 1) {
      saveError(
        context.user.id,
        context.reqIP,
        2,
        'Only FDs can use mutation "userRequests"'
      );
      throw new Error('This role does not have requests.');
    }
    const requestsToSkip = await RequestEvent.findAll({
      attributes: ['request_id'],
      where: {
        creator_id: context.user.id,
        eventType: 'Cancelled'
      }
    });

    const requestIdsToSkip = requestsToSkip.map((reqEvent) => {
      return reqEvent.request_id;
    });

    const userReqs = await Request.findAll({
      where: {
        requestor_id: context.user.id,
        serviceDateTime: {
          [Op.gte]: moment().startOf('day')
        },
        id: {
          [Op.notIn]: requestIdsToSkip
        }
      },
      order: [['serviceDateTime', 'ASC']]
    });
    return userReqs;
  }
};

const getRequest = {
  type: RequestTypeDef,
  name: 'getRequest',
  args: { id: { type: GraphQLInt } },
  resolve: (parentValues, args, context) => {  
    if (context.user.role_id > 3) {
      throw new Error('This role cannot view requests.');
    }
    return Request.findByPk(args.id).then((foundReq) => {
      if (
        foundReq.requestor_id !== context.user.id &&
        context.user.role_id === 1
      ) {
        saveError(
          context.user.id,
          context.reqIP,
          2,
          `Request with ID: ${args.id} failed access attempt`
        );
        throw new Error('User cannot access this request');
      }
      const mykey = crypto.createDecipher(
        'aes-128-cbc',
        process.env.ENCRYPTION_KEY
      );
      try {
        let decryptedSSN = mykey.update(
          foundReq.dataValues.deceasedSSN,
          'hex',
          'utf8'
        );
        decryptedSSN += mykey.final('utf8');

        return Request.build({
          ...foundReq.dataValues,
          deceasedSSN: decryptedSSN
        });
      } catch (e) {
        if (e.name === 'TypeError') {
          return foundReq;
        }
      }
      return null;
    });
  }
};

const getRequests = {
  name: 'getRequests',
  type: new GraphQLList(RequestTypeDef),
  args: { isUpcoming: { type: GraphQLBoolean } },
  resolve: (parentValues, args, context) => {
    RequestHelpers.checkManageRole(
      context,
      'This role does not have permission to view all requests.'
    );
    return Request.findAll(
      args.isUpcoming
        ? {
            where: {
              serviceDateTime: {
                [Op.gte]: moment().startOf('day')
              }
            },
            order: [['serviceDateTime', 'ASC']]
          }
        : {
            where: {
              serviceDateTime: {
                [Op.lte]: moment().startOf('day')
              }
            },
            order: [['serviceDateTime', 'DESC']]
          }
    )
      .then((requests) => {
        return RequestHelpers.deCyrptingSSNsOnRequests(requests);
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

const dateFilteredRequests = {
  name: 'dateFilteredRequests',
  type: new GraphQLList(RequestTypeDef),
  args: {
    startDate: { type: GraphQLString },
    endDate: { type: GraphQLString },
    searchText: { type: GraphQLString },
    isArchiveSearch: { type: GraphQLBoolean }
  },
  resolve: (parentValues, args, context) => {
    RequestHelpers.checkManageRole(
      context,
      'This role does not have permission to view all requests.'
    );

    let dateFilters = {
      [Op.gte]: args.startDate
        ? new Date(args.startDate)
        : moment()
            .startOf('day')
            .toDate()
    };

    if (!args.startDate && args.isArchiveSearch) {
      dateFilters = {};
    }
    if (args.endDate) {
      dateFilters[Op.lte] = new Date(args.endDate);
    }
    const nameSearch = args.searchText || '';

    return Request.findAll({
      where: {
        serviceDateTime: dateFilters,
        [Op.or]: [
          Sequelize.where(
            Sequelize.fn('LOWER', Sequelize.col('deceasedLastName')),
            'LIKE',
            `%${nameSearch}%`
          ),
          Sequelize.where(
            Sequelize.fn('LOWER', Sequelize.col('deceasedFirstName')),
            'LIKE',
            `%${nameSearch}%`
          )
        ]
      },
      order: [['serviceDateTime', 'ASC']]
    })
      .then((requests) => {
        return RequestHelpers.deCyrptingSSNsOnRequests(requests);
      })
      .catch((error) => {
        return error;
      });
  }
};

AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
AWS.config.setPromisesDependency(bluebird);
const s3 = new AWS.S3({
  signatureVersion: 'v4'
});

// eslint-disable-next-line camelcase
const handleUploadKeys = async (uploadKeys, request_id) => {
  const oldUploadKey = await UploadKey.findOne({ where: { request_id } });
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: oldUploadKey.fileKey
  };
  await UploadKey.destroy({ where: { request_id } });
  if (oldUploadKey) {
    await s3.deleteObject(params, (err, data) => {
      if (err) {
        console.log(err, err.stack); // an error occurred
      } else {
        console.log(data); // successful response
      }
    });
  }
  const decodedURI = decodeURIComponent(uploadKeys);
  const objectKeys = JSON.parse(decodedURI);
  const keyObjects = objectKeys.map((key) => {
    const keyObject = { fileKey: key, request_id };
    return keyObject;
  });
  return UploadKey.bulkCreate(keyObjects, { returning: true }).then(() => {
    console.log('Upload Keys bottom hit');
  });
};

const createRequest = {
  type: RequestTypeDef,
  name: 'createRequest',
  args: {
    honorsLocationId: { type: GraphQLInt },
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
    funeralHomeName: { type: GraphQLString },
    funeralHomeZipcode: { type: GraphQLString },
    funeralHomeCounty: { type: GraphQLString },
    funeralHomeState: { type: GraphQLString },
    funeralHomeCity: { type: GraphQLString },
    funeralHomeAddress: { type: GraphQLString },
    willSaveLocation: { type: GraphQLBoolean },
    deceasedFirstName: { type: GraphQLString },
    deceasedLastName: { type: GraphQLString },
    deceasedSSN: { type: GraphQLString },
    honorsRank: { type: GraphQLString },
    branchOfService: { type: GraphQLString },
    memberStatus: { type: GraphQLString },
    funeralHome_id: { type: GraphQLInt },
    serviceDateTime: { type: GraphQLString },
    serviceTimeZone: { type: GraphQLString },
    serviceLocationName: { type: GraphQLString },
    serviceType: { type: GraphQLString },
    isFlagFamilyProvided: { type: GraphQLString },
    isVSOOrgInvolved: { type: GraphQLString },
    VSODetails: { type: GraphQLString },
    comments: { type: GraphQLString },
    uploadKeys: { type: GraphQLString },
    isEligible: { type: GraphQLBoolean },
    flagsPresented: { type: GraphQLInt },
    is1946Complete: { type: GraphQLBoolean },
    requestType: { type: GraphQLString }
  },
  resolve: async (parentValues, args, context) => {
    const mykey = crypto.createCipher(
      'aes-128-cbc',
      process.env.ENCRYPTION_KEY
    );
    let encryptedSSN = mykey.update(args.deceasedSSN, 'utf8', 'hex');
    encryptedSSN += mykey.final('hex');

    const isSchedulerCreated =
      context.user.role_id === 2 || context.user.role_id === 3;

    const newRequest = await Request.build({
      ...args,
      isSchedulerCreated,
      deceasedSSN: encryptedSSN,
      requestor_id: context.user.id,
      isFlagFamilyProvided: args.isFlagFamilyProvided === 'Yes',
      isVSOOrgInvolved: args.isVSOOrgInvolved === 'Yes',
      isEligible: args.isEligible,
      is1946Complete: args.is1946Complete
    }).save();

    saveLog(
      context.user.id,
      context.reqIP,
      4,
      `Request ID: ${newRequest.id} Created by ${context.user.id}`
    );

    if (args.willSaveLocation) {
      if (args.honorsLocationId === -1) {
        RequestHelpers.saveNewLocation(args, context);
      } else {
        RequestHelpers.saveExistingLocation(args, context);
      }
    }

    await RequestEvent.build({
      request_id: newRequest.id,
      creator_id: newRequest.requestor_id,
      eventType: isSchedulerCreated ? 'Confirmed' : 'Sent'
    }).save()

    if (JSON.parse(decodeURIComponent(args.uploadKeys)).length >0 ) {
      console.log(`create UploadKey: ${args.uploadKeys}`)
      handleUploadKeys(args.uploadKeys, newRequest.id);
    }
    return newRequest;
  }
};

const editRequest = {
  type: RequestTypeDef,
  name: 'editRequest',
  args: {
    id: { type: GraphQLInt },
    honorsLocationId: { type: GraphQLInt },
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
    funeralHomeName: { type: GraphQLString },
    funeralHomeZipcode: { type: GraphQLString },
    funeralHomeCounty: { type: GraphQLString },
    funeralHomeState: { type: GraphQLString },
    funeralHomeCity: { type: GraphQLString },
    funeralHomeAddress: { type: GraphQLString },
    willSaveLocation: { type: GraphQLBoolean },
    deceasedFirstName: { type: GraphQLString },
    deceasedLastName: { type: GraphQLString },
    deceasedSSN: { type: GraphQLString },
    honorsRank: { type: GraphQLString },
    branchOfService: { type: GraphQLString },
    memberStatus: { type: GraphQLString },
    funeralHome_id: { type: GraphQLInt },
    serviceDateTime: { type: GraphQLString },
    serviceTimeZone: { type: GraphQLString },
    serviceLocationName: { type: GraphQLString },
    serviceType: { type: GraphQLString },
    isFlagFamilyProvided: { type: GraphQLString },
    isVSOOrgInvolved: { type: GraphQLString },
    uploadKeys: { type: GraphQLString },
    VSODetails: { type: GraphQLString },
    comments: { type: GraphQLString },
    isEligible: { type: GraphQLBoolean },
    flagsPresented: { type: GraphQLInt },
    is1946Complete: { type: GraphQLBoolean }
  },
  resolve: (parentValues, args, context) => {
    return Request.findByPk(args.id).then((foundReq) => {
      return RequestHelpers.checkEventType(
        foundReq.id,
        foundReq.isSchedulerCreated,
        context
      ).then((requestEventType) => {
        if (
          context.user.id !== foundReq.requestor_id &&
          !foundReq.isSchedulerCreated
        ) {
          saveError(
            context.user.id,
            context.reqIP,
            2,
            `FD attempted to edit another FD's Request with ID: ${args.id}`
          );
          throw new Error('Users can only edit their own requests.');
        }
        if (
          !foundReq.isSchedulerCreated &&
          (context.user.role_id === 2 || context.user.role_id === 3)
        ) {
          saveError(
            context.user.id,
            context.reqIP,
            2,
            `NCO/SCH attempted to edit a FD Request with ID: ${args.id}`
          );
          throw new Error('NCOs/SCH cannot edit FD made requests');
        }

        const mykey = crypto.createCipher(
          'aes-128-cbc',
          process.env.ENCRYPTION_KEY
        );
        let encryptedSSN = mykey.update(args.deceasedSSN, 'utf8', 'hex');
        encryptedSSN += mykey.final('hex');

        return foundReq
          .update({
            ...args,
            deceasedSSN: encryptedSSN,
            requestor_id: context.user.id,
            isFlagFamilyProvided: args.isFlagFamilyProvided === 'Yes',
            isVSOOrgInvolved: args.isVSOOrgInvolved === 'Yes',
            isEligible: args.isEligible,
            isFamilyAttending: args.isFamilyAttending === 'Yes',
            is1946Complete: args.is1946Complete
          })
          .then(async (res) => {
            if (JSON.parse(decodeURIComponent(args.uploadKeys)).length > 0 ) {
              console.log(`edit UploadKey: ${  args.uploadKeys}`)

              handleUploadKeys(args.uploadKeys, args.id);
            }
            saveLog(
              context.user.id,
              context.reqIP,
              5,
              `Request Edited, ID: ${args.id}`
            );
            return {
              id: res.dataValues.id,
              requestor_id: context.user.id
            };
          })
          .then((retReq) => {
            return RequestEvent.build({
              request_id: retReq.id,
              creator_id: retReq.requestor_id,
              eventType: requestEventType
            })
              .save()
              .then(() => {
                if (args.willSaveLocation) {
                  if (args.honorsLocationId === -1) {
                    RequestHelpers.saveNewLocation(args, context);
                  } else {
                    RequestHelpers.saveExistingLocation(args, context);
                  }
                }
              })
              .then(() => {
                return { id: retReq.id };
              });
          });
      });
    });
  }
};

const editNPBFields = {
  type: RequestTypeDef,
  name: 'editNPBFields',
  args: {
    id: { type: GraphQLInt },
    NPBRank: { type: GraphQLString },
    NPBName: { type: GraphQLString },
    NPBPhone: { type: GraphQLString }
  },
  resolve: (parentValues, args, context) => {
    RequestHelpers.checkManageRole(context, 'This role cannot edit NPB info.');
    return Request.update(
      {
        NPBRank: args.NPBRank,
        NPBName: args.NPBName,
        NPBPhone: args.NPBPhone
      },
      { where: { id: args.id } }
    ).then(([affectedRows]) => {
      saveLog(
        context.user.id,
        context.reqIP,
        5,
        `Request NPB info Edited, ID: ${args.id}`
      );
      return { affectedRows };
    });
  }
};

const editGuardFields = {
  type: RequestTypeDef,
  name: 'editGuardFields',
  args: {
    id: { type: GraphQLInt },
    guardUnit: { type: GraphQLString },
    pocName: { type: GraphQLString },
    pocNumber: { type: GraphQLString }
  },
  resolve: (parentValues, args, context) => {
    RequestHelpers.checkManageRole(
      context,
      'This role cannot edit Guard info.'
    );
    return Request.update(
      {
        guardUnit: args.guardUnit,
        pocName: args.pocName,
        pocNumber: args.pocNumber
      },
      { where: { id: args.id } }
    ).then(([affectedRows]) => {
      return RequestEvent.build({
        request_id: args.id,
        creator_id: context.user.id,
        eventType: 'Guard',
        comment: null
      })
        .save()
        .then(() => {
          saveLog(
            context.user.id,
            context.reqIP,
            5,
            `Request Guard info Edited, ID: ${args.id}`
          );
          return { affectedRows };
        });
    });
  }
};

const confirmRequest = {
  type: RequestTypeDef,
  name: 'confirmRequest',
  args: {
    id: { type: GraphQLInt },
    action: { type: GraphQLString },
    isEligible: { type: GraphQLBoolean },
    flagsPresented: { type: GraphQLInt },
    is1946Complete: { type: GraphQLBoolean },
    comment: { type: GraphQLString }
  },
  resolve: (parentValues, args, context) => {
    RequestHelpers.checkManageRole(
      context,
      'This role cannot confirm requests.'
    );
    if (args.action !== 'Notice' && args.action !== 'Confirmed') {
      saveError(
        context.user.id,
        context.reqIP,
        4,
        `Trying to hit confirmRequest with unacceptable action: ReqID: ${
          args.id
        }, ${args.action}`
      );
      throw new Error(
        `Trying to hit confirmRequest with unacceptable action: ReqID: ${
          args.id
        }, ${args.action}`
      );
    }
    return Request.update(
      {
        isEligible: args.isEligible,
        flagsPresented: args.flagsPresented,
        is1946Complete: args.is1946Complete
      },
      { where: { id: args.id } }
    ).then(([affectedRows]) => {
      return RequestEvent.build({
        request_id: args.id,
        creator_id: context.user.id,
        eventType: args.action,
        comment: args.action === 'Notice' ? args.comment : null
      })
        .save()
        .then(() => {
          saveLog(
            context.user.id,
            context.reqIP,
            5,
            `Request additional info Edited, ID: ${args.id}`
          );
          return { affectedRows };
        });
    });
  }
};

// needs tests
const respondToRequest = {
  type: RequestTypeDef,
  name: 'respondToRequest',
  args: {
    requestId: { type: GraphQLInt },
    comment: { type: GraphQLString },
    action: { type: GraphQLString },
    guardUnit: { type: GraphQLString },
    pocName: { type: GraphQLString },
    pocNumber: { type: GraphQLString }
  },
  resolve: (parentValues, args, context) => {
    if (
      context.user.role_id !== 2 &&
      context.user.role_id !== 3 &&
      args.action !== 'Acknowledged'
    ) {
      saveError(
        context.user.id,
        context.reqIP,
        2,
        `FD attempted to respond to request for Request ID: ${
          args.id
        } action: ${args.action}`
      );
      throw new Error('Only Schedulers and NCOICs can perform this action.');
    }

    return RequestEvent.findAll({
      where: {
        request_id: args.requestId
      },
      order: [['createdAt', 'DESC']]
      // eslint-disable-next-line no-unused-vars
    }).then(async (foundEvents) => {
      const foundReq = await Request.findByPk(args.requestId);
      if (
        (foundReq.requestor_id !== context.user.id &&
          args.action === 'Acknowledged') ||
        (foundEvents[0].eventType !== 'Notice' &&
          args.action === 'Acknowledged')
      ) {
        throw new Error('Disallowed event flow');
      }
      if (
        !isRequestEventAllowed(
          foundEvents[0].eventType,
          args.action,
          foundReq.isSchedulerCreated
        )
      ) {
        saveError(
          context.user.id,
          context.reqIP,
          4,
          `Disallowed Event flow from ${foundEvents[0].eventType} to ${
            args.action
          }`
        );
        throw new Error(
          `Disallowed Event flow: from ${foundEvents[0].eventType} to ${
            args.action
          }`
        );
      }
      return RequestEvent.build({
        request_id: args.requestId,
        creator_id: context.user.id,
        eventType: args.action,
        comment:
          args.action === 'Denied' ||
          args.action === 'Alert' ||
          args.action === 'Guard' ||
          args.action === 'Notice'
            ? args.comment
            : null
      })
        .save()
        .then((createdEvent) => {
          return { id: createdEvent.id };
        });
    });
  }
};

// needs tests
const completeRequests = {
  type: RequestTypeDef,
  name: 'completeRequests',
  args: {
    requestIDs: { type: new GraphQLList(GraphQLInt) }
  },
  resolve: async (parentValues, args, context) => {
    if (
      context.user.role_id !== 2 &&
      context.user.role_id !== 3 &&
      args.action !== 'Acknowledged'
    ) {
      throw new Error('Only Schedulers and NCOICs can perform this action.');
    }

    // Only request events from ones selected by user
    const selectedRequestEvents = await RequestEvent.findAll({
      where: {
        request_id: args.requestIDs
      }
    });

    // Only list of the most recent reqEvents
    const latestList = selectedRequestEvents.map((re, i, arrayRE) => {
      const byID = arrayRE.filter((req) => {
        return req.request_id === re.request_id;
      });
      const retVal = byID.reduce((accumulator, current) => {
        if (current.createdAt > accumulator.createdAt) {
          return current;
        }
        return accumulator;
      });
      return retVal;
    });

    // Remove Dups
    const uniqueList = latestList.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });

    // Check validity
    const validRequestEvents = uniqueList.filter((req) =>
      isRequestEventAllowed(req.dataValues.eventType, 'Completed', false)
    );

    // Build new items
    const newCompleteEvents = validRequestEvents.map((req) => {
      const newReqEvent = {
        request_id: req.request_id,
        eventType: 'Completed',
        creator_id: context.user.id
      };
      return newReqEvent;
    });

    // Create
    return RequestEvent.bulkCreate(newCompleteEvents);
  }
};

const cancelRequest = {
  type: RequestTypeDef,
  name: 'cancelRequest',
  args: {
    id: { type: GraphQLInt }
  },
  resolve: async (parentValues, args, context) => {
    if (context.user.role_id !== 1) {
      saveError(
        context.user.id,
        context.reqIP,
        2,
        'Only FDs can use mutation "cancelRequest"'
      );
      throw new Error('This role does not have requests.');
    }
    const foundReq = await Request.findByPk(args.id);
    const foundReqEvents = await RequestEvent.findAll({
      where: {
        request_id: foundReq.id
      }
    });
    if (
      !isRequestEventAllowed(
        foundReqEvents[foundReqEvents.length - 1].eventType,
        'Cancelled',
        foundReq.isSchedulerCreated
      )
    ) {
      saveError(
        context.user.id,
        context.reqIP,
        4,
        `Disallowed Event flow from ${
          foundReqEvents[foundReqEvents.length - 1].eventType
        } to Cancelled`
      );
      throw new Error(
        `Disallowed Event flow: from ${
          foundReqEvents[foundReqEvents.length - 1].eventType
        } to Cancelled`
      );
    }
    return RequestEvent.build({
      request_id: args.id,
      creator_id: context.user.id,
      eventType: 'Cancelled',
      comment: null
    }).save();
  }
};

const deleteRequest = {
  type: RequestTypeDef,
  name: 'deleteRequest',
  args: {
    id: { type: GraphQLInt }
  },
  resolve: async (parentValues, args, context) => {
    const reqEvents = await RequestEvent.findAll({
      where: {
        request_id: args.id
      }
    });
    if (context.user.role_id === 1) {
      RequestHelpers.deleteRequestFD(reqEvents, args.id, context);
    }
    if (context.user.role_id === 2 || context.user.role_id === 3) {
      RequestHelpers.deleteRequestSCH(reqEvents, args.id, context);
    }
  }
};

module.exports = {
  editNPBFields,
  editGuardFields,
  userRequests,
  createRequest,
  getRequests,
  dateFilteredRequests,
  getRequest,
  editRequest,
  respondToRequest,
  completeRequests,
  confirmRequest,
  cancelRequest,
  deleteRequest
};
