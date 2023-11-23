// 20231112081144-add-cart-product-association.js
"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("CartItems", {
			cartId: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				references: {
					model: "Carts",
					key: "id",
				},
				allowNull: false,
				onDelete: "CASCADE",
			},
			productId: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				references: {
					model: "Products",
					key: "id",
				},
				allowNull: false,
				onDelete: "CASCADE",
			},
            amount: {
                type: Sequelize.FLOAT,
                allowNull: false,
                defaultValue: 0
            },
            quantity: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
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
		await queryInterface.dropTable("CartItems");
	},
};
