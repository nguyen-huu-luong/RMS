'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
		await queryInterface.addColumn("EmailCampaigns", "templateId", {
			type: Sequelize.INTEGER,
			references: {
				model: "MessageTemplates",
				key: "id",
			},
      allowNull: true,
			onUpdate: "CASCADE",
			onDelete: "CASCADE",
		});
  },

  down: async (queryInterface, Sequelize) => {
		await queryInterface.removeColumn("EmailCampaigns", "templateId");
  }
};