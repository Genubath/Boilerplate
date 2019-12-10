module.exports = {
  up: function(queryInterface, Sequelize) {
    // logic for transforming into the new state

    return Promise.all([
      // queryInterface.sequelize.query(`SET GLOBAL event_scheduler = ON;`),
      queryInterface.sequelize.query(`
        CREATE EVENT IF NOT EXISTS delete_verification_tokens
        ON SCHEDULE EVERY 1 MINUTE
        DO
        DELETE FROM VerificationTokens WHERE createdAt < DATE_SUB(NOW(), INTERVAL 15 MINUTE);
        `)
    ]);
  },

  down: function(queryInterface, Sequelize) {
    // logic for reverting the changes
    return Promise.all([
      queryInterface.sequelize.query(
        `DROP EVENT IF EXISTS delete_verification_tokens;`
      )
    ]);
  }
};
