const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const db = require('../models/index');
const { saveError, saveLog } = require('../utilities/logger');

exports.ForgotPassword = (req, res) => {
  const token = Array(8)
    .fill(
      '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*'
    )
    .map((x) => {
      return x[Math.floor(Math.random() * x.length)];
    })
    .join('');

  const smtpTransport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use TLS
    auth: {
      user: 'Mercury.App.Mail@gmail.com',
      pass: process.env.EMAIL_PASSWORD
    }
  });

  db.User.findOne({ where: { email: req.body.email, isActive: true } })
    .then((foundUser) => {
      if (!foundUser) {
        saveError(
          null,
          3,
          `User requested password reset for non-existing account ${
            req.body.email
          }`
        );
        res.status(200).end();
        return;
      }
      saveLog(
        null,
        req.ip,
        6,
        `User requested password reset for existing account ${req.body.email}`
      );
      db.VerificationToken.build({
        user_id: foundUser.id,
        token
      })
        .save()
        .then(() => {
          smtpTransport.sendMail({
            from: 'sender@example.com',
            to: req.body.email,
            subject: 'Mercury Password Reset',
            html: `
              <h1>Hello ${foundUser.firstName}</h1>
              <span>We got a request to reset your Mercury password.</span><br/><br/>
              <span>Your Password Reset verification code is: <b>${token}</b></span><br/><br/>
              <span>If you ignore this message, your password will not be changed.</span><br/>
              <span>If you did not request to change your password, please contact us at blah@blah.com</span>
              
            `
          });
        })
        .then(() => {
          res.status(200).send();
        })
        .catch((err) => {
          throw new Error(err);
        });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

const findToken = (token) => {
  return new Promise((resolve, reject) => {
    db.VerificationToken.findOne({
      where: { token }
    })
      .then((foundToken) => {
        if (!foundToken) {
          throw new Error('Bad Request');
        }
        resolve(foundToken);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.VerifyToken = async (req, res) => {
  findToken(req.body.token)
    .then((foundToken) => {
      saveLog(
        null,
        req.ip,
        6,
        `Password reset token used for User: ${foundToken.user_id}`
      );
      res.status(200).send({ token: foundToken.token });
    })
    .catch((err) => {
      saveError(
        null,
        req.ip,
        3,
        'Attempted password reset with non-existant token'
      );
      res.status(400).send({ message: err });
    });
};

exports.ResetPassword = async (req, res) => {
  findToken(req.body.token)
    .then((foundToken) => {
      db.User.update(
        { password: bcrypt.hashSync(req.body.password, 12) },
        { where: { id: foundToken.user_id } }
      );
      saveLog(
        foundToken.user_id,
        req.ip,
        6,
        `Password successfully changed for: ${foundToken.user_id}`
      )
        .then(() => {
          return db.VerificationToken.destroy({
            where: { id: foundToken.id }
          })
            .then(() => {
              return res.status(200).send();
            })
            .catch((err) => {
              throw new Error(err);
            });
        })
        .catch((err) => {
          res.status(400).send({ message: err });
        });
    })
    .catch((err) => {
      res.status(400).send({ message: err });
    });
};

exports.ChangePassword = async (req, res) => {
  if (req.body.confirmPassword !== req.body.newPassword) {
    saveError(null, req.ip, 3, 'New password and confirmation do not match');
    res
      .status(400)
      .send({ message: 'New password and confirmation do not match' });
  }

  if (req.body.oldPassword === req.body.newPassword) {
    saveError(null, req.ip, 3, 'New password and Old password can not match');
    res
      .status(400)
      .send({ message: 'New password and Old password can not match' });
  }

  const foundUser = await db.User.findOne({
    where: { email: req.body.email, isPasswordResetNeeded: true }
  });

  if (!foundUser) {
    saveError(
      null,
      req.ip,
      3,
      `Password change error, invalid email: ${req.body.email}`
    );
    throw new Error('Invalid email or password');
  }

  if (!bcrypt.compareSync(req.body.oldPassword, foundUser.password)) {
    saveError(null, req.ip, 3, 'Password change error, incorrect old password');
    throw new Error('Password Match Error');
  }

  if (foundUser.TwoFactorSecret === null) {
    return res.status(202).send('Requires Two Factor Secret');
  }

  return db.User.update(
    {
      password: bcrypt.hashSync(req.body.newPassword, 12),
      isPasswordResetNeeded: false
    },
    {
      where: {
        id: foundUser.id
      }
    }
  )
    .then(() => {
      saveLog(
        foundUser.id,
        req.ip,
        6,
        `Password successfully changed for: ${foundUser.user_id}`
      );
      return res.status(200).send();
    })
    .catch((err) => {
      return res.status(400).send({ message: err });
    });
};
