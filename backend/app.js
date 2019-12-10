/* eslint-disable no-console */
const passport = require('passport');
const session = require('express-session');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const { GraphQLServer } = require('graphql-yoga');
const gql = require('graphql-tag');
const os = require('os');
const uuid = require('uuid/v4');
const Schema = require('./graphql/schema');
const upload = require('./controllers/upload.controller');
const download = require('./controllers/download.controller');
const passwordReset = require('./controllers/passwordReset.controller');
const frontEndErrorLogger = require('./controllers/frontEndErrorLogger');
const twoFactorController = require('./controllers/twoFactor.controller');
const loginController = require('./controllers/loginController');
const { saveError, saveLog } = require('./utilities/logger');
const { loginLimiter, resetPWLimiter } = require('./utilities/rateLimiters');

const port = process.env.PORT || 3000;
let localhostIP = process.env.ORIGIN;

if (
  process.env.NODE_ENV === 'development' &&
  process.env.IP_ADDRESS_MODE_ON === 'true'
) {
  const interfaces = os.networkInterfaces();
  const broadCast = interfaces.eth0;
  if (broadCast) {
    if (!broadCast[0].internal && broadCast[0].family === 'IPv4') {
      localhostIP = `http://${broadCast[0].address}:8080`;
    }
  }
}

console.log('ENV: ', process.env.NODE_ENV);

const corsOptions = {
  origin: localhostIP,
  credentials: true
};

const server = new GraphQLServer({
  schema: Schema,
  origin: localhostIP,
  cors: corsOptions,
  context: (req) => {
    const { user } = req.request;
    const reqIP = req.request.ip;
    return { user, reqIP };
  }
});

server.express.use(helmet());

// db.sequelize.sync();

const optionServer = {
  port,
  formatError: (error) => {
    let firstTwoLines = '';
    if (error.stack) {
      const splitStack = error.stack.split('\n');
      if (splitStack[0] && splitStack[1]) {
        firstTwoLines = `${splitStack[0]} ${splitStack[1]}`;
      } else {
        firstTwoLines = error.message;
      }
    }
    console.log(error);
    if (error.stack.substring(0, 5) !== 'Error') {
      saveError(
        null,
        null,
        5,
        `path: ${error.path}, Message: ${firstTwoLines}`
      );
      console.log('Non-Intentional Exception');
    }
    return error;
    // Or, you can delete the exception information
    // delete error.extensions.exception;
    // return error;
  }
};

server.express.use('/', express.static('dist'));
server.express.get('*', (req, res) => {
  const path = require('path');
  res.sendFile(path.resolve('dist/index.html'));
});

server.express.use(
  cors({
    origin: localhostIP,
    credentials: true
  })
);

require('./auth');

server.express.use(flash());

server.express.use(
  session({
    genid: () => {
      return uuid();
    },
    saveUninitialized: true,
    resave: true,
    rolling: true,
    // TODO: add secret to env
    secret: 'kjdfkshdfkjxldnfue',
    cookie: {
      maxAge: process.env.NODE_ENV !== 'development' ? 900000 : 36000000, // Time also in AuthRefresher.js
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    }
  })
);
server.express.set('trust proxy', true);
server.express.use(cookieParser());
server.express.use(bodyParser.json());
server.express.use(passport.initialize());
server.express.use(passport.session());

server.express.post('/login', loginLimiter);
server.express.post('/VerifiyToken', resetPWLimiter);

server.express.use((req, res, next) => {
  const resTime = new Date().toString();
  res.cookie('lastResponseTime', resTime, { httpOnly: false });
  next();
});

server.express.post('/login', loginController.login);

server.express.post('/logOut', (req, res) => {
  if (req.user) {
    saveLog(req.user.id, req.ip, 1, 'Logout');
  }
  console.log('hit log out');
  req.logout();
  return res.send('res.send hit');
});

server.express.post('/refreshLogin', (req, res) => {
  if (!req.user) {
    saveError(
      null,
      req.ip,
      6,
      'Unauthorized user attempting to hit refreshLogin'
    );
    return res.status(401).send('Unauthorized');
  }
  console.log('login Refreshed');
  return res.send('login refreshed');
});

server.express.post('/upload', upload.upload);
server.express.post('/getUploadURL', upload.getUploadURL);
server.express.post('/getDownloadLink', download.getDownloadLink);
server.express.post('/ForgotPassword', passwordReset.ForgotPassword);
server.express.post('/VerifiyToken', passwordReset.VerifyToken);
server.express.post('/ResetPassword', passwordReset.ResetPassword);
server.express.post('/ChangePassword', passwordReset.ChangePassword);
server.express.post('/logFrontEndError', frontEndErrorLogger.logFrontEndError);
server.express.post('/generateSecret', twoFactorController.generateSecret);
server.express.post('/submitToken', twoFactorController.submitToken);

// eslint-disable-next-line consistent-return
server.express.use('/', (req, res, next) => {
  if (req.body && req.body.query) {
    const queryName = gql(req.body.query).definitions[0].selectionSet
      .selections[0].name.value;
    if (queryName === 'createUser') {
      next();
    }
    // return error if user is not authenticated
    else if (!req.user) {
      console.log('unauthorized user:');
      saveError(
        null,
        req.ip,
        6,
        `Unauthorized user attempting to hit GraphQL endpoint: ${queryName}`
      );
      return res.status(401).send('You are not authorized');
    } else {
      next();
      res.header('Access-Control-Allow-Origin', localhostIP);
    }
  }
});

console.log(`Server up at ${localhostIP}`);
const serverListener = server.start(optionServer);

module.exports = serverListener;
