'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.addColumn("Vouchers", "categoryId", {
			type: Sequelize.INTEGER,
			references: {
				model: "Categories",
				key: "id",
			},
			onUpdate: "CASCADE",
			onDelete: "CASCADE",
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.removeColumn("Vouchers", "categoryId");
	},
};
