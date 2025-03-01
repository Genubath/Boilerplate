/* eslint-disable camelcase */
const db = require("../models/index");

const saveError = async (user_id, errorType_id, IP = null, message = "") => {
  const trimmedMessage = message.substring(0, 255);
  db.Error.build({
    user_id,
    errorType_id,
    message: trimmedMessage,
    IP
  }).save();
};

const saveLog = async (user_id, logType_id, IP = null, message = "") => {
  const trimmedMessage = message.substring(0, 255);
  db.Log.build({
    user_id,
    logType_id,
    message: trimmedMessage,
    IP
  }).save();
};

module.exports = { saveError, saveLog };
