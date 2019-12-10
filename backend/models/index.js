/* eslint-disable security/detect-object-injection */
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const SequelizeMock = require('sequelize-mock');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
// eslint-disable-next-line security/detect-non-literal-require
const config = require(`${__dirname}/../config/config.js`)[env]; // eslint-disable-line import/no-dynamic-require
const db = {};
let sequelize;

const isBackendUnit = process.env.LOADED_MOCHA_OPTS;

isBackendUnit
  ? (sequelize = new SequelizeMock())
  : (sequelize = new Sequelize(
      config.database,
      config.username,
      config.password,
      config
    ));

// eslint-disable-next-line security/detect-non-literal-fs-filename
fs.readdirSync(isBackendUnit ? path.join(__dirname, 'mockModels') : __dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    );
  })
  .forEach((file) => {
    let model;

    isBackendUnit
      ? (model = sequelize.import(path.join(__dirname, 'mockModels', file)))
      : (model = sequelize.import(path.join(__dirname, file)));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;

module.exports = db;
