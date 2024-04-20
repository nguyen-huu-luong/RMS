'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
		await queryInterface.addColumn("Clients", "groupId", {
			type: Sequelize.INTEGER,
			references: {
				model: "Groups",
				key: "id",
			},
			onUpdate: "CASCADE",
			onDelete: "SET NULL",
		});
  },

  down: async (queryInterface, Sequelize) => {
		await queryInterface.removeColumn("Clients", "groupId");
  }
};