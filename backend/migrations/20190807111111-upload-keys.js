module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('UploadKeys', {
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
        onDelete: 'SET NULL'
      },
      fileKey: {
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
    return Promise.all([queryInterface.dropTable('UploadKeys')]);
  }
};
