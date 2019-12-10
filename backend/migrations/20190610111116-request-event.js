module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('RequestEvents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      request_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Requests',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      eventType: {
        type: Sequelize.ENUM(
          'Sent',
          'Confirmed',
          'Alert',
          'Guard',
          'Denied',
          'Notice',
          'Missed',
          'Completed',
          'Acknowledged',
          'Ineligible',
          'Cancelled'
        )
      },
      creator_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      comment: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.dropTable('RequestEvents')]);
  }
};
