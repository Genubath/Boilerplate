const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define(
    'RequestEvent',
    {
      request_id: Sequelize.INTEGER,
      creator_id: Sequelize.INTEGER,
      eventType: {
        type: Sequelize.ENUM,
        values: ['Sent', 'Confirmed', 'Alert', 'Guard', 'Denied']
      },
      comment: DataTypes.STRING
    },
    {}
  );
  return Request;
};
