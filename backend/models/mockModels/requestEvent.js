module.exports = (sequelize) => {
  const RequestEvent = sequelize.define(
    'RequestEvent',
    {
      id: 1,
      request_id: 54,
      creator_id: 1,
      eventType: 'Sent',
      comment: ''
    },
    {}
  );
  RequestEvent.findByPk = RequestEvent.findById;

  return RequestEvent;
};
