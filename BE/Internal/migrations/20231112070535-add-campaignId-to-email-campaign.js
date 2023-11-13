// 20231112070535-add-campaignId-to-email-campaign.js
"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.addColumn("EmailCampaigns", "campaignId", {
			type: Sequelize.INTEGER,
			references: {
				model: "Campaigns",
				key: "id",
			},
			onUpdate: "CASCADE",
			onDelete: "CASCADE",
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.removeColumn("EmailCampaigns", "campaignId");
	},
};