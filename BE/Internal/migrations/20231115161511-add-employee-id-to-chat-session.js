'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.addColumn("ChatSessions", "employeeId", {
			type: Sequelize.INTEGER,
			references: {
				model: "Employees",
				key: "id",
			},
			onUpdate: "CASCADE",
			onDelete: "CASCADE",
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.removeColumn("ChatSessions", "employeeId");
	},
};
