/* eslint-disable no-console */
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const db = require('./models/index');

function CheckPassword(username, password) {
  return db.User.findOne({ where: { email: username, isActive: true } }).then(
    (finduser) => {
      if (finduser === null) {
        throw new Error(`email address ${username} not found`);
      }
      const test = bcrypt.compareSync(password, finduser.password);
      return test;
    }
  );
}

function getUserBYEmail(username) {
  return db.User.findOne({
    where: { email: username },
    attributes: {
      exclude: ['password']
    }
  });
}

passport.use(
  'local',
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    (username, password, done) => {
      const checkPassword = CheckPassword(username, password);

      return checkPassword
        .then((isLoginValid) => {
          if (isLoginValid) {
            return getUserBYEmail(username);
          }

          throw new Error(`${username} Entered wrong password`);
        })
        .then((user) => {
          // console.log('User Logged In');
          return done(null, user);
        })
        .catch((err) => {
          console.log('Log in error');
          return done(err);
        });
    }
  )
);

passport.serializeUser((user, done) => {
  // console.log('serializing');
  done(null, user.email);
});

passport.deserializeUser((email, done) => {
  // console.log('de-serializing');
  getUserBYEmail(email).then((user, err) => {
    return done(err, user);
  });
});
