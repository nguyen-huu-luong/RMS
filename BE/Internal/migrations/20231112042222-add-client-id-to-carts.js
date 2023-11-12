// 20231112042222-add-client-id-to-carts.js
"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.addColumn("Carts", "clientId", {
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
		await queryInterface.removeColumn("Carts", "clientId");
	},
};
