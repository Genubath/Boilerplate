module.exports = (sequelize) => {
  const Log = sequelize.define(
    'Log',
    {
      user_id: 1,
      logType_id: 1,
      message: 'testMessage'
    },
    {}
  );
  return Log;
};
