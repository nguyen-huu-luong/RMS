'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("TableReservations", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			  },
			tableId: {
				type: Sequelize.INTEGER,
				references: {
					model: "Tables",
					key: "id",
				},
				defaultValue: 1,
				allowNull: true,
				onDelete: "SET DEFAULT",
			},
			reservationId: {
				type: Sequelize.INTEGER,
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
