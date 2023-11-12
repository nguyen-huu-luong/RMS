// 20231112060232-add-client-targetList-association.js
"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("ClientTargetLists", {
			clientId: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				references: {
					model: "Clients",
					key: "id",
				},
				allowNull: false,
				onDelete: "CASCADE",
			},
			targetListId: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				references: {
					model: "TargetLists",
					key: "id",
				},
				allowNull: false,
				onDelete: "CASCADE",
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable("ClientTargetLists");
	},
};
