'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.addColumn("ChatMessages", "sessionId", {
			type: Sequelize.INTEGER,
			references: {
				model: "ChatSessions",
				key: "id",
			},
			onUpdate: "CASCADE",
			onDelete: "CASCADE",
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.removeColumn("ChatMessages", "sessionId");
	},
};
