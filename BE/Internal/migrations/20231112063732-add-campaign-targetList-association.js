// 20231112063732-add-campaign-targetList-association.js
"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("CampaignTargetLists", {
			campaignId: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				references: {
					model: "Campaigns",
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
		await queryInterface.dropTable("CampaignTargetLists");
	},
};
