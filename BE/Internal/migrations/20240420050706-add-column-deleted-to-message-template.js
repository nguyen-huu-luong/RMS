'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("MessageTemplates", "deleted", {
			type: Sequelize.BOOLEAN,
      defaultValue: false
		});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("MessageTemplates", "deleted");
  }
};
