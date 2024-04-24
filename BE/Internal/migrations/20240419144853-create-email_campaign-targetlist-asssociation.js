"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("EmailCampaignTargetLists", {
			emailId: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				references: {
					model: "EmailCampaigns",
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
		await queryInterface.dropTable("EmailCampaignTargetLists");
	},
};
