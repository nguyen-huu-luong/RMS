'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("TableReservations", {
			tableId: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				references: {
					model: "Tables",
					key: "id",
				},
				allowNull: false,
				onDelete: "CASCADE",
			},
			reservationId: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				references: {
					model: "Reservations",
					key: "id",
				},
				allowNull: false,
				onDelete: "CASCADE",
			},
			createdAt: {
				type: Sequelize.DATE,
			},
			updatedAt: {
				type: Sequelize.DATE,
			},
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable("TableReservations");
	},
};
