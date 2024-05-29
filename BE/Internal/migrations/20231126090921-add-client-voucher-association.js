'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("ClientVouchers", {
			clientId: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				references: {
					model: "Clients",
					key: "id",
				},
				allowNull: false,
				onDelete: "CASCADE",
			},
			voucherId: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				references: {
					model: "Vouchers",
					key: "id",
				},
				allowNull: false,
				onDelete: "CASCADE",
			},
			status: {
				allowNull: false,
				type: Sequelize.BOOLEAN,	
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
		await queryInterface.dropTable("ClientVouchers");
	},
};
