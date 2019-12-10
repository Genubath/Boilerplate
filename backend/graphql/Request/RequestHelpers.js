const crypto = require('crypto');
const db = require('../../models/index');
const {
  isRequestEventAllowed,
  schedulerEventTypes
} = require('../../../utilities/RequestFlow');
const { saveError } = require('../../utilities/logger');

const { Request, RequestEvent, FuneralLocation } = db;

const deCyrptingSSNsOnRequests = (requests) => {
  return requests.map((req) => {
    const mykey = crypto.createDecipher(
      'aes-128-cbc',
      process.env.ENCRYPTION_KEY
    );
    try {
      let decryptedSSN = mykey.update(
        req.dataValues.deceasedSSN,
        'hex',
        'utf8'
      );
      decryptedSSN += mykey.final('utf8');

      return Request.build({
        ...req.dataValues,
        deceasedSSN: decryptedSSN
      });
    } catch (e) {
      if (e.name === 'TypeError') {
        return req;
      }
      return null;
    }
  });
};

const checkEventType = (requestId, isSchedulerCreated, context) => {
  return RequestEvent.findAll({
    where: {
      request_id: requestId
    },
    order: [['createdAt', 'DESC']]
  }).then((foundEvents) => {
    let requestEventType;
    const lastEvent = foundEvents[0].eventType;
    if (
      context.user.role_id === 1 &&
      (lastEvent === 'Confirmed' ||
        lastEvent === 'Alert' ||
        lastEvent === 'Acknowledged' ||
        lastEvent === 'Notice' ||
        lastEvent === 'Sent')
    ) {
      requestEventType = 'Sent';
    } else {
      requestEventType = isSchedulerCreated ? 'Confirmed' : 'Sent';
    }
    if (
      !isRequestEventAllowed(
        foundEvents[0].eventType,
        requestEventType,
        isSchedulerCreated
      )
    ) {
      saveError(
        context.user.id,
        context.reqIP,
        4,
        `Disallowed Event flow from ${
          foundEvents[0].eventType
        } to ${requestEventType}`
      );
      throw new Error(
        `Disallowed Event flow: from ${
          foundEvents[0].eventType
        } to ${requestEventType}`
      );
    } else {
      return requestEventType;
    }
  });
};

const checkManageRole = (context, errorMessage) => {
  if (context.user.role_id !== 2 && context.user.role_id !== 3) {
    saveError(context.user.role_id, context.reqIP, 2, errorMessage);
    throw new Error(errorMessage);
  }
};

const saveNewLocation = async (args, context) => {
  if (context.user.role_id !== 1) {
    throw new Error('This role cannot create Funeral Locations.');
  }
  const newLocation = FuneralLocation.build({
    name: args.serviceLocationName,
    address: args.honorsAddress,
    city: args.honorsCity,
    state: args.honorsState,
    county: args.honorsCounty,
    zip: args.honorsZip,
    notes: args.locationNotes,
    gps: args.honorsGps,
    user_id: context.user.id
  }).save();
  return newLocation;
};

const saveExistingLocation = async (args, context) => {
  if (context.user.role_id !== 1) {
    throw new Error('This role cannot save Funeral Locations.');
  }
  const foundLocation = await FuneralLocation.findByPk(args.honorsLocationId);
  if (context.user.id !== foundLocation.user_id) {
    throw new Error('Users can only edit their own locations.');
  }

  const editedLocation = FuneralLocation.update(
    {
      name: args.serviceLocationName,
      address: args.honorsAddress,
      city: args.honorsCity,
      state: args.honorsState,
      county: args.honorsCounty,
      zip: args.honorsZip,
      notes: args.locationNotes,
      gps: args.honorsGps,
      user_id: context.user.id
    },
    {
      where: {
        id: args.honorsLocationId
      }
    }
  );
  return editedLocation;
};

const deleteRequestFD = async (reqEvents, reqId, context) => {
  const foundRequest = await Request.findByPk(reqId);
  if (context.user.id !== foundRequest.requestor_id) {
    saveError(
      context.user.id,
      context.reqIP,
      2,
      `FD attempted to delete another FD's Request with ID: ${reqId}`
    );
    throw new Error('Users can only delete their own requests.');
  }
  const canRequestBeDeleted =
    reqEvents.filter((reqEv) => schedulerEventTypes.includes(reqEv.eventType))
      .length === 0;
  if (!canRequestBeDeleted) {
    saveError(
      context.user.id,
      context.reqIP,
      4,
      `User attempting to delete request that should be cancelled, req ID: ${reqId}`
    );
    throw new Error(
      'User attempting to delete request that should be cancelled'
    );
  }
  return Request.destroy({
    where: { id: reqId }
  });
};

const deleteRequestSCH = async (reqEvents, reqId, context) => {
  const foundRequest = await Request.findByPk(reqId);
  if (foundRequest.isSchedulerCreated) {
    return Request.destroy({
      where: { id: reqId }
    });
  }
  if (reqEvents[reqEvents.length - 1].eventType === 'Cancelled') {
    return Request.destroy({
      where: { id: reqId }
    });
  }
  saveError(
    context.user.id,
    context.reqIP,
    4,
    `User attempting to delete request isn't cancelled, req ID: ${reqId}`
  );
  throw new Error('User attempting to delete request is not cancelled');
};

module.exports = {
  deCyrptingSSNsOnRequests,
  checkEventType,
  checkManageRole,
  saveNewLocation,
  saveExistingLocation,
  deleteRequestFD,
  deleteRequestSCH
};
