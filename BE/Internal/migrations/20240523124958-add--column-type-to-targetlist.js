module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('TargetLists', 'type', {
      type: Sequelize.STRING,
      allowNull: true, // Set to false if you want to make it non-nullable
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('TargetLists', 'type');
  }
};