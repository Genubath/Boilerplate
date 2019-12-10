module.exports = (sequelize) => {
  const Error = sequelize.define(
    'Error',
    {
      user_id: 1,
      errorType_id: 1,
      message: ''
    },
    {}
  );
  return Error;
};
