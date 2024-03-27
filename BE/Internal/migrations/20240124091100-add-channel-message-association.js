'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
		await queryInterface.addColumn("Messages", "channelId", {
			type: Sequelize.INTEGER,
			references: {
				model: "Channels",
				key: "id",
			},
			onUpdate: "CASCADE",
			onDelete: "CASCADE",
		});
  },

  down: async (queryInterface, Sequelize) => {
		await queryInterface.removeColumn("Messages", "channelId");
  }
};
