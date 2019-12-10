module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastname: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING,
        unique: true
      },
      funeralName: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      phoneNumber: {
        type: Sequelize.STRING
      },
      faxNumber: {
        type: Sequelize.STRING
      },
      rank: {
        type: Sequelize.ENUM(
          'AB',
          'Amn',
          'A1C',
          'SrA',
          'SSgt',
          'TSgt',
          'MSgt',
          'SMSgt',
          'CMSgt',
          '2d Lt',
          '1st Lt',
          'Capt',
          'Maj',
          'Lt Col',
          'Col',
          'Brig Gen',
          'Maj Gen',
          'Lt Gen',
          'Gen'
        )
      },
      presetLocationId: {
        type: Sequelize.INTEGER
      },
      presetFuneralHomeId: {
        type: Sequelize.INTEGER
      },
      role_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'UserRoles',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      unit: {
        type: Sequelize.STRING
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      isPasswordResetNeeded: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
    return Promise.all([queryInterface.dropTable('Users')]);
  }
};
