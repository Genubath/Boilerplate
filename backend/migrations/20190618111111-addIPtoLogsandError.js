module.exports = {
    up: function(queryInterface, Sequelize) {
      // logic for transforming into the new state
  
      return Promise.all([
        queryInterface.addColumn('Logs', 'IP', {
          type: Sequelize.STRING
        }),
        queryInterface.addColumn('Errors', 'IP', {
          type: Sequelize.STRING
        })
      ]);
    },
  
    down: function(queryInterface, Sequelize) {
      // logic for reverting the changes
      return Promise.all([
        queryInterface.removeColumn('Logs', 'IP'),
        queryInterface.removeColumn('Errors', 'IP')
      ]);
    }
  };
  