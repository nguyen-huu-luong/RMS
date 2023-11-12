// 20231112055425-add-creator-id-to-clients.js
"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.addColumn("Clients", "creatorId", {
			type: Sequelize.INTEGER,
			references: {
				model: "Employees",
				key: "id",
			},
			onUpdate: "CASCADE",
			onDelete: "SET NULL",
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.removeColumn("Clients", "creatorId");
	},
};
