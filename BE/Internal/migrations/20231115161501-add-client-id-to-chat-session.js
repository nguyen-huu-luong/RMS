'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.addColumn("ChatSessions", "clientId", {
			type: Sequelize.INTEGER,
			references: {
				model: "Clients",
				key: "id",
			},
			onUpdate: "CASCADE",
			onDelete: "CASCADE",
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.removeColumn("ChatSessions", "clientId");
	},
};
