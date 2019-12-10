
const { saveError } = require('../utilities/logger');

// Post: /upload
// eslint-disable-next-line consistent-return
exports.logFrontEndError = (req, res) => {
  let userId = null;
  if (req.user) {
    userId = req.user.id;
  }
  const logMessage = req.body.errorMessageToSend

  saveError(userId, req.ip, 8, `FE Error: Message: ${logMessage}`);

  return res.status(200).send('Error Message Logged');
};
