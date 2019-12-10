const submitDate = new Date();
submitDate.setDate(submitDate.getDate() - 3);

const confirmedDate = new Date();
confirmedDate.setDate(confirmedDate.getDate() - 4);

const sentDate = new Date();
sentDate.setDate(sentDate.getDate() - 5);

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(
      'RequestEvents',
      [
        {
          request_id: 1,
          creator_id: 1,
          eventType: 'Sent',
          comment: '',
          createdAt: sentDate,
          updatedAt: sentDate
        },
        {
          request_id: 1,
          creator_id: 2,
          eventType: 'Confirmed',
          comment: '',
          createdAt: confirmedDate,
          updatedAt: confirmedDate
        },
        {
          request_id: 2,
          creator_id: 1,
          eventType: 'Sent',
          comment: '',
          createdAt: sentDate,
          updatedAt: sentDate
        },
        {
          request_id: 2,
          creator_id: 2,
          eventType: 'Confirmed',
          comment: '',
          createdAt: confirmedDate,
          updatedAt: confirmedDate
        },
        {
          request_id: 3,
          creator_id: 1,
          eventType: 'Sent',
          comment: '',
          createdAt: sentDate,
          updatedAt: sentDate
        },
        {
          request_id: 4,
          creator_id: 1,
          eventType: 'Sent',
          comment: '',
          createdAt: sentDate,
          updatedAt: sentDate
        },
        {
          request_id: 4,
          creator_id: 2,
          eventType: 'Alert',
          comment:
            'Address not located on Google Maps, please supply a different address',
          createdAt: confirmedDate,
          updatedAt: confirmedDate
        },
        {
          request_id: 5,
          creator_id: 1,
          eventType: 'Sent',
          comment: '',
          createdAt: sentDate,
          updatedAt: sentDate
        },
        {
          request_id: 5,
          creator_id: 2,
          eventType: 'Guard',
          comment: '',
          createdAt: confirmedDate,
          updatedAt: confirmedDate
        },
        {
          request_id: 6,
          creator_id: 1,
          eventType: 'Sent',
          comment: '',
          createdAt: sentDate,
          updatedAt: sentDate
        },
        {
          request_id: 7,
          creator_id: 1,
          eventType: 'Sent',
          comment: '',
          createdAt: sentDate,
          updatedAt: sentDate
        },
        {
          request_id: 7,
          creator_id: 2,
          eventType: 'Denied',
          comment: 'Already had a funeral',
          createdAt: confirmedDate,
          updatedAt: confirmedDate
        },
        {
          request_id: 8,
          creator_id: 1,
          eventType: 'Sent',
          comment: '',
          createdAt: sentDate,
          updatedAt: sentDate
        },
        {
          request_id: 9,
          creator_id: 1,
          eventType: 'Sent',
          comment: '',
          createdAt: sentDate,
          updatedAt: sentDate
        },
        {
          request_id: 10,
          creator_id: 1,
          eventType: 'Sent',
          comment: '',
          createdAt: sentDate,
          updatedAt: sentDate
        },
        {
          request_id: 11,
          creator_id: 1,
          eventType: 'Sent',
          comment: '',
          createdAt: sentDate,
          updatedAt: sentDate
        },
        {
          request_id: 12,
          creator_id: 1,
          eventType: 'Sent',
          comment: '',
          createdAt: sentDate,
          updatedAt: sentDate
        },
        {
          request_id: 13,
          creator_id: 1,
          eventType: 'Sent',
          comment: '',
          createdAt: sentDate,
          updatedAt: sentDate
        },
        {
          request_id: 13,
          creator_id: 2,
          eventType: 'Notice',
          comment:
            'Not enough man power to support a full 2 man, will only be able to send one member',
          createdAt: confirmedDate,
          updatedAt: confirmedDate
        },
        {
          request_id: 14,
          creator_id: 1,
          eventType: 'Sent',
          comment: '',
          createdAt: sentDate,
          updatedAt: sentDate
        },
        {
          request_id: 14,
          creator_id: 2,
          eventType: 'Confirmed',
          comment: '',
          createdAt: confirmedDate,
          updatedAt: confirmedDate
        },
        {
          request_id: 14,
          creator_id: 1,
          eventType: 'Sent',
          comment: '',
          createdAt: submitDate,
          updatedAt: submitDate
        },
        {
          request_id: 15,
          creator_id: 1,
          eventType: 'Sent',
          comment: '',
          createdAt: sentDate,
          updatedAt: sentDate
        },
        {
          request_id: 15,
          creator_id: 1,
          eventType: 'Cancelled',
          comment: '',
          createdAt: confirmedDate,
          updatedAt: confirmedDate
        }
      ],
      {}
    );
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('RequestEvents', null, {});
  }
};
