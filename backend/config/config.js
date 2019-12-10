if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

let credentials;
if (process.env.VCAP_SERVICES) {
  // eslint-disable-next-line prefer-destructuring
  credentials = JSON.parse(process.env.VCAP_SERVICES)['aws-rds'][0].credentials;
} else {
  credentials = {
    username: '',
    password: '',
    db_name: '',
    host: ''
  };
}

// eslint-disable-next-line camelcase
const { username, password, db_name, host } = credentials;

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    dialect: 'mysql'
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_TEST_NAME,
    host: process.env.DB_HOSTNAME,
    dialect: 'mysql',
    logging: false
  },
  backendUnit: {
    username: '',
    password: '',
    database: '',
    host: '',
    dialect: 'mysql',
    logging: false
  },
  acceptance: {
    username,
    password,
    database: db_name,
    host,
    dialect: 'mysql'
  },
  production: {
    username,
    password,
    database: db_name,
    host,
    dialect: 'mysql'
  }
};
