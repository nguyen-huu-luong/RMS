'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("TableOrders", {
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
			orderId: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				references: {
					model: "Orders",
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
		await queryInterface.dropTable("TableOrders");
	},
};
