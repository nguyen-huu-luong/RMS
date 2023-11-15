'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.addColumn("Reservations", "creatorID", {
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
		await queryInterface.removeColumn("Reservations", "creatorID");
	},
};
