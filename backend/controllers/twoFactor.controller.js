const authenticator = require('otplib/authenticator');
const crypto = require('crypto');
const otplib = require('otplib');
const bcrypt = require('bcryptjs');
const db = require('../models/index');

const { saveError } = require('../utilities/logger');

authenticator.options = { crypto };

// Post: /upload
// eslint-disable-next-line consistent-return
exports.generateSecret = (req, res) => {
  const user = req.body.email || 'User';
  const service = 'Mercury';
  const newSecret = authenticator.generateSecret();

  // const otpauth = otplib.authenticator.keyuri(user, service, newSecret);
  const otpauth = otplib.authenticator.keyuri(
    user,
    service,
    newSecret
  );

  return res.status(200).send({ Secret: newSecret, otp: otpauth });
};

exports.submitToken = async (req, res) => {
  const {
    secret,
    authenticatorToken,
    oldPassword,
    newPassword,
    confirmPassword,
    email
  } = req.body;

  if (confirmPassword !== newPassword) {
    saveError(null, req.ip, 3, 'New password and confirmation do not match');
    res
      .status(400)
      .send({ message: 'New password and confirmation do not match' });
  }

  if (oldPassword === newPassword) {
    saveError(null, req.ip, 3, 'New password and Old password can not match');
    res
      .status(400)
      .send({ message: 'New password and Old password can not match' });
  }

  const foundUser = await db.User.findOne({
    where: { email, isPasswordResetNeeded: true }
  });

  if (!foundUser) {
    saveError(
      null,
      req.ip,
      3,
      `Password change error, invalid email: ${email}`
    );
    throw new Error('Invalid email or password');
  }

  if (!bcrypt.compareSync(oldPassword, foundUser.password)) {
    saveError(null, req.ip, 3, 'Password change error, incorrect old password');
    throw new Error('Password Match Error');
  }

  const isValid = otplib.authenticator.check(authenticatorToken, secret);

  if (isValid) {
    await db.User.update(
      {
        password: bcrypt.hashSync(newPassword, 12),
        TwoFactorSecret: secret,
        isPasswordResetNeeded: false
      },
      {
        where: {
          id: foundUser.id
        }
      }
    );
    res.status(200).send('Authenticated!');
  } else {
    res.status(400).send('Bad Token');
  }
};
