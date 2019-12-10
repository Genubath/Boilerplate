module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('FuneralHomes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      address:{type: Sequelize.STRING},
      city:{type: Sequelize.STRING},
      state:{type: Sequelize.STRING},
      county:{type: Sequelize.STRING},
      zip:{type: Sequelize.STRING},
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
  down: (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.dropTable('FuneralHomes')]);
  }
};
