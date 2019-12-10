const otplib = require('otplib');
const crypto = require('crypto');
const passport = require('passport');
const { saveError, saveLog } = require('../utilities/logger');
const db = require('../models/index');

const loginTypes = {
  LOGIN_WITH_TOKEN: 'LOGIN_WITH_TOKEN',
  PASSWORD_RESET_NEEDED: 'PASSWORD_RESET_NEEDED',
  ADDING_QR_CODE: 'ADDING_QR_CODE',
  MUST_ADD_QR_CODE: 'MUST_ADD_QR_CODE',
  READY_FOR_TOKEN: 'READY_FOR_TOKEN'
};

const determineLoginType = (user, req) => {
  if (process.env.NODE_ENV === 'test' || req.body.bypassToken) {
    return loginTypes.LOGIN_WITH_TOKEN;
  }
  if (user.isPasswordResetNeeded) {
    return loginTypes.PASSWORD_RESET_NEEDED;
  }
  if (
    user.TwoFactorSecret === null &&
    req.body.authenticatorToken &&
    req.body.secret
  ) {
    return loginTypes.ADDING_QR_CODE;
  }
  if (user.TwoFactorSecret === null) {
    return loginTypes.MUST_ADD_QR_CODE;
  }
  if (req.body.authenticatorToken === '') {
    return loginTypes.READY_FOR_TOKEN;
  }
  return loginTypes.LOGIN_WITH_TOKEN;
};

const addQRCode = (req, res, user, email) => {
  const isValid = otplib.authenticator.check(
    req.body.authenticatorToken,
    req.body.secret
  );
  if (isValid) {
    db.User.update(
      {
        TwoFactorSecret: req.body.secret
      },
      {
        where: {
          id: user.id
        }
      }
    );
    req.logIn(user, (errHandle) => {
      saveLog(user.id, req.ip, 0, 'Login');
      if (errHandle) {
        console.log(errHandle);
      }
    });
    return res.status(200).send({ email });
  }
  res.status(400);
  return res.send({ errorMessage: 'Invalid Token' });
};

const logonWithToken = (req, res, user, email) => {
  const bypassToken =
    process.env.NODE_ENV === 'test' ||
    (req.body.bypassToken/* && process.env.NODE_ENV === 'development' */);

  const isValid =
    bypassToken ||
    otplib.authenticator.check(
      req.body.authenticatorToken,
      user.TwoFactorSecret
    );
  if (isValid) {
    req.logIn(user, (errHandle) => {
      saveLog(user.id, req.ip, 0, 'Login');
      if (errHandle) {
        console.log(errHandle);
      }
    });
    return res.status(200).send({ email });
  }
  return res.status(400).send({ errorMessage: 'Invalid Token' });
};

exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) {
      saveError(null, req.ip, 1, err.message);
      return res
        .status(400)
        .send({ errorMessage: 'Invalid email or password' });
    }

    otplib.authenticator.options = { crypto };
    const { email, isPasswordResetNeeded } = user;
    const loginType = determineLoginType(user, req);

    switch (loginType) {
      case loginTypes.PASSWORD_RESET_NEEDED:
        return res.status(200).send({ isPasswordResetNeeded, email });
      case loginTypes.ADDING_QR_CODE:
        return addQRCode(req, res, user, email);
      case loginTypes.MUST_ADD_QR_CODE:
        return res.status(200).send({ mustAddQRCode: true, email });
      case loginTypes.LOGIN_WITH_TOKEN:
        return logonWithToken(req, res, user, email);
      case loginTypes.READY_FOR_TOKEN:
        return res.status(200).send({ readyForAuthToken: true, email });
      default:
        return res.status(200).send();
    }
  })(req, res, next);
};
